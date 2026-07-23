import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import type { Priority, Todo } from "../../types/todo";
import { PriorityBars } from "./PriorityBars";

export function TodoRow({
  item,
  isNew,
  onToggle,
  onSetPriority,
  onEditText,
  onDelete,
}: {
  item: Todo;
  isNew: boolean;
  onToggle: () => void;
  onSetPriority: (p: Priority) => void;
  onEditText: (text: string) => void;
  onDelete: () => void;
}) {
  const { lang, t } = useI18n();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);

  const commit = () => {
    setEditing(false);
    onEditText(draft);
  };

  return (
    <li
      className={`flex items-start gap-2 rounded-lg p-2 transition ${
        isNew ? "bg-accent/10 ring-1 ring-accent/40" : "hover:bg-grey-bg"
      } ${item.done ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        title={item.done ? t.markUndoTitle : t.markDoneTitle}
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 ${
          item.done ? "border-accent bg-accent" : "border-grey-line"
        }`}
      >
        {item.done && (
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-2.5 w-2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        {editing ? (
          <input
            autoFocus
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={e => e.key === "Enter" && commit()}
            className="w-full rounded border border-accent px-1.5 py-0.5 text-sm outline-none"
          />
        ) : (
          <p
            onClick={() => !item.done && setEditing(true)}
            className={`truncate text-sm text-ink ${item.done ? "line-through" : "cursor-text"}`}
          >
            {item.text}
          </p>
        )}
        <div className="mt-1 flex items-center justify-between">
          <PriorityBars value={item.priority} onSelect={onSetPriority} compact />
          <span className="text-[0.65rem] text-ink/40">
            {item.author} · {new Date(item.date).toLocaleDateString(lang === "it" ? "it-IT" : "en-GB", { day: "2-digit", month: "2-digit" })}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onDelete}
        title={t.deleteTaskTitle}
        className="shrink-0 rounded p-1 text-ink/25 hover:bg-brand-red/10 hover:text-brand-red"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </li>
  );
}
