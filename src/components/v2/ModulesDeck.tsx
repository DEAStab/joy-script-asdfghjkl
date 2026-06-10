import type { ReactNode } from "react";
import { NetworkCanvas } from "./NetworkCanvas";

function TangoViz() {
  // cadence waveform with one anomaly spike + scanning beam
  const pts: string[] = [];
  for (let x = 0; x <= 560; x += 8) {
    const base = 90 + Math.sin(x / 36) * 14 + Math.sin(x / 13) * 6;
    const spike = x > 330 && x < 360 ? -52 * Math.exp(-((x - 345) ** 2) / 120) : 0;
    pts.push(`${x},${(base + spike).toFixed(1)}`);
  }
  return (
    <svg
      viewBox="0 0 560 180"
      className="w-full h-full"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={pts.join(" ")} fill="none" stroke="var(--cobalt)" strokeWidth="1.4" />
      <circle cx="345" cy="44" r="4" fill="var(--threat)" />
      <circle
        cx="345"
        cy="44"
        r="10"
        fill="none"
        stroke="var(--threat)"
        strokeWidth="1"
        className="threat-ring"
      />
      <text x="358" y="40" fontSize="10" fill="var(--threat)" fontFamily="IBM Plex Mono, monospace">
        fan-out burst
      </text>
      <g className="scan-beam">
        <line x1="0" y1="0" x2="0" y2="180" stroke="rgba(77,125,255,0.5)" strokeWidth="1" />
      </g>
      <line x1="0" y1="160" x2="560" y2="160" stroke="rgba(232,236,244,0.15)" strokeWidth="0.5" />
      <text x="4" y="174" fontSize="9" fill="var(--ink-soft)" fontFamily="IBM Plex Mono, monospace">
        tx cadence · 24h window
      </text>
    </svg>
  );
}

function PedigridViz() {
  const nodes = [
    { x: 280, y: 24, hot: false }, // subject
    { x: 280, y: 78, hot: false },
    { x: 180, y: 122, hot: false },
    { x: 380, y: 122, hot: true },
    { x: 120, y: 166, hot: true },
    { x: 240, y: 166, hot: false },
    { x: 440, y: 166, hot: false },
  ];
  const edges = [
    [0, 1, false],
    [1, 2, false],
    [1, 3, true],
    [2, 4, true],
    [2, 5, false],
    [3, 6, false],
  ] as const;
  return (
    <svg viewBox="0 0 560 190" className="w-full h-full" aria-hidden="true">
      {edges.map(([a, b, hot], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={hot ? "var(--threat)" : "rgba(232,236,244,0.3)"}
          strokeWidth={hot ? 1.2 : 0.8}
          strokeDasharray={hot ? "none" : "3 3"}
        />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 5 : 3.5}
            fill={n.hot ? "var(--threat)" : i === 0 ? "var(--cobalt)" : "rgba(232,236,244,0.65)"}
          />
          {n.hot && (
            <circle
              cx={n.x}
              cy={n.y}
              r="9"
              fill="none"
              stroke="var(--threat)"
              strokeWidth="0.8"
              className="threat-ring"
            />
          )}
        </g>
      ))}
      <text
        x={nodes[0].x + 12}
        y={nodes[0].y + 4}
        fontSize="10"
        fill="var(--cobalt)"
        fontFamily="IBM Plex Mono, monospace"
      >
        subject
      </text>
      <text
        x={nodes[4].x - 18}
        y={nodes[4].y + 18}
        fontSize="9"
        fill="var(--threat)"
        fontFamily="IBM Plex Mono, monospace"
      >
        OFAC @ 3 hops
      </text>
    </svg>
  );
}

const MODULES: {
  index: string;
  name: string;
  tag: string;
  title: string;
  body: string;
  stat: string;
  viz: ReactNode;
}[] = [
  {
    index: "α",
    name: "ATLAS",
    tag: "exposure mapping",
    title: "Maps where the money has been.",
    body: "Atlas walks the multi-chain graph from a single address, scoring every connection by distance, volume and source confidence. Built for analysts who need to defend each conclusion.",
    stat: "multi-chain · n-hop · auditable",
    viz: <NetworkCanvas density={6500} />,
  },
  {
    index: "β",
    name: "TANGO",
    tag: "pattern detection",
    title: "Reads the rhythm of the chain.",
    body: "Real-time detection of fan-out, peel-chain laundering, dormancy bursts and timing anomalies. Tango listens to the cadence of every transaction and flags the ones that lie.",
    stat: "fan-out · dormancy · peel-chain",
    viz: <TangoViz />,
  },
  {
    index: "γ",
    name: "PEDIGRID",
    tag: "lineage tracing",
    title: "Traces the bloodline of an address.",
    body: "N-hop lineage across known-bad wallets, weighted by distance and provenance. Pedigrid reconstructs the genealogy of risk — branch by branch, source by source.",
    stat: "graph traversal · weighted distance",
    viz: <PedigridViz />,
  },
];

export function ModulesDeck() {
  return (
    <section id="modules">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-24 pb-8">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt">
          02 / instruments
        </div>
        <h2
          className="font-display font-medium text-ink mt-5 leading-[1.0] tracking-[-0.03em] [text-wrap:balance]"
          style={{ fontSize: "clamp(38px, 5vw, 80px)" }}
        >
          Three instruments. One verdict.
        </h2>
      </div>

      {/* sticky deck: each panel slides up and seals over the previous */}
      <div>
        {MODULES.map((m, i) => (
          <div
            key={m.name}
            id={m.name.toLowerCase()}
            className="sticky top-16"
            style={{ zIndex: i + 1 }}
          >
            <div className="bg-base border-t border-muted-line">
              <div className="max-w-[1500px] mx-auto px-5 md:px-10 min-h-[calc(100vh-4rem)] py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
                <span
                  aria-hidden="true"
                  className="absolute -top-10 right-0 font-display font-bold text-[34vw] lg:text-[24vw] leading-none text-ink/[0.04] select-none pointer-events-none"
                >
                  {m.index}
                </span>

                <div className="lg:col-span-6 relative">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono-ui text-[12px] tracking-[0.34em] text-cobalt">
                      {m.name}
                    </span>
                    <span className="font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                      {m.tag}
                    </span>
                  </div>
                  <h3
                    className="font-display font-medium text-ink mt-7 leading-[1.04] tracking-[-0.02em] [text-wrap:balance]"
                    style={{ fontSize: "clamp(30px, 3.4vw, 52px)" }}
                  >
                    {m.title}
                  </h3>
                  <p className="text-ink-soft mt-6 text-[15px] leading-relaxed max-w-[50ch]">
                    {m.body}
                  </p>
                  <div className="mt-10 pt-5 border-t border-muted-line font-mono-ui text-[10px] uppercase tracking-[0.26em] text-ink-soft">
                    {m.stat}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="hud-frame bg-surface border border-muted-line h-[280px] md:h-[360px] relative">
                    <span className="absolute top-2.5 left-3.5 z-10 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                      {m.name.toLowerCase()}.render
                    </span>
                    <span className="absolute top-2.5 right-3.5 z-10 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-cobalt">
                      ● rec
                    </span>
                    <div className="absolute inset-0 pt-8 pb-3 px-3">{m.viz}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
