import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "../types/lang";
import { I18N, type Strings } from "./strings";

const LANG_KEY = "vestas_hub_lang";

function loadInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === "it" || saved === "en") return saved;
  } catch {
    // storage unavailable — default below
  }
  return "it";
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Strings;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(loadInitialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_KEY, next);
    } catch {
      // storage unavailable — in-memory language switch still works
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ lang, setLang, t: I18N[lang] }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
