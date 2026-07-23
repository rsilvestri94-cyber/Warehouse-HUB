import { useEffect, useMemo, useState } from "react";
import { useI18n } from "../../i18n/I18nContext";
import { I18N_PRINT } from "../../i18n/printStrings";
import { type ColumnMap, parseAll } from "../../lib/workOrders";
import { buildWorkOrderPdf, loadLogoAsPng, vestasLogoUrl, type LoadedLogo } from "../../lib/workOrderPdf";
import { markAsPrinted } from "../../lib/workOrderArchive";
import { ArchiveQuickAdd } from "./ArchiveQuickAdd";

export function PrintToolPanel({
    columns,
    showArchiveQuickAdd,
}: {
    columns: ColumnMap;
    showArchiveQuickAdd?: boolean;
}) {
    const { lang } = useI18n();
    const t = I18N_PRINT[lang];

    const [raw, setRaw] = useState("");
    const [toolsFlags, setToolsFlags] = useState<Record<number, boolean>>({});
    const [logo, setLogo] = useState<LoadedLogo | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const rows = useMemo(() => parseAll(raw, columns), [raw, columns]);

    useEffect(() => {
        loadLogoAsPng(vestasLogoUrl).then(setLogo);
    }, []);

    // Regenerate the actual PDF whenever the data changes, so the preview
    // below is always the real file that "Stampa / Salva PDF" opens — not an
    // HTML approximation of it.
    useEffect(() => {
        if (!logo || rows.length === 0) {
            setPdfUrl(null);
            return;
        }
        const doc = buildWorkOrderPdf(rows, toolsFlags, logo);
        const url = doc.output("bloburl").toString();
        setPdfUrl(url);
        return () => URL.revokeObjectURL(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, toolsFlags, logo]);

    const handlePrint = () => {
        if (!pdfUrl) return;
        window.open(pdfUrl, "_blank");

        // Mark every printed row that came from the DN archive as "Stampato"
        // on the sheet, so it stops showing up as pending next time.
        const dns = [...new Set(rows.map(r => r.dn).filter((dn): dn is string => !!dn))];
        for (const dn of dns) {
            markAsPrinted(dn).catch(err => console.error("[print] markAsPrinted failed for", dn, err));
        }
    };

    const handleClear = () => {
        setRaw("");
        setToolsFlags({});
    };

    const toggleTools = (i: number) =>
        setToolsFlags(f => ({ ...f, [i]: !f[i] }));

    return (
        <div className="rounded-2xl border border-grey-line bg-white p-5">
            <div className="mb-1 font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
                {t.step1}
            </div>
            {showArchiveQuickAdd && (
                <ArchiveQuickAdd
                    onAddLine={line =>
                        setRaw(prev =>
                            prev.trim() ? prev + "\n" + line : line,
                        )
                    }
                />
            )}
            <textarea
                value={raw}
                onChange={e => setRaw(e.target.value)}
                placeholder={t.pastePlaceholder}
                rows={7}
                className="w-full rounded-xl border-2 border-grey-line bg-white p-4 font-mono text-sm text-ink outline-none focus:border-accent"
            />
            <p className="mb-6 mt-2 text-xs leading-relaxed text-ink/50">
                {t.hintPrefix}{" "}
                <strong className="text-blue-mid">{t.hintColumns}</strong>{" "}
                {t.hintSuffix}
                <br />
                {t.hintMoreRows}{" "}
                <strong className="text-blue-mid">{t.hintTwoPerSheet}</strong>.
            </p>

            <div className="mb-2 flex items-baseline gap-2 font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
                <span>{t.step2}</span>
                {rows.length > 0 && (
                    <span className="rounded-full bg-blue-dark px-2.5 py-0.5 text-[0.65rem] text-white">
                        {rows.length} {t.rowsWord(rows.length)}
                    </span>
                )}
            </div>

            <div className="mb-8 flex max-h-96 flex-col gap-2.5 overflow-y-auto pr-0.5">
                {rows.length === 0 && (
                    <div className="py-2 text-sm text-ink/40">
                        {raw.trim() ? t.invalidRows : t.emptyState}
                    </div>
                )}
                {rows.map((r, i) => {
                    const active = !!toolsFlags[i];
                    return (
                        <div
                            key={i}
                            className="flex items-center gap-3 rounded-lg border-l-4 border-blue-mid bg-white p-3 shadow-sm"
                        >
                            <span className="shrink-0 font-heading text-xs font-bold text-ink/30">
                                #{i + 1}
                            </span>
                            <div className="grid flex-1 grid-cols-[1fr_70px_1.6fr_90px] items-center gap-2.5">
                                <div>
                                    <div className="font-heading text-[0.6rem] font-bold uppercase tracking-wide text-accent">
                                        Turbine
                                    </div>
                                    <div className="font-heading text-sm font-semibold text-blue-dark">
                                        {r.turbine}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-heading text-[0.6rem] font-bold uppercase tracking-wide text-accent">
                                        VAN
                                    </div>
                                    <div className="font-heading text-sm font-semibold text-blue-dark">
                                        {r.van}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-heading text-[0.6rem] font-bold uppercase tracking-wide text-accent">
                                        Activity
                                    </div>
                                    <div className="font-heading text-sm font-semibold text-blue-dark">
                                        {r.activity}
                                    </div>
                                </div>
                                <div>
                                    <div className="font-heading text-[0.6rem] font-bold uppercase tracking-wide text-accent">
                                        Date
                                    </div>
                                    <div className="font-heading text-sm font-semibold text-[#5a7090]">
                                        {r.date}
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => toggleTools(i)}
                                className={`flex w-35 shrink-0 items-center justify-center gap-2 rounded-lg border-2 p-2 transition ${
                                    active
                                        ? "border-brand-red bg-[#fff5f5]"
                                        : "border-transparent bg-grey-bg"
                                }`}
                            >
                                <span
                                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${active ? "bg-brand-red" : "bg-[#d0d8e4]"}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${
                                            active ? "translate-x-5" : "translate-x-0"
                                        }`}
                                    />
                                </span>
                                <span
                                    className={`font-heading text-[0.65rem] font-bold uppercase tracking-wide ${active ? "text-brand-red" : "text-ink/30"}`}
                                >
                                    {active ? t.toolsLabel : t.noToolsLabel}
                                </span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mb-1 font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
                {t.step3}
            </div>
            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handlePrint}
                    disabled={!pdfUrl}
                    className="rounded-lg bg-blue-dark px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-blue-dark/20 hover:bg-blue-mid disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                >
                    {t.btnPrint}
                </button>
                <button
                    type="button"
                    onClick={handleClear}
                    className="rounded-lg border-2 border-grey-line bg-transparent px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-blue-mid hover:border-blue-mid"
                >
                    {t.btnClear}
                </button>
            </div>

            <div className="mt-11 overflow-hidden rounded-2xl bg-[#b8c8d8] p-6">
                <h2 className="mb-4 font-heading text-xs font-bold uppercase tracking-wide text-blue-dark opacity-65">
                    {t.previewTitle}
                </h2>
                {pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        title={t.previewTitle}
                        className="aspect-210/297 mx-auto w-full rounded-lg border border-grey-line bg-white shadow-lg"
                    />
                ) : (
                    <div className="flex aspect-210/297 mx-auto w-full items-center justify-center rounded-lg border border-dashed border-grey-line bg-white/60 text-sm text-ink/40">
                        {t.emptyState}
                    </div>
                )}
            </div>
        </div>
    );
}
