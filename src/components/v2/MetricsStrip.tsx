import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 14000000, suffix: "+", label: "transactions scored", format: "compact" },
  { value: 6, suffix: "", label: "chains supported", format: "plain" },
  { value: 3, suffix: "s", prefix: "< ", label: "median score time", format: "plain" },
];

function formatNumber(n: number, fmt: string) {
  if (fmt === "compact") return n.toLocaleString("en-US");
  return String(n);
}

export function MetricsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-panel-soft border-y border-muted-line">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-20 grid grid-cols-1 md:grid-cols-3 gap-10">
        {stats.map((s, i) => (
          <Stat key={i} {...s} active={active} />
        ))}
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix = "",
  prefix = "",
  label,
  format,
  active,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  format: string;
  active: boolean;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!active) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(value);
      return;
    }
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCurrent(Math.round(value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, value]);

  return (
    <div className="flex flex-col">
      <div
        className="font-display text-ink leading-none tabular-nums"
        style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
      >
        {prefix}
        {formatNumber(current, format)}
        {suffix}
      </div>
      <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-ink-soft mt-5">
        {label}
      </div>
    </div>
  );
}
