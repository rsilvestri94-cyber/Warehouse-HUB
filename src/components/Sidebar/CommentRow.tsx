import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import type { Comment } from "../../types/comment";

export function CommentRow({
  item,
  isNew,
  onEditText,
  onDelete,
}: {
  item: Comment;
  isNew: boolean;
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
    <li className={`rounded-lg p-2.5 transition ${isNew ? "bg-accent/10 ring-1 ring-accent/40" : "hover:bg-grey-bg"}`}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-blue-mid">{item.author}</span>
        <div className="flex items-center gap-2">
          <span className="text-[0.65rem] text-ink/40">
            {new Date(item.date).toLocaleString(lang === "it" ? "it-IT" : "en-GB", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <button type="button" onClick={onDelete} title={t.deleteCommentTitle} className="rounded p-0.5 text-ink/25 hover:bg-brand-red/10 hover:text-brand-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
      {editing ? (
        <textarea
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              commit();
            }
          }}
          className="w-full rounded border border-accent p-1.5 text-sm outline-none"
        />
      ) : (
        <p onClick={() => setEditing(true)} className="cursor-text whitespace-pre-wrap text-sm text-ink">
          {item.text}
        </p>
      )}
    </li>
  );
}
