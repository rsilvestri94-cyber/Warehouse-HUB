import { jsPDF } from "jspdf";
import type { WorkOrderRow } from "./workOrders";
import { hyphenateTurbine } from "./workOrders";

const PAGE_W = 210;
const PAGE_H = 297;
const HALF_H = PAGE_H / 2;
const PAD_TOP = 7;
const PAD_SIDE = 10;

const BLUE_MID: [number, number, number] = [0, 82, 165];
const RED: [number, number, number] = [204, 0, 0];
const GREY_LINE: [number, number, number] = [200, 214, 229];
const ACCENT: [number, number, number] = [0, 174, 239];
const BLACK: [number, number, number] = [0, 0, 0];
const SCISSORS: [number, number, number] = [112, 128, 144];

export interface LoadedLogo {
    dataUrl: string;
    width: number;
    height: number;
}

// jsPDF can't embed a WEBP directly, so the logo is decoded via an offscreen
// canvas once and reused as a PNG data URL for every card drawn.
export function loadLogoAsPng(url: string): Promise<LoadedLogo> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) return reject(new Error("canvas context unavailable"));
            ctx.drawImage(img, 0, 0);
            resolve({
                dataUrl: canvas.toDataURL("image/png"),
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.onerror = () => reject(new Error("logo failed to load"));
        img.src = url;
    });
}

function drawCard(
    doc: jsPDF,
    originY: number,
    row: WorkOrderRow | undefined,
    hasTools: boolean,
    logo: LoadedLogo,
) {
    const contentX = PAD_SIDE;
    const contentW = PAGE_W - PAD_SIDE * 2;
    const headerY = originY + PAD_TOP;

    if (!row) return;

    // Logo
    const logoH = 10;
    const logoW = logoH * (logo.width / logo.height);
    doc.addImage(logo.dataUrl, "PNG", contentX, headerY, logoW, logoH);

    // TOOLS badge, top-right
    if (hasTools) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(...RED);
        const label = "TOOLS";
        const w = doc.getTextWidth(label);
        const boxX = contentX + contentW - w - 8;
        const boxY = headerY - 0.5;
        doc.setDrawColor(...RED);
        doc.setLineWidth(0.8);
        doc.roundedRect(boxX, boxY, w + 8, 11, 1, 1);
        doc.text(label, boxX + 4, boxY + 8);
    }

    const startY = headerY + 20;
    const endY = originY + HALF_H - 18; // leave room for the accent bar below
    const baseRowGap = 9;

    const turbineLines = hyphenateTurbine(row.turbine).split("\n");
    // Base sizes (fontSize pt, lineHeight mm) tuned at "1×" — scaled up below
    // so the four rows always fill the whole card instead of leaving the
    // bottom half blank.
    const rowSpecs = [
        {
            label: "TURBINE",
            lines: turbineLines,
            baseFontSize: 32,
            baseLineHeight: 12,
        },
        { label: "VAN", lines: [row.van], baseFontSize: 18, baseLineHeight: 8 },
        {
            label: "ACTIVITY",
            lines: [row.activity],
            baseFontSize: 16,
            baseLineHeight: 7.5,
        },
        {
            label: "DATE",
            lines: [row.date],
            baseFontSize: 11,
            baseLineHeight: 6,
        },
    ];

    const baseTotal = rowSpecs.reduce(
        (sum, s) =>
            sum + s.baseLineHeight * (s.lines.length + 0.1) + baseRowGap,
        0,
    );
    const scale = (endY - startY) / baseTotal;
    const rowGap = baseRowGap * scale;

    let cursorY = startY;
    const field = (
        label: string,
        lines: string[],
        fontSize: number,
        color: [number, number, number],
        lineHeight: number,
    ) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...BLUE_MID);
        doc.text(label, contentX, cursorY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(fontSize);
        doc.setTextColor(...color);
        // Ascent/descent (space above the first baseline, and below the
        // last one before the divider) are derived from the actual font
        // size in mm, not from lineHeight — lineHeight only spaces wrapped
        // lines apart. This keeps the text sitting on its divider line no
        // matter how big a field's font is scaled relative to the others.
        const dividerGap = 2;
        const fontSizeMm = fontSize * 0.3528;
        // Label-to-text gap: a generous fixed minimum (12mm) so small-font
        // fields like DATE don't end up cramped against their label, plus
        // extra room for fields whose font is big enough to need more.
        const labelGap = Math.max(12, fontSizeMm * 0.9);
        let ly = cursorY + labelGap;
        for (const line of lines) {
            doc.text(line, contentX, ly);
            ly += lineHeight;
        }
        const contentBottom = ly - lineHeight + fontSizeMm * 0.28;

        // The divider hugs the text with a small fixed gap — it must NOT be
        // a fraction of rowGap, or it drifts away from the text as rowGap
        // grows to fill the card (the empty space then belongs *after* the
        // divider, before the next field's label, which is where it reads
        // naturally).
        const dividerY = contentBottom + dividerGap;
        doc.setDrawColor(...GREY_LINE);
        doc.setLineWidth(0.3);
        doc.line(contentX, dividerY, contentX + contentW, dividerY);

        cursorY = contentBottom + rowGap;
    };

    for (const spec of rowSpecs) {
        field(
            spec.label,
            spec.lines,
            spec.baseFontSize * scale,
            BLACK,
            spec.baseLineHeight * scale,
        );
    }

    // Accent bar, bottom-right of the card
    doc.setFillColor(...ACCENT);
    doc.rect(contentX + contentW - 30, originY + HALF_H - 12, 30, 1.2, "F");
}

export function buildWorkOrderPdf(
    rows: WorkOrderRow[],
    toolsFlags: Record<number, boolean>,
    logo: LoadedLogo,
): jsPDF {
    const doc = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
    });

    const pageCount = Math.max(1, Math.ceil(rows.length / 2));
    for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
        if (pageIdx > 0) doc.addPage();
        const i = pageIdx * 2;
        drawCard(doc, 0, rows[i], !!toolsFlags[i], logo);
        if (rows[i + 1])
            drawCard(doc, HALF_H, rows[i + 1], !!toolsFlags[i + 1], logo);

        // Cut line between the two half-cards, with a small gap in the middle
        // for the scissors mark (standard PDF fonts have no ✂ glyph, so it's
        // drawn as a simple vector icon instead of text).
        const midX = PAGE_W / 2;
        const gap = 8;
        doc.setDrawColor(160, 176, 192);
        doc.setLineDashPattern([1.5, 1.5], 0);
        doc.setLineWidth(0.3);
        doc.line(0, HALF_H, midX - gap, HALF_H);
        doc.line(midX + gap, HALF_H, PAGE_W, HALF_H);
        doc.setLineDashPattern([], 0);

        doc.setDrawColor(...SCISSORS);
        doc.setFillColor(255, 255, 255);
        doc.setLineWidth(0.5);
        doc.line(midX - 3.2, HALF_H - 2.6, midX + 3.2, HALF_H + 2.6);
        doc.line(midX - 3.2, HALF_H + 2.6, midX + 3.2, HALF_H - 2.6);
        doc.circle(midX - 3.2, HALF_H - 2.6, 1, "FD");
        doc.circle(midX - 3.2, HALF_H + 2.6, 1, "FD");
    }

    return doc;
}

// Blue Vestas brand mark for the logo import path (kept here so callers don't
// need to know the asset location).
export { default as vestasLogoUrl } from "../assets/vestas-logo.webp";
