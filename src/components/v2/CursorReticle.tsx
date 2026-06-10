import { useEffect, useRef } from "react";

/**
 * Targeting-reticle cursor: instant dot + lerped ring that expands over
 * interactive elements. Desktop pointers only; native cursor returns for
 * text fields. No-op under prefers-reduced-motion.
 */
export function CursorReticle() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add("reticle");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let scale = 1;
    let targetScale = 1;
    let opacity = 0;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      opacity = 1;
      const el = (e.target as Element | null)?.closest?.(
        "a, button, [role=button], input, textarea, label",
      );
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA")) {
        opacity = 0; // native text cursor takes over
        targetScale = 1;
      } else {
        targetScale = el ? 2.2 : 1;
      }
    };
    const onLeave = () => {
      opacity = 0;
    };

    const tick = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      scale += (targetScale - scale) * 0.18;
      dot.style.transform = `translate(${x - 2}px, ${y - 2}px)`;
      dot.style.opacity = String(opacity);
      ring.style.transform = `translate(${rx - 14}px, ${ry - 14}px) scale(${scale})`;
      ring.style.opacity = String(opacity * 0.9);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("reticle");
    };
  }, []);

  return (
    <div aria-hidden="true" className="hidden md:block">
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[90] w-1 h-1 bg-cobalt pointer-events-none"
        style={{ opacity: 0 }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[90] w-7 h-7 border border-cobalt pointer-events-none"
        style={{ opacity: 0 }}
      >
        <span className="absolute top-1/2 left-0 w-1 h-px bg-cobalt -translate-y-1/2" />
        <span className="absolute top-1/2 right-0 w-1 h-px bg-cobalt -translate-y-1/2" />
        <span className="absolute left-1/2 top-0 h-1 w-px bg-cobalt -translate-x-1/2" />
        <span className="absolute left-1/2 bottom-0 h-1 w-px bg-cobalt -translate-x-1/2" />
      </div>
    </div>
  );
}
