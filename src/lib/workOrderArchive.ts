export interface ArchiveRow {
    mrp: string;
    warehouse: string;
    date: string;
    dn: string;
    van: string;
    wtg: string;
    turbine: string;
    activity: string;
    sp: string;
    stampato: string;
}

interface ArchiveResponse {
    ok: boolean;
    rows: ArchiveRow[];
}

const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbxhdrBipkY8SadkTMv6yz35gFhBhwUXAQDb-raoghqV00s6ownPp8on-f2TJ9_6vO-b/exec";

let cache: Promise<ArchiveRow[]> | null = null;

// "text/plain" keeps requests to this endpoint CORS-safelisted (no custom
// headers), avoiding a preflight OPTIONS request that this Apps Script
// deployment doesn't handle. The script still reads the raw body and
// JSON.parses it regardless of the declared content type.
function callArchive<T>(body: Record<string, unknown>): Promise<T> {
    return fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
    }).then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<T>;
    });
}

// Pass force:true to bypass the in-memory cache and hit the sheet again
// (used by the manual "refresh" button, since the sheet changes outside the
// app too — someone else printing a DN, etc.).
export function fetchArchiveRows(force = false): Promise<ArchiveRow[]> {
    if (force) cache = null;
    if (!cache) {
        cache = callArchive<ArchiveResponse>({ action: "getArchive" })
            .then(data => {
                if (!data.ok)
                    throw new Error(
                        "La risposta dell'archivio non è valida (ok: false).",
                    );
                return data.rows;
            })
            .catch(err => {
                cache = null; // allow retrying on next call
                throw err;
            });
    }
    return cache;
}

// "stampato" empty means the DN hasn't been printed yet — these are the only
// rows worth quick-adding to a new Work Order print.
export function isPending(row: ArchiveRow): boolean {
    return row.stampato === "";
}

// Matches the raw tab-separated layout the "New / DN track.2" print tool
// expects when pasted by hand: mrp, date, dn, van, wtg, turbine, activity.
export function toRawLine(row: ArchiveRow): string {
    return [
        row.mrp,
        row.date,
        row.dn,
        row.van,
        row.wtg,
        row.turbine,
        row.activity,
    ].join("\t");
}

// Called when a row is actually printed, so the sheet reflects that a DN has
// gone out and doesn't show up as pending again.
export function markAsPrinted(dn: string): Promise<void> {
    return callArchive<{ ok: boolean; error?: string }>({
        action: "markStampato",
        dn,
    }).then(res => {
        if (!res.ok)
            throw new Error(res.error || "markStampato ha restituito ok:false");
    });
}
