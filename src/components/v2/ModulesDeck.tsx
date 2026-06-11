import type { ReactNode } from "react";
import { NetworkCanvas } from "./NetworkCanvas";
import { TangoCanvas } from "./TangoCanvas";
import { PedigridCanvas } from "./PedigridCanvas";

const MODULES: {
  index: string;
  name: string;
  tag: string;
  title: string;
  body: string;
  stat: string;
  caption: string;
  viz: ReactNode;
}[] = [
  {
    index: "α",
    name: "ATLAS",
    tag: "Exposure mapping",
    title: "Maps where the money has been.",
    body: "Atlas walks the multi-chain graph from a single address, scoring every connection by distance, volume and source confidence. Built for analysts who need to defend each conclusion.",
    stat: "Multi-chain · n-hop · auditable",
    caption: "Live view",
    viz: <NetworkCanvas density={6500} />,
  },
  {
    index: "β",
    name: "TANGO",
    tag: "Pattern detection",
    title: "Reads the rhythm of the chain.",
    body: "Real-time detection of fan-out, peel-chain laundering, dormancy bursts and timing anomalies. Tango listens to the cadence of every transaction and flags the ones that lie.",
    stat: "Fan-out · dormancy · peel-chain",
    caption: "Live view",
    viz: <TangoCanvas />,
  },
  {
    index: "γ",
    name: "PEDIGRID",
    tag: "Lineage tracing",
    title: "Traces the bloodline of an address.",
    body: "N-hop lineage across known-bad wallets, weighted by distance and provenance. Pedigrid reconstructs the genealogy of risk — branch by branch, source by source.",
    stat: "Graph traversal · weighted distance",
    caption: "Example output",
    viz: <PedigridCanvas />,
  },
];

export function ModulesDeck() {
  return (
    <section id="modules">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-24 pb-8">
        <div className="font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cobalt">
          02 — Modules
        </div>
        <h2
          className="font-display font-medium text-ink mt-5 leading-[1.0] tracking-[-0.03em] [text-wrap:balance]"
          style={{ fontSize: "clamp(38px, 5vw, 80px)" }}
        >
          Three modules. One verdict.
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
                    <span className="font-body text-[12px] font-semibold tracking-[0.08em] text-cobalt">
                      {m.name}
                    </span>
                    <span className="font-body text-[12px] font-medium tracking-[0.02em] text-ink-soft">
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
                  <div className="mt-10 pt-5 border-t border-muted-line font-body text-[12px] font-medium tracking-[0.02em] text-ink-soft">
                    {m.stat}
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-surface border border-muted-line h-[280px] md:h-[360px] relative">
                    <span className="absolute top-2.5 right-3.5 z-10 font-body text-[12px] font-medium tracking-[0.02em] text-ink-soft">
                      {m.caption}
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
