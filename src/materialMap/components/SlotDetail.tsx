import { Printer } from "lucide-react";
import type { Level } from "../parseLocation";
import type { Slot } from "../buildWarehouse";
import { buildMaterialListPdf } from "../materialListPdf";

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
  const titleParts = [`Scaffale ${Number(rack)}`, `Ripiano ${level}`];
  if (slot.label) titleParts.push(slot.label);
  const title = titleParts.join(" — ");

  const handlePrint = () => {
    const doc = buildMaterialListPdf(title, slot.items);
    window.open(doc.output("bloburl").toString(), "_blank");
  };

  return (
    <div className="rounded-2xl border border-grey-line bg-white p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">{title}</div>
        {slot.items.length > 0 && (
          <button
            type="button"
            onClick={handlePrint}
            title="Stampa lista materiali"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-blue-dark px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-mid"
          >
            <Printer size={13} />
            Stampa
          </button>
        )}
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
