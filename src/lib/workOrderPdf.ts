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
      resolve({ dataUrl: canvas.toDataURL("image/png"), width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error("logo failed to load"));
    img.src = url;
  });
}

function drawCard(doc: jsPDF, originY: number, row: WorkOrderRow | undefined, hasTools: boolean, logo: LoadedLogo) {
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

  let cursorY = headerY + 20;
  const rowGap = 9;

  const field = (label: string, lines: string[], fontSize: number, color: [number, number, number], lineHeight: number) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...BLUE_MID);
    doc.text(label, contentX, cursorY);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    doc.setTextColor(...color);
    let ly = cursorY + lineHeight * 0.75;
    for (const line of lines) {
      doc.text(line, contentX, ly);
      ly += lineHeight;
    }
    const contentBottom = ly - lineHeight + lineHeight * 0.35;

    doc.setDrawColor(...GREY_LINE);
    doc.setLineWidth(0.3);
    doc.line(contentX, contentBottom + rowGap * 0.4, contentX + contentW, contentBottom + rowGap * 0.4);

    cursorY = contentBottom + rowGap;
  };

  const turbineLines = hyphenateTurbine(row.turbine).split("\n");
  field("TURBINE", turbineLines, 26, BLACK, 11);
  field("VAN", [row.van], 18, BLACK, 8);
  field("ACTIVITY", [row.activity], 16, BLACK, 7.5);
  field("DATE", [row.date], 11, BLACK, 6);

  // Accent bar, bottom-right of the card
  doc.setFillColor(...ACCENT);
  doc.rect(contentX + contentW - 30, originY + HALF_H - 12, 30, 1.2, "F");
}

export function buildWorkOrderPdf(rows: WorkOrderRow[], toolsFlags: Record<number, boolean>, logo: LoadedLogo): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  const pageCount = Math.max(1, Math.ceil(rows.length / 2));
  for (let pageIdx = 0; pageIdx < pageCount; pageIdx++) {
    if (pageIdx > 0) doc.addPage();
    const i = pageIdx * 2;
    drawCard(doc, 0, rows[i], !!toolsFlags[i], logo);
    if (rows[i + 1]) drawCard(doc, HALF_H, rows[i + 1], !!toolsFlags[i + 1], logo);

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
