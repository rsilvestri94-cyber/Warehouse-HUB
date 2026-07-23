import type { RackModel } from "../buildWarehouse";
import { LEFT_COLUMN, MIDDLE_COLUMN, RIGHT_COLUMN, type FloorCell, type FloorRow } from "../floorPlanConfig";

const ZONE_COLOR: Record<string, string> = {
  orange: "bg-orange-100 border-orange-300 text-orange-900",
  blue: "bg-sky-100 border-sky-300 text-sky-900",
  red: "bg-red-100 border-red-400 text-red-900",
};

function Cell({
  cell,
  racks,
  selectedRack,
  onSelect,
}: {
  cell: FloorCell;
  racks: Map<string, RackModel>;
  selectedRack: string | null;
  onSelect: (rack: string) => void;
}) {
  if (cell.type === "zone") {
    return (
      <div
        className={`flex min-h-12 flex-1 items-center justify-center rounded-md border p-2 text-center font-heading text-[0.65rem] font-bold uppercase tracking-wide ${
          cell.color ? ZONE_COLOR[cell.color] : "border-grey-line bg-white/60 text-ink/40"
        }`}
      >
        {cell.label}
      </div>
    );
  }

  const model = racks.get(cell.id);
  const count = model?.itemCount ?? 0;
  const selected = selectedRack === cell.id;

  return (
    <button
      type="button"
      onClick={() => onSelect(cell.id)}
      className={`relative flex min-h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-md border-2 p-2 font-heading transition ${
        selected
          ? "border-accent bg-accent/10"
          : count > 0
            ? "border-blue-mid bg-white hover:border-accent"
            : "border-grey-line bg-grey-bg text-ink/35 hover:border-blue-mid/50"
      }`}
    >
      <span className={`text-sm font-bold ${count > 0 ? "text-blue-dark" : ""}`}>{Number(cell.id)}</span>
      {count > 0 && (
        <span className="rounded-full bg-blue-dark px-1.5 py-px text-[0.55rem] font-bold text-white">{count}</span>
      )}
    </button>
  );
}

function Column({
  rows,
  racks,
  selectedRack,
  onSelect,
}: {
  rows: FloorRow[];
  racks: Map<string, RackModel>;
  selectedRack: string | null;
  onSelect: (rack: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-1.5">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-1 gap-1.5">
          {row.map((cell, j) => (
            <Cell key={j} cell={cell} racks={racks} selectedRack={selectedRack} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FloorPlan({
  racks,
  selectedRack,
  onSelect,
}: {
  racks: Map<string, RackModel>;
  selectedRack: string | null;
  onSelect: (rack: string) => void;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-grey-line bg-grey-bg/50 p-3 sm:gap-4 sm:p-4">
      <Column rows={LEFT_COLUMN} racks={racks} selectedRack={selectedRack} onSelect={onSelect} />
      <Column rows={MIDDLE_COLUMN} racks={racks} selectedRack={selectedRack} onSelect={onSelect} />
      <Column rows={RIGHT_COLUMN} racks={racks} selectedRack={selectedRack} onSelect={onSelect} />
    </div>
  );
}
