import { useI18n } from "../i18n/I18nContext";

export function Footer() {
  const { lang } = useI18n();
  return (
    <footer className="mx-auto max-w-5xl px-6 py-8 text-center text-xs text-ink/50">
      <p>
        {lang === "it" ? (
          <>
            Questo hub è stato sviluppato da <strong>RASLT – Raffaele Silvestri</strong>, con il supporto di{" "}
            <strong>Gianluca Nardella</strong>.
          </>
        ) : (
          <>
            This hub was developed by <strong>RASLT – Raffaele Silvestri</strong>, with the support of{" "}
            <strong>Gianluca Nardella</strong>.
          </>
        )}
      </p>
      <p className="mt-1">{lang === "it" ? "Versione 2.07 · 22 luglio 2026" : "Version 2.07 · July 22, 2026"}</p>
    </footer>
  );
}
