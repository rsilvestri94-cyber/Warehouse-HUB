import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { MaterialRow } from "./api";

const BLUE_DARK: [number, number, number] = [0, 32, 91];

const PAGE_W = 297; // A4 landscape
const PAGE_H = 210;
const MARGIN = 12;
const TITLE_H = 16;
const ROWS_PER_PAGE = 6;
const MATERIAL_COL_W = 90; // wide: material code is the big scan-from-afar number
const HEADER_FONT_SIZE = 14; // fixed, independent of the body's computed size
const HEADER_ROW_H = 5 /* cellPadding top+bottom */ + HEADER_FONT_SIZE * 0.3528 * 1.15;

// A shelf label meant to be read from a few meters away: landscape, at most
// 6 rows per sheet, font sized as large as it can be while still letting the
// longest description fit — computed once so every page of the same print
// job stays visually consistent.
function pickFontSize(doc: jsPDF, items: MaterialRow[], descColW: number, rowH: number): number {
  const cellPaddingMm = 5;
  const innerW = descColW - 6;

  for (let fontSize = 40; fontSize >= 10; fontSize--) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    const lineHeightMm = fontSize * 0.3528 * 1.15;
    const maxLines = Math.floor((rowH - cellPaddingMm) / lineHeightMm);
    if (maxLines < 1) continue;
    const fits = items.every(item => doc.splitTextToSize(item.Descrizione, innerW).length <= maxLines);
    if (fits) return fontSize;
  }
  return 10;
}

// Material codes are short and never wrap — size them as big as fits on one
// line within the column width and the row height, so they read from far
// away (that's the number someone scans off the shelf, it must dominate).
function pickMaterialFontSize(doc: jsPDF, items: MaterialRow[], colW: number, rowH: number): number {
  const cellPaddingMm = 5;
  const innerW = colW - 6;
  const maxByHeight = (rowH - cellPaddingMm) / (0.3528 * 1.15);

  for (let fontSize = 60; fontSize >= 10; fontSize--) {
    if (fontSize > maxByHeight) continue;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(fontSize);
    const fits = items.every(item => doc.getTextWidth(String(item.Material)) <= innerW);
    if (fits) return fontSize;
  }
  return 10;
}

export function buildMaterialListPdf(title: string, items: MaterialRow[]): jsPDF {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });

  const tableW = PAGE_W - MARGIN * 2;
  const descColW = tableW - MATERIAL_COL_W;
  const availableTableH = PAGE_H - MARGIN - TITLE_H - MARGIN;
  // A small safety margin absorbs the difference between this estimate and
  // autoTable's own font metrics, so the 6th row never spills onto an extra
  // auto-inserted page.
  const rowH = ((availableTableH - HEADER_ROW_H) / ROWS_PER_PAGE) * 0.95;
  const fontSize = pickFontSize(doc, items, descColW, rowH);
  const materialFontSize = pickMaterialFontSize(doc, items, MATERIAL_COL_W, rowH);

  const pages: MaterialRow[][] = [];
  for (let i = 0; i < items.length; i += ROWS_PER_PAGE) pages.push(items.slice(i, i + ROWS_PER_PAGE));
  if (pages.length === 0) pages.push([]);

  pages.forEach((pageItems, pageIdx) => {
    if (pageIdx > 0) doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.setTextColor(...BLUE_DARK);
    doc.text(title, MARGIN, MARGIN + 6);
    doc.setDrawColor(...BLUE_DARK);
    doc.setLineWidth(0.6);
    doc.line(MARGIN, MARGIN + TITLE_H - 4, PAGE_W - MARGIN, MARGIN + TITLE_H - 4);

    autoTable(doc, {
      startY: MARGIN + TITLE_H,
      head: [["Material", "Descrizione"]],
      body: pageItems.map(item => [String(item.Material), item.Descrizione]),
      margin: { left: MARGIN, right: MARGIN },
      tableWidth: tableW,
      styles: { fontSize, cellPadding: 2.5, valign: "middle", minCellHeight: rowH, font: "helvetica", fontStyle: "bold" },
      headStyles: { fillColor: BLUE_DARK, textColor: 255, fontStyle: "bold", fontSize: HEADER_FONT_SIZE, minCellHeight: HEADER_ROW_H },
      columnStyles: {
        0: { cellWidth: MATERIAL_COL_W, fontSize: materialFontSize },
        1: { cellWidth: descColW },
      },
      alternateRowStyles: { fillColor: [240, 244, 248] },
      didDrawCell: data => {
        // Vertical divider between Material and Descrizione.
        if (data.column.index === 0) {
          doc.setDrawColor(...BLUE_DARK);
          doc.setLineWidth(0.5);
          const x = data.cell.x + data.cell.width;
          doc.line(x, data.cell.y, x, data.cell.y + data.cell.height);
        }
      },
    });
  });

  return doc;
}
