import { useCallback, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import type { Comment } from "../../types/comment";
import type { SyncStatusKey } from "../../firebase/useHubData";
import { useDwellSeen } from "../../hooks/useDwellSeen";
import { CommentRow } from "./CommentRow";

export function CommentsPanel({
  comments,
  unseenIds,
  syncStatus,
  onAdd,
  onEditText,
  onDelete,
  onSeen,
}: {
  comments: Comment[];
  unseenIds: Set<string>;
  syncStatus: SyncStatusKey;
  onAdd: (text: string) => void;
  onEditText: (item: Comment, text: string) => void;
  onDelete: (item: Comment) => void;
  onSeen: () => void;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleSeen = useCallback(() => onSeen(), [onSeen]);
  const dwellRef = useDwellSeen<HTMLDivElement>(handleSeen);

  const handleAdd = () => {
    if (!text.trim()) return;
    onAdd(text);
    setText("");
  };

  return (
    <div ref={dwellRef} className="rounded-2xl border border-grey-line bg-white p-4">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="flex w-full items-center gap-2">
        <h3 className="font-heading text-sm font-bold text-ink">{t.commentsTitle}</h3>
        <span className="text-[0.7rem] text-ink/40">{comments.length > 0 ? comments.length : ""}</span>
        {unseenIds.size > 0 && (
          <span className="rounded-full bg-brand-red px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
            {unseenIds.size > 9 ? "9+" : unseenIds.size}
          </span>
        )}
        {syncStatus === "syncError" && <span className="ml-auto text-[0.65rem] text-brand-red">{t.syncError}</span>}
        {syncStatus === "syncSynced" && open && <span className="ml-auto text-[0.65rem] text-ink/30">{t.syncSynced}</span>}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`ml-auto h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""} ${syncStatus !== "" && !open ? "!ml-1" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="mt-3">
          <div className="flex flex-col gap-1.5">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={500}
              placeholder={t.commentPlaceholder}
              className="min-h-[60px] rounded-lg border border-grey-line p-2 text-sm outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="self-end rounded-full bg-blue-dark px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-mid"
            >
              {t.commentAddBtn}
            </button>
          </div>

          <ul className="mt-3 flex flex-col gap-1.5">
            {comments.length === 0 && <p className="py-4 text-center text-xs text-ink/40">{t.emptyComments}</p>}
            {comments.map(item => (
              <CommentRow
                key={item.id}
                item={item}
                isNew={unseenIds.has(item.id)}
                onEditText={text2 => onEditText(item, text2)}
                onDelete={() => onDelete(item)}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
