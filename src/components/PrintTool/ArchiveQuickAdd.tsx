import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { fetchArchiveRows, isPending, toRawLine, type ArchiveRow } from "../../lib/workOrderArchive";

export function ArchiveQuickAdd({ onAddLine }: { onAddLine: (line: string) => void }) {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<ArchiveRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [addedDns, setAddedDns] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!open || rows !== null || error) return;
    fetchArchiveRows()
      .then(setRows)
      .catch(err => setError(err instanceof Error ? err.message : String(err)));
  }, [open, rows, error]);

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRefreshing(true);
    setError(null);
    fetchArchiveRows(true)
      .then(setRows)
      .catch(err => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setRefreshing(false));
  };

  const pending = rows?.filter(isPending) ?? [];

  const addRow = (row: ArchiveRow) => {
    onAddLine(toRawLine(row));
    setAddedDns(prev => new Set([...prev, row.dn]));
  };

  const addAll = () => {
    for (const row of pending) {
      if (!addedDns.has(row.dn)) onAddLine(toRawLine(row));
    }
    setAddedDns(new Set(pending.map(r => r.dn)));
  };

  return (
    <div className="mb-3 rounded-xl border border-grey-line bg-grey-bg/60">
      <div className="flex w-full items-center gap-2 p-3">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <span className="font-heading text-xs font-bold uppercase tracking-wide text-blue-mid">
            Aggiungi rapido dall'archivio DN
          </span>
          {rows !== null && (
            <span className="rounded-full bg-blue-dark px-2 py-0.5 text-[0.65rem] font-bold text-white">
              {pending.length} da inviare
            </span>
          )}
        </button>
        {open && (
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            title="Aggiorna elenco"
            className="flex shrink-0 items-center justify-center rounded-full p-1 text-ink/40 transition hover:bg-grey-line/60 hover:text-ink disabled:opacity-40"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
          </button>
        )}
        <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="shrink-0">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-grey-line p-3">
          {error && <p className="text-sm text-brand-red">Errore nel caricamento dell'archivio: {error}</p>}
          {!error && rows === null && <p className="text-sm text-ink/40">Caricamento…</p>}
          {rows !== null && pending.length === 0 && (
            <p className="text-sm text-ink/40">Nessuna riga in attesa di invio.</p>
          )}
          {pending.length > 0 && (
            <>
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={addAll}
                  className="rounded-full bg-blue-dark px-3 py-1 text-xs font-bold text-white hover:bg-blue-mid"
                >
                  Aggiungi tutte
                </button>
              </div>
              <ul className="flex max-h-64 flex-col gap-1 overflow-y-auto">
                {pending.map(row => {
                  const added = addedDns.has(row.dn);
                  return (
                    <li key={row.dn} className="flex items-center justify-between gap-3 rounded-lg bg-white p-2 text-sm shadow-sm">
                      <span className="min-w-0 flex-1">
                        <span className="font-heading font-bold text-blue-dark">{row.turbine}</span>
                        <span className="text-ink/60">
                          {" "}
                          — VAN {row.van} — {row.activity} — {row.date}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => addRow(row)}
                        disabled={added}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition ${
                          added ? "bg-grey-line text-ink/40" : "bg-blue-dark text-white hover:bg-blue-mid"
                        }`}
                      >
                        {added ? "✓ Aggiunta" : "+ Aggiungi"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
