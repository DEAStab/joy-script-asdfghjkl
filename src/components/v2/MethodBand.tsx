import { Link } from "@tanstack/react-router";

export function MethodBand() {
  return (
    <section id="method" className="bg-band text-band-ink">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt-bright">
            {"// Method / Transparency"}
          </div>
          <h2
            className="font-display mt-4 leading-[1.05] [text-wrap:balance]"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            No black boxes. <em className="italic text-cobalt-bright">Ever.</em>
          </h2>
          <p className="font-body text-band-soft mt-8 max-w-[52ch] text-[16px] leading-relaxed">
            Every PreCog score is the weighted sum of named signals. Each signal returns its own
            sub-score, its own confidence band, and the evidence it relied on. If you cannot read
            why a wallet was flagged, we have failed.
          </p>
          <Link
            to="/access"
            className="group link-rule inline-block mt-12 font-mono-ui text-[11px] uppercase tracking-[0.28em] text-cobalt-bright hover:text-band-ink transition-colors"
          >
            Request the methodology{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-px">
              ↗
            </span>
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-band-panel border border-band-line p-6 md:p-8 font-mono-ui text-[12px] md:text-[13px] leading-[1.9] text-band-soft">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-band-line">
              <span className="text-[10px] uppercase tracking-[0.3em] text-band-soft">
                signal.output
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-cobalt-bright">
                ● verified
              </span>
            </div>
            <pre className="whitespace-pre overflow-x-auto">
              {`{
  `}
              <span className="text-cobalt-bright">"signal"</span>
              {`: `}
              <span className="text-band-ink">"known_bad_exposure"</span>
              {`,
  `}
              <span className="text-cobalt-bright">"score"</span>
              {`: `}
              <span className="text-band-ink">0.84</span>
              {`,
  `}
              <span className="text-cobalt-bright">"confidence"</span>
              {`: `}
              <span className="text-band-ink">"high"</span>
              {`,
  `}
              <span className="text-cobalt-bright">"evidence"</span>
              {`: {
    `}
              <span className="text-cobalt-bright">"hops"</span>
              {`: `}
              <span className="text-band-ink">2</span>
              {`,
    `}
              <span className="text-cobalt-bright">"flagged_address"</span>
              {`: `}
              <span className="text-band-ink">"1Kuf…rkVo"</span>
              {`,
    `}
              <span className="text-cobalt-bright">"source"</span>
              {`: `}
              <span className="text-band-ink">"OFAC SDN"</span>
              {`
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
