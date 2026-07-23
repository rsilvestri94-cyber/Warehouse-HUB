export type FloorCell =
  | { type: "rack"; id: string }
  | { type: "zone"; label: string; color?: "orange" | "blue" | "red" };

export type FloorRow = FloorCell[];

function rack(n: number): FloorCell {
  return { type: "rack", id: String(n).padStart(2, "0") };
}
function zone(label: string, color?: "orange" | "blue" | "red"): FloorCell {
  return { type: "zone", label, color };
}

// Schematic reproduction of the warehouse floor sketch — three columns, top
// to bottom. Not to scale; captures adjacency/orientation only. Only "rack"
// cells (1-30) correspond to LOCAZIONE codes and are clickable.
export const LEFT_COLUMN: FloorRow[] = Array.from({ length: 19 }, (_, i) => [rack(19 - i)]);

export const MIDDLE_COLUMN: FloorRow[] = [
  [rack(20), rack(21)],
  [zone("ACTIVITY AREA")],
  [zone("TOOLS AREA")],
  [zone("ACCETTAZIONE"), zone("SPEDIZIONI")],
  [zone("ACCETTAZIONE")],
  [zone("PARKING AREA")],
];

export const RIGHT_COLUMN: FloorRow[] = [
  [zone("STOCK AREA", "orange")],
  [rack(22)],
  [rack(23)],
  [rack(24)],
  [rack(25)],
  [zone("CH 1", "blue")],
  [zone("CH 2", "blue")],
  [zone("CH 3", "blue")],
  [zone("CH 4", "blue")],
  [zone("CH 5", "blue")],
  [zone("CH 6", "blue")],
  [zone("DEF", "red")],
  [rack(26)],
  [rack(27)],
  [rack(28)],
  [rack(29)],
  [rack(30)],
];
