import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/* Small static SVG accents — one quiet motif per module, no animation. */

function AtlasGlyph() {
  const nodes = [
    { x: 8, y: 26 },
    { x: 30, y: 10 },
    { x: 52, y: 24 },
    { x: 74, y: 8 },
    { x: 92, y: 22 },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 3],
  ] as const;
  return (
    <svg viewBox="0 0 100 34" className="w-[100px] h-[34px]" aria-hidden="true">
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="var(--ink-soft)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={i === 2 ? 3.5 : 2.5} fill="var(--cobalt)" />
      ))}
    </svg>
  );
}

function TangoGlyph() {
  return (
    <svg viewBox="0 0 100 34" className="w-[100px] h-[34px]" aria-hidden="true">
      <path
        d="M0 20 C 8 20, 10 12, 18 12 S 28 22, 36 22 S 46 8, 54 8 S 64 26, 72 26 S 82 14, 90 14 L 100 16"
        fill="none"
        stroke="var(--cobalt)"
        strokeWidth="1.5"
      />
      <circle cx="54" cy="8" r="3" fill="none" stroke="var(--threat)" strokeWidth="1" />
    </svg>
  );
}

function PedigridGlyph() {
  return (
    <svg viewBox="0 0 100 34" className="w-[100px] h-[34px]" aria-hidden="true">
      <path
        d="M50 5 L50 14 M50 14 L26 24 M50 14 L74 24 M26 24 L14 31 M26 24 L38 31"
        fill="none"
        stroke="var(--ink-soft)"
        strokeOpacity="0.45"
        strokeWidth="1"
      />
      <circle cx="50" cy="5" r="3" fill="var(--cobalt)" />
      <circle cx="26" cy="24" r="2.5" fill="var(--ink-soft)" />
      <circle cx="74" cy="24" r="2.5" fill="var(--ink-soft)" />
      <circle cx="14" cy="31" r="2.5" fill="var(--threat)" />
      <circle cx="38" cy="31" r="2.5" fill="var(--ink-soft)" />
    </svg>
  );
}

const MODULES: {
  name: string;
  tag: string;
  body: string;
  stat: string;
  glyph: ReactNode;
}[] = [
  {
    name: "ATLAS",
    tag: "Exposure mapping",
    body: "Maps where the money has been. Atlas walks the multi-chain graph from a single address, scoring every connection by distance, volume and source confidence — built for analysts who need to defend each conclusion.",
    stat: "Multi-chain · n-hop · auditable",
    glyph: <AtlasGlyph />,
  },
  {
    name: "TANGO",
    tag: "Pattern detection",
    body: "Reads the rhythm of the chain. Real-time detection of fan-out, peel-chain laundering, dormancy bursts and timing anomalies — Tango listens to the cadence of every transaction and flags the ones that lie.",
    stat: "Fan-out · dormancy · peel-chain",
    glyph: <TangoGlyph />,
  },
  {
    name: "PEDIGRID",
    tag: "Lineage tracing",
    body: "Traces the history of an address. N-hop lineage across known-bad wallets, weighted by distance and provenance — Pedigrid reconstructs the genealogy of risk, branch by branch, source by source.",
    stat: "Graph traversal · weighted distance",
    glyph: <PedigridGlyph />,
  },
];

export function ModulesGrid() {
  return (
    <section id="modules" className="border-b border-muted-line">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28">
        <Reveal>
          <h2
            className="font-display font-medium text-ink leading-[1.1] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}
          >
            Three modules. One verdict.
          </h2>
          <p className="text-ink-soft mt-4 text-[15px] md:text-[16px] leading-relaxed max-w-[60ch]">
            Each module contributes named, weighted signals to a single auditable risk score.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODULES.map((m) => (
            <article key={m.name} className="bg-surface border border-muted-line p-7 flex flex-col">
              {m.glyph}
              <div className="mt-6 flex items-baseline gap-3">
                <h3 className="font-display font-semibold text-ink text-[17px] tracking-[0.04em]">
                  {m.name}
                </h3>
                <span className="font-body text-[12px] text-cobalt font-medium">{m.tag}</span>
              </div>
              <p className="text-ink-soft mt-3 text-[14px] leading-relaxed flex-1">{m.body}</p>
              <div className="mt-6 pt-4 border-t border-muted-line font-body text-[12px] text-ink-soft">
                {m.stat}
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
