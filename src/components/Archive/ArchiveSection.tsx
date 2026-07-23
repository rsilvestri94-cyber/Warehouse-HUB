import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";

// ?rm=minimal hides the Google toolbars/menus; &range=A1:E12 opens scrolled
// to that block so columns A–E and the first rows show.
const ARCHIVE_URL =
  "https://docs.google.com/spreadsheets/d/1s5j_tw7aA2uGnZK8MtQfngbsoDNnB4xpG8USOupt4XA/edit?gid=1902603210&rm=minimal&range=A1:E12#gid=1902603210";
const ARCHIVE_TAB_URL =
  "https://docs.google.com/spreadsheets/d/1s5j_tw7aA2uGnZK8MtQfngbsoDNnB4xpG8USOupt4XA/edit?pli=1&gid=1902603210#gid=1902603210";

export function ArchiveSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleOpen = () => {
    setLoaded(true);
    setOpen(true);
  };

  return (
    <section>
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-1">
        <div className="font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">{t.archiveEmbedLabel}</div>
        <span className="text-xs text-ink/50">{t.archiveEmbedHint}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-grey-line bg-white p-4">
        <div>
          <div className="font-heading text-sm font-bold text-ink">{t.archiveLauncherTitle}</div>
          <div className="text-xs text-ink/50">{t.archiveEmbedNote}</div>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          className="flex shrink-0 items-center gap-2 rounded-full bg-blue-dark px-4 py-2 text-sm font-bold text-white hover:bg-blue-mid"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
          {t.archiveOpenBtn}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/60 p-3 sm:p-6" role="dialog" aria-modal="true">
          <div className="absolute inset-0" onClick={() => setOpen(false)} />
          <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-grey-line px-4 py-2.5">
              <span className="font-heading text-sm font-bold text-ink">{t.archiveOverlayTitle}</span>
              <div className="flex items-center gap-3">
                <a href={ARCHIVE_TAB_URL} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-mid hover:underline">
                  {t.archiveOverlayTab}
                </a>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  title={t.archiveCloseTitle}
                  className="rounded-lg p-1 text-ink/50 hover:bg-grey-bg hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            {loaded && <iframe src={ARCHIVE_URL} title="Archivio DN — Tracking" className="flex-1 border-0" />}
          </div>
        </div>
      )}
    </section>
  );
}
