import { useEffect, useState } from "react";

const BOOT_LINES = [
  "00BIT SECURE SHELL v2.0",
  "> auth ............ ok · clearance: visitor",
  "> chain indexes ... mounted 6/6",
  "> graph engine .... warm",
  "> PRECOG ONLINE",
];

/**
 * Terminal boot sequence on first visit of the session. Click to skip.
 * Skipped entirely for return visits and prefers-reduced-motion.
 */
export function BootOverlay() {
  const [lines, setLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<"hidden" | "typing" | "fading">("hidden");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    try {
      if (sessionStorage.getItem("booted")) return;
      sessionStorage.setItem("booted", "1");
    } catch {
      return;
    }
    setPhase("typing");
    const timers: ReturnType<typeof setTimeout>[] = [];
    BOOT_LINES.forEach((l, i) => {
      timers.push(setTimeout(() => setLines((prev) => [...prev, l]), 180 + i * 260));
    });
    timers.push(setTimeout(() => setPhase("fading"), 180 + BOOT_LINES.length * 260 + 500));
    timers.push(setTimeout(() => setPhase("hidden"), 180 + BOOT_LINES.length * 260 + 1100));
    return () => timers.forEach(clearTimeout);
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      onClick={() => setPhase("hidden")}
      className={`fixed inset-0 z-[100] bg-base flex items-center justify-center transition-opacity duration-500 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="font-mono-ui text-[12px] md:text-[13px] leading-[2.1] text-ink-soft w-[min(520px,85vw)]">
        {lines.map((l, i) => (
          <div key={i} className={i === BOOT_LINES.length - 1 ? "text-signal" : ""}>
            {l}
          </div>
        ))}
        <span className="caret-blink inline-block w-[8px] h-[14px] bg-cobalt align-middle" />
      </div>
    </div>
  );
}
