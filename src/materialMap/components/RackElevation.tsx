import type { Level } from "../parseLocation";
import type { RackModel, Slot } from "../buildWarehouse";
import { BLUEBOX_COLUMNS } from "../buildWarehouse";

const LEVELS_TOP_TO_BOTTOM: Level[] = ["D", "C", "B", "A"];

function SlotButton({ slot, selected, onClick }: { slot: Slot; selected: boolean; onClick: () => void }) {
  const hasItems = slot.items.length > 0;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-md border-2 p-1.5 transition ${
        selected
          ? "border-accent bg-accent/10"
          : hasItems
            ? "border-blue-mid/60 bg-orange-50 hover:border-accent"
            : "border-dashed border-grey-line bg-grey-bg/60 text-ink/30"
      }`}
    >
      {slot.label && <span className="font-heading text-[0.6rem] font-bold text-ink/50">{slot.label}</span>}
      {hasItems ? (
        <span className="rounded-full bg-blue-dark px-1.5 py-px text-[0.6rem] font-bold text-white">{slot.items.length}</span>
      ) : (
        <span className="text-[0.6rem]">vuoto</span>
      )}
    </button>
  );
}

// Bluebox levels are always 24 boxes arranged as a 3×8 grid, numbered
// bottom-to-top: row 1-8 at the bottom, 9-16 in the middle, 17-24 on top.
function BlueboxGrid({
  slots,
  level,
  selectedSlotKey,
  onSelectSlot,
}: {
  slots: Slot[];
  level: Level;
  selectedSlotKey: string | null;
  onSelectSlot: (level: Level, slot: Slot) => void;
}) {
  const rows = [slots.slice(16, 24), slots.slice(8, 16), slots.slice(0, 8)]; // top → bottom
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      {rows.map((row, i) => (
        <div key={i} className="flex min-w-0 flex-1 gap-1">
          {row.map(slot => (
            <SlotButton
              key={slot.key}
              slot={slot}
              selected={selectedSlotKey === `${level}-${slot.key}`}
              onClick={() => onSelectSlot(level, slot)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function RackElevation({
  rack,
  selectedSlotKey,
  onSelectSlot,
}: {
  rack: RackModel;
  selectedSlotKey: string | null;
  onSelectSlot: (level: Level, slot: Slot) => void;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border-4 border-ink/70 bg-white p-3">
      {LEVELS_TOP_TO_BOTTOM.map(level => {
        const model = rack.levels[level];
        const slots: Slot[] = model?.slots ?? [{ key: "single", label: "", items: [] }];
        const isBluebox = model?.kind === "bluebox" && slots.length === BLUEBOX_COLUMNS * 3;
        return (
          <div key={level} className="flex min-w-0 items-stretch gap-2">
            <div className="flex w-6 shrink-0 items-center justify-center rounded bg-ink/10 font-heading text-xs font-bold text-ink/60">
              {level}
            </div>
            {isBluebox ? (
              <BlueboxGrid slots={slots} level={level} selectedSlotKey={selectedSlotKey} onSelectSlot={onSelectSlot} />
            ) : (
              <div className="flex min-w-0 flex-1 gap-1.5">
                {slots.map(slot => (
                  <SlotButton
                    key={slot.key}
                    slot={slot}
                    selected={selectedSlotKey === `${level}-${slot.key}`}
                    onClick={() => onSelectSlot(level, slot)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
