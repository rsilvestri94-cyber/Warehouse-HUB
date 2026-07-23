import { useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { ToolForm, type ToolFormValues } from "./ToolForm";

export function AddTile({ onAdd }: { onAdd: (values: ToolFormValues) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <ToolForm
        submitLabel={t.formAdd}
        onCancel={() => setOpen(false)}
        onSubmit={values => {
          onAdd(values);
          setOpen(false);
        }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex min-h-[168px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-grey-line text-ink/40 transition hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <span className="text-xs font-semibold">{t.addToolTile}</span>
    </button>
  );
}
