import type { Level } from "../parseLocation";
import type { Slot } from "../buildWarehouse";

export function SlotDetail({
  rack,
  level,
  slot,
  highlightMaterial,
}: {
  rack: string;
  level: Level;
  slot: Slot;
  highlightMaterial?: string;
}) {
  return (
    <div className="rounded-2xl border border-grey-line bg-white p-4">
      <div className="mb-2 font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
        Scaffale {Number(rack)} — Ripiano {level}
        {slot.label && ` — ${slot.label}`}
      </div>
      {slot.items.length === 0 ? (
        <p className="text-sm text-ink/40">Nessun materiale in questa posizione.</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {slot.items.map(item => (
            <li
              key={item._row}
              className={`rounded-lg p-2 text-sm transition ${
                item.Material === highlightMaterial ? "bg-accent/10 ring-1 ring-accent/50" : "hover:bg-grey-bg"
              }`}
            >
              <span className="font-heading font-bold text-blue-dark">{item.Material}</span>
              <span className="text-ink/70"> — {item.Descrizione}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
