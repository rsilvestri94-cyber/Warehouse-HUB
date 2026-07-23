export interface MaterialRow {
  Material: string;
  Descrizione: string;
  LOCAZIONE: string;
  _row: number;
}

interface MaterialApiResponse {
  ok: boolean;
  sheet: string;
  rows: MaterialRow[];
}

const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwfA91jMcPCn_w_Rzu9qFl-wxbh4CeQJj_km7ofJwXP-VwrUIaWj45NOt1JBFdyupiz/exec";

let cache: Promise<MaterialRow[]> | null = null;

// The sheet is ~2000 rows / ~200KB and doesn't change during a session, so a
// single in-memory fetch is reused across mounts/navigations rather than
// re-fetching every time the map page is opened.
export function fetchMaterialRows(): Promise<MaterialRow[]> {
  if (!cache) {
    cache = fetch(ENDPOINT)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<MaterialApiResponse>;
      })
      .then(data => {
        if (!data.ok) throw new Error("La risposta del foglio non è valida (ok: false).");
        return data.rows;
      })
      .catch(err => {
        cache = null; // allow retrying on next call
        throw err;
      });
  }
  return cache;
}
