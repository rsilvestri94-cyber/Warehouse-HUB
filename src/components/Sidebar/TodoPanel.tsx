import { useCallback, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import type { Priority, Todo } from "../../types/todo";
import { useDwellSeen } from "../../hooks/useDwellSeen";
import { PriorityBars } from "./PriorityBars";
import { TodoRow } from "./TodoRow";

export function TodoPanel({
  todos,
  unseenIds,
  onAdd,
  onToggle,
  onSetPriority,
  onEditText,
  onDelete,
  onSeen,
}: {
  todos: Todo[];
  unseenIds: Set<string>;
  onAdd: (text: string, priority: Priority) => void;
  onToggle: (item: Todo) => void;
  onSetPriority: (item: Todo, p: Priority) => void;
  onEditText: (item: Todo, text: string) => void;
  onDelete: (item: Todo) => void;
  onSeen: () => void;
}) {
  const { t } = useI18n();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>(2);

  const handleSeen = useCallback(() => onSeen(), [onSeen]);
  const dwellRef = useDwellSeen<HTMLDivElement>(handleSeen);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text, priority);
    setText("");
  };

  const active = todos.filter(td => !td.done).sort((a, b) => b.priority - a.priority);
  const done = todos.filter(td => td.done);

  return (
    <div ref={dwellRef} className="rounded-2xl border border-grey-line bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <h3 className="font-heading text-sm font-bold text-ink">{t.todoTitle}</h3>
        {unseenIds.size > 0 && (
          <span className="rounded-full bg-brand-red px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
            {unseenIds.size > 9 ? "9+" : unseenIds.size}
          </span>
        )}
        <span className="ml-auto text-[0.7rem] text-ink/40">{t.progress(done.length, todos.length)}</span>
      </div>

      <div className="flex gap-1.5">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          maxLength={140}
          placeholder={t.todoPlaceholder}
          className="min-w-0 flex-1 rounded-lg border border-grey-line px-2.5 py-1.5 text-sm outline-none focus:border-accent"
        />
        <button
          type="button"
          onClick={handleAdd}
          title={t.todoAddTitle}
          className="flex shrink-0 items-center justify-center rounded-lg bg-blue-dark px-2.5 text-white hover:bg-blue-mid"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <span className="text-[0.65rem] font-semibold text-ink/50">{t.priorityLabel}</span>
        <PriorityBars value={priority} onSelect={setPriority} />
      </div>

      <ul className="mt-3 flex flex-col gap-1">
        {todos.length === 0 && <p className="py-4 text-center text-xs text-ink/40">{t.emptyTodos}</p>}
        {active.map(item => (
          <TodoRow
            key={item.id}
            item={item}
            isNew={unseenIds.has(item.id)}
            onToggle={() => onToggle(item)}
            onSetPriority={p => onSetPriority(item, p)}
            onEditText={text2 => onEditText(item, text2)}
            onDelete={() => onDelete(item)}
          />
        ))}
        {active.length > 0 && done.length > 0 && <hr className="my-1 border-grey-line" />}
        {done.map(item => (
          <TodoRow
            key={item.id}
            item={item}
            isNew={unseenIds.has(item.id)}
            onToggle={() => onToggle(item)}
            onSetPriority={p => onSetPriority(item, p)}
            onEditText={text2 => onEditText(item, text2)}
            onDelete={() => onDelete(item)}
          />
        ))}
      </ul>
    </div>
  );
}
