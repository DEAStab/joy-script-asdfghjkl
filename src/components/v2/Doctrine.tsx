import { Link } from "@tanstack/react-router";

export function Doctrine() {
  return (
    <section id="transparency" className="border-b border-muted-line">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6">
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt">
            // 04 / Transparency
          </div>
          <h2
            className="font-display font-medium text-ink mt-5 leading-[1.0] tracking-[-0.03em] [text-wrap:balance]"
            style={{ fontSize: "clamp(38px, 4.6vw, 72px)" }}
          >
            No black boxes. <span className="text-cobalt">Ever.</span>
          </h2>
          <p className="text-ink-soft mt-7 max-w-[50ch] text-[15px] leading-relaxed">
            Every PreCog score is the weighted sum of named signals. Each signal returns its own
            sub-score, its own confidence band, and the evidence it relied on. If you cannot read
            why a wallet was flagged, we have failed.
          </p>
          <Link
            to="/access"
            className="group link-rule inline-block mt-10 font-mono-ui text-[10px] uppercase tracking-[0.28em] text-cobalt hover:text-ink transition-colors"
          >
            Request the methodology{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="lg:col-span-6">
          <div className="hud-frame bg-surface border border-muted-line p-6 md:p-8 font-mono-ui text-[12px] md:text-[13px] leading-[2] text-ink-soft">
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-muted-line">
              <span className="text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                signal.output
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-signal">● verified</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto">
              {`{
  `}
              <span className="text-cobalt">"signal"</span>
              {`: `}
              <span className="text-ink">"known_bad_exposure"</span>
              {`,
  `}
              <span className="text-cobalt">"score"</span>
              {`: `}
              <span className="text-ink">0.84</span>
              {`,
  `}
              <span className="text-cobalt">"confidence"</span>
              {`: `}
              <span className="text-ink">"high"</span>
              {`,
  `}
              <span className="text-cobalt">"evidence"</span>
              {`: {
    `}
              <span className="text-cobalt">"hops"</span>
              {`: `}
              <span className="text-ink">2</span>
              {`,
    `}
              <span className="text-cobalt">"flagged_address"</span>
              {`: `}
              <span className="text-ink">"1Kuf…rkVo"</span>
              {`,
    `}
              <span className="text-cobalt">"source"</span>
              {`: `}
              <span className="text-ink">"OFAC SDN"</span>
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
