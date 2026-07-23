import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useI18n } from "../../i18n/I18nContext";
import type { Tool } from "../../types/tool";
import { ToolIcon } from "./ToolIcon";
import { ToolForm, type ToolFormValues } from "./ToolForm";

export function ToolCard({
  tool,
  editing,
  onStartEdit,
  onCancelEdit,
  onSave,
}: {
  tool: Tool;
  editing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onSave: (values: ToolFormValues) => void;
}) {
  const { lang, t } = useI18n();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tool.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    "--tool-color": tool.color || undefined,
  } as React.CSSProperties;

  if (editing) {
    return (
      <div ref={setNodeRef} style={style}>
        <ToolForm
          initial={{ title: tool.title[lang], description: tool.description[lang], url: tool.url, icon: tool.icon, color: tool.color ?? "" }}
          submitLabel={t.formSave}
          onCancel={onCancelEdit}
          onSubmit={onSave}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative flex flex-col gap-3 rounded-2xl border border-grey-line bg-white p-4 shadow-sm transition ${
        isDragging ? "opacity-50" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: tool.color ? `${tool.color}1a` : "#f0f4f8", color: tool.color || "#0052a5" }}
        >
          <ToolIcon icon={tool.icon} className="h-5 w-5" />
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            {...attributes}
            {...listeners}
            title={t.dragTitle}
            className="cursor-grab touch-none rounded-lg p-1.5 text-ink/30 opacity-0 transition group-hover:opacity-100 hover:bg-grey-bg active:cursor-grabbing"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <circle cx="9" cy="6" r="1.4" />
              <circle cx="15" cy="6" r="1.4" />
              <circle cx="9" cy="12" r="1.4" />
              <circle cx="15" cy="12" r="1.4" />
              <circle cx="9" cy="18" r="1.4" />
              <circle cx="15" cy="18" r="1.4" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onStartEdit}
            title={t.gearTitle}
            className="rounded-lg p-1.5 text-ink/30 opacity-0 transition group-hover:opacity-100 hover:bg-grey-bg hover:text-ink"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="flex flex-1 flex-col gap-1">
        <h3 className="font-heading text-sm font-bold text-ink">{tool.title[lang]}</h3>
        <p className="text-xs text-ink/60">{tool.description[lang] || t.noDescription}</p>
      </a>

      <a
        href={tool.url}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start rounded-full px-3 py-1.5 text-xs font-bold transition"
        style={{ background: tool.color ? `${tool.color}1a` : "#e6f7fd", color: tool.color || "#0052a5" }}
      >
        {tool.cta[lang]} ↗
      </a>
    </div>
  );
}
