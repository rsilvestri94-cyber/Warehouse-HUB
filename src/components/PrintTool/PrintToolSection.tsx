import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { NEWS_COLUMNS, OLD_COLUMNS } from "../../lib/workOrders";
import { PrintToolPanel } from "./PrintToolPanel";

function Accordion({ label, sub, children }: { label: string; sub: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-grey-line bg-white">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="flex w-full items-center gap-3 p-4 text-left">
        <div className="flex-1">
          <div className="font-heading text-sm font-bold text-ink">{label}</div>
          <div className="text-xs text-ink/50">{sub}</div>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`h-5 w-5 shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && <div className="border-t border-grey-line bg-grey-bg p-4">{children}</div>}
    </div>
  );
}

export function PrintToolSection() {
  const { t } = useI18n();
  return (
    <section className="flex flex-col gap-4">
      <Accordion label={t.printOldLabel} sub={t.printOldSub}>
        <PrintToolPanel columns={OLD_COLUMNS} />
      </Accordion>
      <Accordion label={t.printNewsLabel} sub={t.printNewsSub}>
        <PrintToolPanel columns={NEWS_COLUMNS} showArchiveQuickAdd />
      </Accordion>
    </section>
  );
}
