const modules = [
  {
    id: "atlas",
    name: "ATLAS",
    tag: "Exposure mapping",
    title: "Maps where the money has been.",
    body: "Atlas walks the multi-chain graph from a single address, scoring every connection by distance, volume and source confidence. Built for analysts who need to defend each conclusion.",
    stat: "Multi-chain · N-hop · Auditable",
  },
  {
    id: "tango",
    name: "TANGO",
    tag: "Pattern detection",
    title: "Reads the rhythm of the chain.",
    body: "Real-time detection of fan-out, peel-chain laundering, dormancy bursts and timing anomalies. Tango listens to the cadence of every transaction and flags the ones that lie.",
    stat: "Fan-out · Dormancy · Peel-chain",
  },
  {
    id: "pedigrid",
    name: "PEDIGRID",
    tag: "Lineage tracing",
    title: "Traces the bloodline of an address.",
    body: "N-hop lineage across known-bad wallets, weighted by distance and provenance. Pedigrid reconstructs the genealogy of risk — branch by branch, source by source.",
    stat: "Graph traversal · Weighted distance",
  },
];

export function ModulesEditorial() {
  return (
    <section id="modules" className="bg-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
          {"// 02 / Modules"}
        </div>
        <h2
          className="font-display text-ink mt-4 leading-[1.05] max-w-[20ch]"
          style={{ fontSize: "clamp(36px, 4.4vw, 60px)" }}
        >
          Three instruments. One <em className="italic text-cobalt">verdict</em>.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-20 border-t border-muted-line">
          {modules.map((m) => (
            <div
              key={m.id}
              id={m.id}
              className="group relative p-8 md:p-10 border-b md:border-b-0 md:border-r border-muted-line last:border-r-0 transition-colors duration-300 hover:bg-surface"
            >
              <div className="absolute left-0 top-0 bottom-0 w-px bg-cobalt scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
              <div className="font-mono-ui text-[11px] tracking-[0.3em] text-cobalt">{m.name}</div>
              <div className="font-mono-ui text-[10px] tracking-[0.28em] text-ink-soft mt-2 uppercase">
                {m.tag}
              </div>
              <h3
                className="font-display italic text-ink mt-8 leading-[1.1]"
                style={{ fontSize: "clamp(24px, 2vw, 30px)" }}
              >
                {m.title}
              </h3>
              <p className="font-body text-ink-soft mt-6 text-[15px] leading-relaxed">{m.body}</p>
              <div className="mt-10 pt-6 border-t border-muted-line font-mono-ui text-[10px] uppercase tracking-[0.24em] text-ink">
                {m.stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
