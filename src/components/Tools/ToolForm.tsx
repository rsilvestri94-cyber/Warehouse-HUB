import { useRef, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import type { IconKey } from "../../types/tool";
import { ICON_LABELS, TOOL_COLORS } from "../../data/tools";
import { ToolIcon } from "./ToolIcon";

export interface ToolFormValues {
  title: string;
  description: string;
  url: string;
  icon: IconKey;
  color: string;
}

const ICON_OPTIONS: IconKey[] = ["sheet", "check", "folder", "globe"];

export function ToolForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Partial<ToolFormValues>;
  submitLabel: string;
  onSubmit: (values: ToolFormValues) => void;
  onCancel: () => void;
}) {
  const { lang, t } = useI18n();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [url, setUrl] = useState(initial?.url ?? "");
  const [icon, setIcon] = useState<IconKey>(initial?.icon ?? "globe");
  const [color, setColor] = useState(initial?.color ?? "");
  const titleRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }
    if (!url.trim()) {
      urlRef.current?.focus();
      return;
    }
    onSubmit({ title: title.trim(), description: description.trim(), url: url.trim(), icon, color });
  };

  return (
    <div
      className="flex h-full flex-col gap-2.5 rounded-2xl border-2 border-dashed border-accent bg-white p-4"
      style={{ "--tool-color": color || undefined } as React.CSSProperties}
    >
      <label className="text-xs font-semibold text-ink/60">
        {t.formTitleLabel}
        <input
          ref={titleRef}
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
          placeholder={t.formTitlePlaceholder}
          className="mt-1 w-full rounded-lg border border-grey-line px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        />
      </label>
      <label className="text-xs font-semibold text-ink/60">
        {t.formDescLabel}
        <input
          value={description}
          onChange={e => setDescription(e.target.value)}
          maxLength={120}
          placeholder={t.formDescPlaceholder}
          className="mt-1 w-full rounded-lg border border-grey-line px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        />
      </label>
      <label className="text-xs font-semibold text-ink/60">
        {t.formLinkLabel}
        <input
          ref={urlRef}
          type="url"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://…"
          className="mt-1 w-full rounded-lg border border-grey-line px-2.5 py-1.5 text-sm text-ink outline-none focus:border-accent"
        />
      </label>
      <label className="text-xs font-semibold text-ink/60">
        {t.formTypeLabel}
        <div className="mt-1 flex gap-1.5">
          {ICON_OPTIONS.map(opt => (
            <button
              key={opt}
              type="button"
              title={ICON_LABELS[lang][opt]}
              onClick={() => setIcon(opt)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border transition ${
                icon === opt ? "border-accent bg-accent/10 text-accent" : "border-grey-line text-ink/50 hover:bg-grey-bg"
              }`}
            >
              <ToolIcon icon={opt} className="h-4 w-4" />
            </button>
          ))}
        </div>
      </label>
      <div className="text-xs font-semibold text-ink/60">
        {t.formColorLabel}
        <div className="mt-1 flex flex-wrap gap-1.5">
          {TOOL_COLORS.map(c => (
            <button
              key={c.value || "none"}
              type="button"
              title={c.label[lang]}
              onClick={() => setColor(c.value)}
              className={`h-6 w-6 rounded-full border-2 transition ${
                color === c.value ? "border-blue-dark scale-110" : "border-white"
              }`}
              style={{
                background: c.value || "repeating-conic-gradient(#ddd 0% 25%, #fff 0% 50%) 0 / 8px 8px",
                boxShadow: "0 0 0 1px #c8d6e5",
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-1 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink/60 hover:bg-grey-bg">
          {t.formCancel}
        </button>
        <button type="button" onClick={handleSave} className="rounded-full bg-blue-dark px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-mid">
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
