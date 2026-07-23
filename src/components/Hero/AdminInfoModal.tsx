import { useI18n } from "../../i18n/I18nContext";

export function AdminInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useI18n();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between rounded-t-2xl bg-blue-dark px-5 py-3 font-heading font-bold text-white">
          <span>{t.adminInfoHeading}</span>
          <button type="button" onClick={onClose} aria-label="Chiudi" className="text-white/80 hover:text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-5 text-sm text-ink">
          <ol className="list-decimal space-y-3 pl-5">
            <li>
              <strong className="block">{t.adminStep1T}</strong>
              <span className="text-ink/70">{t.adminStep1B}</span>
            </li>
            <li>
              <strong className="block">{t.adminStep2T}</strong>
              <span className="text-ink/70">{t.adminStep2B}</span>
            </li>
            <li>
              <strong className="block">{t.adminStep3T}</strong>
              <span className="text-ink/70">{t.adminStep3B}</span>
            </li>
          </ol>
          <div className="mt-4 rounded-lg border border-accent/30 bg-accent/10 p-3">
            <strong className="block text-blue-dark">{t.adminWarnT}</strong>
            <span className="text-ink/70">{t.adminWarnB}</span>
          </div>
          <ul className="mt-4 space-y-2 border-t border-grey-line pt-4">
            <li>
              <strong>{t.adminNote1T}</strong> <span className="text-ink/70">{t.adminNote1B}</span>
            </li>
            <li>
              <strong>{t.adminNote2T}</strong> <span className="text-ink/70">{t.adminNote2B}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
