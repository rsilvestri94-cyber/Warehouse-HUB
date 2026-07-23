import { useEffect, useRef } from "react";

const SEEN_DWELL_MS = 1000;

// Clears the "unseen" badge/highlight after the user has looked at the panel
// for a full uninterrupted second (mouseenter/mouseleave), or immediately on
// touch (mobile has no hover concept, so touch = intent to view).
export function useDwellSeen<T extends HTMLElement>(onSeen: () => void) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const onEnter = () => {
      timer = setTimeout(onSeen, SEEN_DWELL_MS);
    };
    const onLeave = () => {
      if (timer) clearTimeout(timer);
      timer = null;
    };
    const onTouch = () => onSeen();

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onTouch);
    };
  }, [onSeen]);

  return ref;
}
