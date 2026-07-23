import { useMemo, useState } from "react";
import type { MaterialRow } from "../api";
import { parseLocation } from "../parseLocation";

export function MaterialSearch({
  rows,
  onLocate,
}: {
  rows: MaterialRow[];
  onLocate: (row: MaterialRow) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return rows
      .filter(r => r.Material.toLowerCase().includes(q) || r.Descrizione.toLowerCase().includes(q))
      .slice(0, 100);
  }, [rows, query]);

  return (
    <div className="rounded-2xl border border-grey-line bg-white p-4">
      <label className="text-xs font-semibold text-ink/60">
        Cerca per codice Material o Descrizione
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="es. 132021 oppure HOSE ASSY..."
          className="mt-1 w-full rounded-lg border border-grey-line px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </label>

      {query.trim() && (
        <div className="mt-3 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <p className="py-3 text-center text-xs text-ink/40">Nessun risultato.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {results.map(row => {
                const located = row.LOCAZIONE && parseLocation(row.LOCAZIONE);
                return (
                  <li key={row._row}>
                    <button
                      type="button"
                      disabled={!located}
                      onClick={() => onLocate(row)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg p-2 text-left text-sm transition ${
                        located ? "hover:bg-grey-bg" : "cursor-default opacity-60"
                      }`}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="font-heading font-bold text-blue-dark">{row.Material}</span>
                        <span className="text-ink/60"> — {row.Descrizione}</span>
                      </span>
                      {located ? (
                        <span className="shrink-0 rounded-full bg-blue-dark/10 px-2 py-0.5 text-[0.65rem] font-bold text-blue-dark">
                          Scaffale {Number(located.rack)} / {located.level}
                        </span>
                      ) : (
                        <span className="shrink-0 rounded-full bg-grey-line px-2 py-0.5 text-[0.65rem] font-bold text-ink/50">
                          non mappato
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {results.length === 100 && <p className="mt-1 text-center text-[0.65rem] text-ink/40">Mostrati i primi 100 risultati — affina la ricerca.</p>}
        </div>
      )}
    </div>
  );
}
