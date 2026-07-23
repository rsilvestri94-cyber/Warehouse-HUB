export interface WorkOrderRow {
  date: string;
  van: string;
  turbine: string;
  activity: string;
  dn?: string;
}

export interface ColumnMap {
  date: number;
  van: number;
  turbine: number;
  activity: number;
  minCols: number;
  dn?: number;
}

// Old archive layout: Data(0) | ignored(1) | VAN(2) | Turbine(3) | Activity(4)
export const OLD_COLUMNS: ColumnMap = { date: 0, van: 2, turbine: 3, activity: 4, minCols: 5 };

// DN track.2 layout: mrp(0) | Data(1) | DN(2) | VAN(3) | ignored(4) | Turbine(5) | Activity(6)
export const NEWS_COLUMNS: ColumnMap = { date: 1, van: 3, turbine: 5, activity: 6, minCols: 7, dn: 2 };

function todayDate(): string {
  return new Date().toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDate(str: string): string {
  if (!str) return todayDate();
  const m = str.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (!m) return str;
  const day = String(parseInt(m[1], 10)).padStart(2, "0");
  const month = String(parseInt(m[2], 10)).padStart(2, "0");
  const year = m[3];
  return `${day}/${month}/${year}`;
}

export function parseRow(line: string, cols: ColumnMap): WorkOrderRow | null {
  let parts = line.split("\t").map(s => s.trim());
  if (parts.length < cols.minCols) parts = line.split(/\s{2,}/).map(s => s.trim());
  if (parts.length < cols.minCols) return null;
  return {
    date: formatDate(parts[cols.date]),
    van: parts[cols.van] || "",
    turbine: parts[cols.turbine] || "",
    activity: parts[cols.activity] || "",
    dn: cols.dn !== undefined ? parts[cols.dn] || "" : undefined,
  };
}

export function parseAll(raw: string, cols: ColumnMap): WorkOrderRow[] {
  return raw
    .trim()
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => parseRow(l, cols))
    .filter((r): r is WorkOrderRow => r !== null);
}

// Italian hyphenation for turbine names: splits a name into max 2 lines
// following Italian syllable rules. Prefers splitting on spaces; for single
// long words uses a vowel-consonant-vowel boundary. Returns the name with a
// literal "\n" where it should break onto a second line.
export function hyphenateTurbine(name: string): string {
  const MAX = 15;
  if (name.length <= MAX) return name;

  // Separate trailing number (e.g. " 16", " 03")
  const trailMatch = name.match(/^(.*?)(\s+\d+\w*)$/);
  const wordPart = trailMatch ? trailMatch[1] : name;
  const trailPart = trailMatch ? trailMatch[2] : "";

  // If word_part has an internal space, split there first
  const innerSpace = wordPart.lastIndexOf(" ");
  if (innerSpace > 0) {
    const first = wordPart.substring(0, innerSpace);
    const rest = wordPart.substring(innerSpace + 1) + trailPart;
    return first + "\n" + rest;
  }

  // Word fits on one line → number on next line
  if (wordPart.length <= MAX) {
    return wordPart + "\n" + trailPart.trim();
  }

  // Long single word: Italian syllable break (vowel-consonant-vowel boundary)
  const vowels = "aeiouAEIOU";
  const breaks: number[] = [];
  for (let i = 2; i < wordPart.length - 1; i++) {
    const prev = wordPart[i - 1];
    const curr = wordPart[i];
    const nxt = wordPart[i + 1];
    if (vowels.includes(prev) && !vowels.includes(curr) && vowels.includes(nxt)) {
      breaks.push(i);
    }
  }
  let chosen = -1;
  for (const b of breaks) {
    if (b <= MAX) chosen = b;
  }
  if (chosen === -1 && breaks.length > 0) chosen = breaks[0];
  if (chosen === -1) chosen = MAX;

  return wordPart.substring(0, chosen) + "-\n" + wordPart.substring(chosen) + trailPart;
}
