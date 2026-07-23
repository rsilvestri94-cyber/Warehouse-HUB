export type Level = "A" | "B" | "C" | "D";
export type SlotKind = "single" | "triple" | "bluebox";

export interface ParsedLocation {
  rack: string; // e.g. "01", "02" — matches the number drawn on the floor plan
  level: Level;
  kind: SlotKind;
  position?: 1 | 2 | 3; // only for kind "triple"
  boxNumber?: number; // only for kind "bluebox"
}

// LOCAZIONE format (rules given by the warehouse owner):
//   SP-C{rack}-R{A-D}-P{1-3}   → "triple": that shelf level holds 3 side-by-side pallets
//   SP-C{rack}-R{A-D}          → "single": that shelf level holds one full-width pallet
//   SP-C{rack}-BB{nn}          → "bluebox": always on level B, subdivided into as many small
//                                 boxes as actually appear in the data for that rack
// "SP-" is just a material-category tag (not this map's concern) — anything not matching
// this shape is treated as unrecognized rather than crashing the page.
const LOCATION_RE = /^SP-C(\d{2})-(?:R([ABCD])(?:-P([123]))?|BB(\d+))$/;

export function parseLocation(loc: string): ParsedLocation | null {
  const m = LOCATION_RE.exec(loc.trim());
  if (!m) return null;
  const [, rack, level, position, boxNumber] = m;

  if (boxNumber !== undefined) {
    return { rack, level: "B", kind: "bluebox", boxNumber: parseInt(boxNumber, 10) };
  }
  if (position !== undefined) {
    return { rack, level: level as Level, kind: "triple", position: Number(position) as 1 | 2 | 3 };
  }
  return { rack, level: level as Level, kind: "single" };
}
