// Google deliberately refuses OAuth inside app-embedded browsers (WhatsApp,
// Instagram, Facebook...) — it returns "disallowed_useragent". Nothing we can
// do about that, so the honest move is to recognise the situation and tell
// the person how to get out of it, rather than let them press a button that
// can never work.
export function isInAppBrowser(): boolean {
  const ua = navigator.userAgent || "";
  if (/\bwv\b/.test(ua)) return true; // Android WebView
  if (
    /FBAN|FBAV|FB_IAB|Instagram|Line\/|Twitter|WhatsApp|Snapchat|Pinterest|LinkedInApp|MicroMessenger/i.test(
      ua,
    )
  )
    return true;
  // iOS in-app WKWebViews lack the Safari token that real Safari has
  if (/iPhone|iPad|iPod/.test(ua) && !/Safari/.test(ua) && !/CriOS|FxiOS/.test(ua))
    return true;
  return false;
}
