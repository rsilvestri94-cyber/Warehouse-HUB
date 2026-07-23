import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMaterialRows, type MaterialRow } from "../materialMap/api";
import { buildWarehouse, type Slot } from "../materialMap/buildWarehouse";
import { parseLocation, type Level } from "../materialMap/parseLocation";
import { FloorPlan } from "../materialMap/components/FloorPlan";
import { RackElevation } from "../materialMap/components/RackElevation";
import { SlotDetail } from "../materialMap/components/SlotDetail";
import { MaterialSearch } from "../materialMap/components/MaterialSearch";

export function MaterialMapPage() {
  const [rows, setRows] = useState<MaterialRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRack, setSelectedRack] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [highlightMaterial, setHighlightMaterial] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchMaterialRows()
      .then(setRows)
      .catch(err => setError(err instanceof Error ? err.message : String(err)));
  }, []);

  const warehouse = useMemo(() => buildWarehouse(rows ?? []), [rows]);

  const handleSelectRack = (rack: string) => {
    setSelectedRack(rack);
    setSelectedLevel(null);
    setSelectedSlot(null);
    setHighlightMaterial(undefined);
  };

  const handleSelectSlot = (level: Level, slot: Slot) => {
    setSelectedLevel(level);
    setSelectedSlot(slot);
    setHighlightMaterial(undefined);
  };

  const handleLocate = (row: MaterialRow) => {
    const parsed = parseLocation(row.LOCAZIONE);
    if (!parsed) return;
    const rackModel = warehouse.get(parsed.rack);
    const levelModel = rackModel?.levels[parsed.level];
    const slotKey =
      parsed.kind === "triple" ? `P${parsed.position}` : parsed.kind === "bluebox" ? `BOX${String(parsed.boxNumber).padStart(2, "0")}` : "single";
    const slot = levelModel?.slots.find(s => s.key === slotKey);
    setSelectedRack(parsed.rack);
    setSelectedLevel(parsed.level);
    setSelectedSlot(slot ?? null);
    setHighlightMaterial(row.Material);
  };

  const selectedRackModel = selectedRack ? (warehouse.get(selectedRack) ?? { rack: selectedRack, levels: {}, itemCount: 0 }) : null;

  return (
    <div className="min-h-screen bg-grey-bg">
      <header className="border-b border-grey-line bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="font-heading text-lg font-bold text-blue-dark">Mappa Materiali</h1>
            <p className="text-xs text-ink/50">Localizzazione scaffali e ricerca materiali a magazzino</p>
          </div>
          <Link to="/" className="rounded-full border border-grey-line px-3 py-1.5 text-xs font-semibold text-blue-mid hover:bg-grey-bg">
            ← Torna all'hub
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 sm:px-6">
        {error && (
          <div className="rounded-2xl border border-brand-red/30 bg-brand-red/10 p-4 text-sm text-brand-red">
            Errore nel caricamento dei dati: {error}
          </div>
        )}
        {!error && rows === null && <div className="rounded-2xl border border-grey-line bg-white p-6 text-center text-sm text-ink/50">Caricamento…</div>}

        {rows !== null && (
          <>
            <MaterialSearch rows={rows} onLocate={handleLocate} />

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
              <FloorPlan racks={warehouse} selectedRack={selectedRack} onSelect={handleSelectRack} />

              <div className="flex flex-col gap-4">
                {selectedRackModel ? (
                  <>
                    <div className="font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
                      Scaffale {Number(selectedRack)}
                      {selectedRackModel.itemCount === 0 && (
                        <span className="ml-2 font-normal normal-case text-ink/40">— nessun materiale mappato</span>
                      )}
                    </div>
                    <RackElevation rack={selectedRackModel} selectedSlotKey={selectedLevel && selectedSlot ? `${selectedLevel}-${selectedSlot.key}` : null} onSelectSlot={handleSelectSlot} />
                    {selectedLevel && selectedSlot && (
                      <SlotDetail rack={selectedRack!} level={selectedLevel} slot={selectedSlot} highlightMaterial={highlightMaterial} />
                    )}
                  </>
                ) : (
                  <div className="rounded-2xl border border-dashed border-grey-line p-6 text-center text-sm text-ink/40">
                    Seleziona uno scaffale sulla mappa per vedere il prospetto verticale.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
