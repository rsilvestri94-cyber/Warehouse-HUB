import type { MaterialRow } from "./api";
import { parseLocation, type Level, type SlotKind } from "./parseLocation";

export interface Slot {
  key: string; // e.g. "P1", "P2", "P3", "BOX07", or "single"
  label: string; // short label shown inside the slot
  items: MaterialRow[];
}

export interface LevelModel {
  kind: SlotKind;
  slots: Slot[];
}

export interface RackModel {
  rack: string;
  levels: Partial<Record<Level, LevelModel>>;
  itemCount: number;
}

const LEVELS: Level[] = ["A", "B", "C", "D"];

// Bluebox racks always carry exactly 24 boxes on level B, laid out as a 3×8
// grid (rows, bottom to top: 1-8, 9-16, 17-24).
export const BLUEBOX_COUNT = 24;
export const BLUEBOX_COLUMNS = 8;

function slotKeyFor(kind: SlotKind, position?: 1 | 2 | 3, boxNumber?: number): { key: string; label: string } {
  if (kind === "triple") return { key: `P${position}`, label: `P${position}` };
  if (kind === "bluebox") {
    const n = String(boxNumber).padStart(2, "0");
    return { key: `BOX${n}`, label: n };
  }
  return { key: "single", label: "" };
}

export function buildWarehouse(rows: MaterialRow[]): Map<string, RackModel> {
  const racks = new Map<string, RackModel>();

  for (const row of rows) {
    if (!row.LOCAZIONE) continue;
    const parsed = parseLocation(row.LOCAZIONE);
    if (!parsed) continue;

    let rack = racks.get(parsed.rack);
    if (!rack) {
      rack = { rack: parsed.rack, levels: {}, itemCount: 0 };
      racks.set(parsed.rack, rack);
    }
    rack.itemCount++;

    let level = rack.levels[parsed.level];
    if (!level) {
      level = { kind: parsed.kind, slots: [] };
      rack.levels[parsed.level] = level;
    }

    const { key, label } = slotKeyFor(parsed.kind, parsed.position, parsed.boxNumber);
    let slot = level.slots.find(s => s.key === key);
    if (!slot) {
      slot = { key, label, items: [] };
      level.slots.push(slot);
    }
    slot.items.push(row);
  }

  // Keep triple levels showing all 3 positions even if some are empty, and
  // sort bluebox/triple slots into a stable, human-readable order.
  for (const rack of racks.values()) {
    for (const level of LEVELS) {
      const model = rack.levels[level];
      if (!model) continue;
      if (model.kind === "triple") {
        for (const p of [1, 2, 3] as const) {
          if (!model.slots.some(s => s.key === `P${p}`)) {
            model.slots.push({ key: `P${p}`, label: `P${p}`, items: [] });
          }
        }
      }
      if (model.kind === "bluebox") {
        for (let n = 1; n <= BLUEBOX_COUNT; n++) {
          const key = `BOX${String(n).padStart(2, "0")}`;
          if (!model.slots.some(s => s.key === key)) {
            model.slots.push({ key, label: String(n).padStart(2, "0"), items: [] });
          }
        }
      }
      model.slots.sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }));
    }
  }

  return racks;
}
