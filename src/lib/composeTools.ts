import type { Tool, ToolPrefs } from "../types/tool";
import { BASE_TOOLS } from "../data/tools";

// Rebuilds the visible grid: catalogue + personal tools, with personal edits
// applied, in the personal order. Tools the person has never seen (added to
// the catalogue after they last saved) land at the end rather than vanishing.
export function composeTools(prefs: ToolPrefs): Tool[] {
  const byKey: Record<string, Tool> = {};
  BASE_TOOLS.forEach(tool => {
    byKey[tool.key] = tool;
  });
  (prefs.custom || []).forEach(tool => {
    if (tool && tool.key) byKey[tool.key] = tool;
  });
  Object.keys(prefs.overrides || {}).forEach(k => {
    if (byKey[k]) byKey[k] = { ...byKey[k], ...prefs.overrides[k], key: k };
  });

  const ordered: Tool[] = [];
  (prefs.order || []).forEach(k => {
    if (byKey[k]) {
      ordered.push(byKey[k]);
      delete byKey[k];
    }
  });
  // Anything not in the saved order (new in the catalogue) goes last.
  BASE_TOOLS.forEach(tool => {
    if (byKey[tool.key]) {
      ordered.push(byKey[tool.key]);
      delete byKey[tool.key];
    }
  });
  Object.keys(byKey).forEach(k => ordered.push(byKey[k]));
  return ordered;
}
