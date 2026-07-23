import type { Lang } from "../types/lang";

export interface PrintStrings {
    step1: string;
    pastePlaceholder: string;
    hintPrefix: string;
    hintColumns: string;
    hintSuffix: string;
    hintMoreRows: string;
    hintTwoPerSheet: string;
    step2: string;
    emptyState: string;
    invalidRows: string;
    step3: string;
    btnPrint: string;
    btnClear: string;
    previewTitle: string;
    rowsWord: (n: number) => string;
    warnPasteFirst: string;
    toolsLabel: string;
    noToolsLabel: string;
}

export const I18N_PRINT: Record<Lang, PrintStrings> = {
    it: {
        step1: "1 — Incolla le righe dal database",
        pastePlaceholder:
            "Incolla qui una o più righe copiate dall'Excel...\n\nEsempio:\n24/06/2026\t805884638\t6211\tLampino 10\tReplace yaw gear & yaw motor\tAccettato\t1\t24/06/2026\t24/06/2026\tx\n\nVengono usati solo: Data, VAN, Turbine, Activity. Il resto è ignorato.",
        hintPrefix: "📋 Colonne usate:",
        hintColumns: "Data · VAN · Turbine · Activity",
        hintSuffix: "— tutto il resto viene ignorato automaticamente.",
        hintMoreRows: "Più righe incollate = più schede.",
        hintTwoPerSheet: "2 schede per foglio A4",
        step2: "2 — Anteprima dati estratti",
        emptyState: "Nessun dato — incolla delle righe sopra.",
        invalidRows: "Nessuna riga valida riconosciuta.",
        step3: "3 — Stampa",
        btnPrint: "🖨 Stampa / Salva PDF",
        btnClear: "✕ Cancella",
        previewTitle: "Anteprima fogli A4",
        rowsWord: n => (n === 1 ? "riga" : "righe"),
        warnPasteFirst: "⚠️  Incolla prima i dati.",
        toolsLabel: "TOOLS",
        noToolsLabel: "No tools",
    },
    en: {
        step1: "1 — Paste the rows from the database",
        pastePlaceholder:
            "Paste one or more rows copied from Excel here...\n\nExample:\n24/06/2026\t805884638\t6211\tLampino 10\tReplace yaw gear & yaw motor\tAccettato\t1\t24/06/2026\t24/06/2026\tx\n\nOnly used: Date, VAN, Turbine, Activity. Everything else is ignored.",
        hintPrefix: "📋 Columns used:",
        hintColumns: "Date · VAN · Turbine · Activity",
        hintSuffix: "— everything else is ignored automatically.",
        hintMoreRows: "More pasted rows = more cards.",
        hintTwoPerSheet: "2 cards per A4 sheet",
        step2: "2 — Preview extracted data",
        emptyState: "No data — paste rows above.",
        invalidRows: "No valid rows recognized.",
        step3: "3 — Print",
        btnPrint: "🖨 Print / Save PDF",
        btnClear: "✕ Clear",
        previewTitle: "A4 Sheets Preview",
        rowsWord: n => (n === 1 ? "row" : "rows"),
        warnPasteFirst: "⚠️  Paste the data first.",
        toolsLabel: "TOOLS",
        noToolsLabel: "No tools",
    },
};
