import { useEffect, useRef, useState } from "react";

type Line = { id: number; time: string; module: string; text: string; threat: boolean };

const MODULES = ["ATLAS", "TANGO", "PEDIGRID", "BRIDGE"] as const;

const HEX = "0123456789abcdef";
const randHex = (n: number) =>
  Array.from({ length: n }, () => HEX[Math.floor(Math.random() * 16)]).join("");
const addr = () => `0x${randHex(3)}…${randHex(3)}`;
const btc = () => `bc1q${randHex(3)}…${randHex(4)}`;

function makeLine(id: number): Line {
  const module = MODULES[Math.floor(Math.random() * MODULES.length)];
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const time = `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`;
  const conf = (0.62 + Math.random() * 0.37).toFixed(2);
  switch (module) {
    case "ATLAS":
      return {
        id,
        time,
        module,
        threat: Math.random() < 0.4,
        text: `mixer adjacency · ${1 + Math.floor(Math.random() * 3)} hops · ${addr()} · conf ${conf}`,
      };
    case "TANGO": {
      const pat = ["fan-out burst", "peel-chain", "dormancy break", "timing anomaly"][
        Math.floor(Math.random() * 4)
      ];
      return {
        id,
        time,
        module,
        threat: Math.random() < 0.5,
        text: `${pat} · ${addr()} → ${2 + Math.floor(Math.random() * 17)} addrs · conf ${conf}`,
      };
    }
    case "PEDIGRID":
      return {
        id,
        time,
        module,
        threat: true,
        text: `lineage hit · flagged ancestor @ ${1 + Math.floor(Math.random() * 4)} hops · ${btc()}`,
      };
    default:
      return {
        id,
        time,
        module,
        threat: false,
        text: `ETH→BTC crossing · ${(Math.random() * 80 + 2).toFixed(1)} ETH · trail maintained`,
      };
  }
}

const MAX = 9;

export function LiveFeed() {
  const [lines, setLines] = useState<Line[]>([]);
  const idRef = useRef(0);
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLines(Array.from({ length: 5 }, () => makeLine(idRef.current++)));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let live = true;
    const loop = () => {
      if (!live) return;
      setLines((prev) => [...prev.slice(-(MAX - 1)), makeLine(idRef.current++)]);
      timer = setTimeout(loop, 1200 + Math.random() * 1600);
    };
    const io = new IntersectionObserver(([e]) => {
      live = e.isIntersecting;
      clearTimeout(timer);
      if (live) timer = setTimeout(loop, 600);
    });
    if (hostRef.current) io.observe(hostRef.current);
    return () => {
      live = false;
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  return (
    <section id="feed" className="border-y border-muted-line">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt">
            // 01 / Live feed
          </div>
          <h2
            className="font-display font-medium text-ink mt-5 leading-[1.02] tracking-[-0.03em] [text-wrap:balance]"
            style={{ fontSize: "clamp(34px, 3.6vw, 56px)" }}
          >
            Detection, in real time.
          </h2>
          <p className="text-ink-soft mt-6 text-[15px] leading-relaxed max-w-[44ch]">
            Every block on every indexed chain is scored as it lands. This is a live rendering of
            the detection stream — each pattern identified and named the moment it forms.
          </p>
        </div>

        <div ref={hostRef} className="lg:col-span-8">
          <div className="hud-frame bg-surface border border-muted-line">
            <div className="flex items-center justify-between px-5 py-3 border-b border-muted-line">
              <span className="font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                Detection stream — illustrative example
              </span>
              <span className="flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-signal">
                <span className="online-pulse inline-block w-1.5 h-1.5 bg-[var(--signal)]" />
                live
              </span>
            </div>
            <div className="px-5 py-5 font-mono-ui text-[11px] md:text-[12px] leading-[2.2] min-h-[280px]">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-3 whitespace-nowrap overflow-hidden">
                  <span className="text-ink-soft/50 tabular-nums shrink-0">[{l.time}]</span>
                  <span className={`shrink-0 ${l.threat ? "text-threat" : "text-cobalt"}`}>
                    {l.module}
                  </span>
                  <span className="text-ink-soft truncate">▸ {l.text}</span>
                </div>
              ))}
              <span className="caret-blink inline-block w-[7px] h-[12px] bg-cobalt align-middle" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
