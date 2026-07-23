import { useI18n } from "../../i18n/I18nContext";
import type { useAuthGate } from "../../firebase/useAuthGate";
import {
  AlertIcon,
  CheckShieldIcon,
  ChromeIcon,
  ClockIcon,
  GoogleGIcon,
  MailIcon,
  UnplugIcon,
  VestasBrandMark,
} from "./icons";

type Gate = ReturnType<typeof useAuthGate>;

export function AuthGate({ gate }: { gate: Gate }) {
  const { t } = useI18n();

  if (gate.state === "approved") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-dark to-blue-mid p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-6 flex items-center justify-center gap-2 text-blue-dark">
          <VestasBrandMark className="h-6 w-6" />
          <span className="font-heading text-lg font-bold">Warehouse HUB Organizer</span>
        </div>

        {gate.state === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-grey-line border-t-accent" />
            <p className="text-sm text-ink/80">{t.authChecking}</p>
          </div>
        )}

        {gate.state === "inapp" && (
          <div className="flex flex-col items-center gap-4">
            <UnplugIcon className="h-10 w-10 text-blue-mid" />
            <p className="font-semibold text-ink">{t.authInAppTitle}</p>
            <p className="text-sm text-ink/70">{t.authInAppSub}</p>
            <button
              type="button"
              onClick={() => (/Android/i.test(navigator.userAgent) ? openChrome() : copyLink())}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-dark px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-blue-mid"
            >
              <ChromeIcon className="h-4 w-4" />
              {t.authOpenChrome}
            </button>
            <CopyLinkButton label={t.authCopyLink} copiedLabel={t.authCopied} />
            <button
              type="button"
              onClick={gate.tryAnywayInApp}
              className="text-xs text-ink/50 underline underline-offset-2 hover:text-ink"
            >
              {t.authTryAnyway}
            </button>
          </div>
        )}

        {gate.state === "signin" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-ink/80">{t.authSignInMsg}</p>
            <button
              type="button"
              onClick={gate.signIn}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-grey-line bg-white px-5 py-3 font-heading text-sm font-bold text-ink shadow-sm transition hover:bg-grey-bg"
            >
              <GoogleGIcon className="h-5 w-5" />
              {t.authSignInBtn}
            </button>
            <button
              type="button"
              onClick={gate.signInAlternate}
              className="text-xs text-ink/50 underline underline-offset-2 hover:text-ink"
            >
              {t.authAltMethod}
            </button>
          </div>
        )}

        {gate.state === "pending" && (
          <div className="flex flex-col items-center gap-4">
            <ClockIcon className="h-10 w-10 text-blue-mid" />
            <p className="font-semibold text-ink">{t.authPendingTitle}</p>
            <p className="text-sm text-ink/70">
              {t.authPendingSub}
              <br />
              <strong className="text-ink">{gate.pendingEmail}</strong>
            </p>
            <button
              type="button"
              onClick={gate.requestAccess}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-dark px-5 py-3 font-heading text-sm font-bold text-white transition hover:bg-blue-mid"
            >
              <MailIcon className="h-4 w-4" />
              {t.authRequestBtn}
            </button>
            <div className="flex w-full gap-2">
              <button
                type="button"
                onClick={gate.retryApproval}
                className="flex-1 rounded-full border border-grey-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-grey-bg"
              >
                {t.authRetry}
              </button>
              <button
                type="button"
                onClick={gate.signOut}
                className="flex-1 rounded-full border border-grey-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-grey-bg"
              >
                {t.authSignOut}
              </button>
            </div>
          </div>
        )}

        {gate.state === "error" && (
          <div className="flex flex-col items-center gap-4">
            <AlertIcon className="h-10 w-10 text-brand-red" />
            <p className="font-semibold text-ink">{t.authErrorTitle}</p>
            <p className="text-sm text-ink/70">
              {gate.error ? t[gate.error.key] + (gate.error.detail ? `  [${gate.error.detail}]` : "") : ""}
            </p>
            <button
              type="button"
              onClick={gate.dismissError}
              className="w-full rounded-full border border-grey-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-grey-bg"
            >
              {t.authRetry}
            </button>
          </div>
        )}

        {gate.isAdmin && gate.state !== "loading" && (
          <div className="mt-6 flex items-center justify-center gap-1 text-xs text-ink/40">
            <CheckShieldIcon className="h-3.5 w-3.5" />
            admin
          </div>
        )}
      </div>
    </div>
  );
}

function openChrome() {
  const ua = navigator.userAgent || "";
  const url = location.href;
  if (/Android/i.test(ua)) {
    const bare = url.replace(/^https?:\/\//, "");
    window.location.href = "intent://" + bare + "#Intent;scheme=https;package=com.android.chrome;end";
  } else {
    void navigator.clipboard?.writeText(url);
  }
}

function copyLink() {
  void navigator.clipboard?.writeText(location.href);
}

function CopyLinkButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  return (
    <button
      type="button"
      onClick={async e => {
        try {
          await navigator.clipboard.writeText(location.href);
          const el = e.currentTarget;
          const original = el.textContent;
          el.textContent = copiedLabel;
          setTimeout(() => {
            el.textContent = original;
          }, 1800);
        } catch {
          // clipboard blocked — nothing more we can do here
        }
      }}
      className="w-full rounded-full border border-grey-line px-4 py-2 text-sm font-semibold text-ink transition hover:bg-grey-bg"
    >
      {label}
    </button>
  );
}
