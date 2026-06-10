import { useEffect, useRef } from "react";

/**
 * Soft pointer accent: a glowing cobalt ring that trails the native cursor and
 * expands over interactive elements. The real OS cursor stays visible the whole
 * time — this is an ambient accent, not a replacement. Desktop pointers only;
 * disabled under prefers-reduced-motion.
 */
export function CursorReticle() {
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ring = ringRef.current;
    if (!ring) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let targetOpacity = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      targetOpacity = 1;
      const el = (e.target as Element | null)?.closest?.("a, button, [role=button]");
      const overText = (e.target as Element | null)?.closest?.("input, textarea");
      // grow on actionable elements; fade out over text fields so the I-beam reads cleanly
      targetScale = el ? 1.7 : 1;
      if (overText) targetOpacity = 0;
    };
    const onLeave = () => {
      targetOpacity = 0;
    };
    const onDown = () => {
      targetScale = Math.min(targetScale, 0.82);
    };
    const onUp = () => {
      targetScale = 1;
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      scale += (targetScale - scale) * 0.2;
      opacity += (targetOpacity - opacity) * 0.2;
      ring.style.transform = `translate(${rx}px, ${ry}px) scale(${scale})`;
      ring.style.opacity = String(opacity);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <div ref={ringRef} className="cursor-ring hidden md:block" aria-hidden="true" />;
}
