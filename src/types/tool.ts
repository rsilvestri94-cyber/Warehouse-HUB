import type { LocalizedText } from "./lang";

export type IconKey = "sheet" | "check" | "folder" | "globe";

export interface Tool {
  key: string;
  title: LocalizedText;
  description: LocalizedText;
  url: string;
  cta: LocalizedText;
  icon: IconKey;
  color?: string;
}

export interface ToolPrefs {
  order: string[];
  overrides: Record<string, Partial<Tool>>;
  custom: Tool[];
}

export const EMPTY_PREFS: ToolPrefs = { order: [], overrides: {}, custom: [] };
