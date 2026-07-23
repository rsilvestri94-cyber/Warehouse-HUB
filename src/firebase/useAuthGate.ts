import { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleAuthProvider,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { isInAppBrowser } from "./inAppBrowser";

export type GateState = "loading" | "inapp" | "signin" | "pending" | "error" | "approved";

export interface AuthErrorInfo {
  key: "authGeneric" | "authPopupBlocked";
  detail?: string;
}

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

const ADMIN_MAIL = ["r.silvestri94", "gmail.com"].join("@");

export function useAuthGate() {
  const [state, setState] = useState<GateState>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState<AuthErrorInfo | null>(null);
  const userInsists = useRef(false);

  const handleUser = useCallback(async (u: User | null) => {
    if (!u) {
      setUser(null);
      setIsAdmin(false);
      setState(isInAppBrowser() && !userInsists.current ? "inapp" : "signin");
      return;
    }

    setState("loading");
    const email = (u.email || "").toLowerCase();

    try {
      // The approval list is the single gate. Firestore rules enforce this
      // too — this check is just so we can show a friendly screen instead of
      // a wall of permission errors.
      const snap = await getDoc(doc(db, "allowed", email));
      if (!snap.exists()) {
        setPendingEmail(u.email || "");
        setIsAdmin(false);
        setState("pending");
        return;
      }
      const data = snap.data() || {};
      setIsAdmin(data.admin === true);
    } catch (e) {
      const code = (e as { code?: string })?.code || String(e);
      setError({ key: "authGeneric", detail: code });
      setState("error");
      return;
    }

    setUser(u);
    setState("approved");
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, handleUser);
    // If we came back from a redirect sign-in, surface any failure —
    // otherwise the page would just land silently on the sign-in screen
    // again and look like nothing happened.
    getRedirectResult(auth).catch(e => {
      const code = (e as { code?: string })?.code || "";
      if (!code) return;
      setError({ key: "authGeneric", detail: code });
      setState("error");
    });
    return unsub;
  }, [handleUser]);

  const signIn = useCallback(async () => {
    setState("loading");
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      const code = (e as { code?: string })?.code || "";

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        setState("signin"); // they simply changed their mind — not an error
        return;
      }

      // Popups are unreliable on mobile and in locked-down browsers. Rather
      // than dead-ending, switch to the redirect flow, which navigates the
      // whole page to Google instead of opening a window.
      if (
        code === "auth/popup-blocked" ||
        code === "auth/operation-not-supported-in-this-environment" ||
        code === "auth/web-storage-unsupported"
      ) {
        try {
          await signInWithRedirect(auth, provider);
          return; // page navigates away
        } catch (e2) {
          const code2 = (e2 as { code?: string })?.code || String(e2);
          setError({ key: "authGeneric", detail: code2 });
          setState("error");
          return;
        }
      }

      setError({ key: "authGeneric", detail: code || String(e) });
      setState("error");
    }
  }, []);

  const signInAlternate = useCallback(async () => {
    // Escape hatch: forces the redirect flow regardless of why the popup
    // didn't work. Some popup failures report no error at all (the window is
    // opened and killed instantly), so an error-code-driven fallback can't
    // catch them — this can.
    setState("loading");
    try {
      await signInWithRedirect(auth, provider);
    } catch (e) {
      const code = (e as { code?: string })?.code || String(e);
      setError({ key: "authGeneric", detail: code });
      setState("error");
    }
  }, []);

  const tryAnywayInApp = useCallback(() => {
    // Detection could be wrong (user agents are a mess). Never trap someone
    // behind a heuristic — let them try the normal flow.
    userInsists.current = true;
    setState("signin");
  }, []);

  const doSignOut = useCallback(() => {
    void signOut(auth);
  }, []);

  const retryApproval = useCallback(() => {
    if (auth.currentUser) void handleUser(auth.currentUser);
  }, [handleUser]);

  const dismissError = useCallback(() => setState("signin"), []);

  const requestAccess = useCallback(() => {
    const u = auth.currentUser;
    if (!u) return;
    const name = u.displayName || "";
    const email = u.email || "";
    const subject = "Richiesta accesso Warehouse HUB — " + email;
    const body =
      "Ciao Raffaele,\n\n" +
      "chiedo l'autorizzazione ad accedere al Warehouse HUB Organizer.\n\n" +
      "Account Google: " +
      email +
      "\n" +
      (name ? "Nome: " + name + "\n" : "") +
      "\nGrazie.";
    window.location.href =
      "mailto:" + ADMIN_MAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }, []);

  return {
    state,
    user,
    isAdmin,
    pendingEmail,
    error,
    signIn,
    signInAlternate,
    tryAnywayInApp,
    signOut: doSignOut,
    retryApproval,
    dismissError,
    requestAccess,
  };
}
