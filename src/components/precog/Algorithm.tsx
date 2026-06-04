export function Algorithm() {
  return (
    <section className="bg-[#0E0E0E] text-white" id="access">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6">
          <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
            // 04 / Transparency
          </div>
          <h2
            className="font-display mt-4 leading-[1.05]"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            No black boxes. <em className="italic text-cobalt">Ever.</em>
          </h2>
          <p className="font-body text-white/70 mt-8 max-w-[52ch] text-[16px] leading-relaxed">
            Every PreCog score is the weighted sum of named signals. Each signal returns its own
            sub-score, its own confidence band, and the evidence it relied on. If you cannot read
            why a wallet was flagged, we have failed.
          </p>
          <a
            href="docs/ALGORITHM.md"
            className="inline-block mt-12 font-mono-ui text-[11px] uppercase tracking-[0.28em] text-cobalt underline decoration-cobalt underline-offset-[6px] hover:text-white hover:decoration-white transition-colors"
          >
            Read ALGORITHM.md ↗
          </a>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-[#161616] border border-white/10 p-6 md:p-8 font-mono-ui text-[13px] leading-[1.9] text-white/80">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                signal.output
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-cobalt">● verified</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto">
{`{
  `}<span className="text-cobalt">"signal"</span>{`: `}<span className="text-white">"known_bad_exposure"</span>{`,
  `}<span className="text-cobalt">"score"</span>{`: `}<span className="text-white">0.84</span>{`,
  `}<span className="text-cobalt">"confidence"</span>{`: `}<span className="text-white">"high"</span>{`,
  `}<span className="text-cobalt">"evidence"</span>{`: {
    `}<span className="text-cobalt">"hops"</span>{`: `}<span className="text-white">2</span>{`,
    `}<span className="text-cobalt">"flagged_address"</span>{`: `}<span className="text-white">"1Kuf...rkVo"</span>{`,
    `}<span className="text-cobalt">"source"</span>{`: `}<span className="text-white">"OFAC SDN"</span>{`
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
