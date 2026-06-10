import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function Methodology() {
  return (
    <section id="methodology" className="border-b border-muted-line">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <Reveal className="lg:col-span-6">
          <h2
            className="font-display font-medium text-ink leading-[1.1] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}
          >
            No black boxes. <span className="text-cobalt">Ever.</span>
          </h2>
          <p className="text-ink-soft mt-6 max-w-[50ch] text-[15px] md:text-[16px] leading-relaxed">
            Every PreCog score is the weighted sum of named signals. Each signal returns its own
            sub-score, its own confidence band, and the evidence it relied on. If you cannot read
            why a wallet was flagged, we have failed.
          </p>
          <Link
            to="/access"
            className="link-rule inline-block mt-8 font-body text-[14px] font-medium text-cobalt hover:text-ink transition-colors"
          >
            Request the methodology →
          </Link>
        </Reveal>

        <Reveal className="lg:col-span-6">
          <div className="bg-surface border border-muted-line">
            <div className="flex items-center justify-between px-4 py-3 border-b border-muted-line">
              <span className="font-body text-[12px] font-medium text-ink-soft">Signal output</span>
              <span className="font-body text-[11px] text-signal">Verified</span>
            </div>
            <pre className="whitespace-pre overflow-x-auto p-6 md:p-8 font-mono-ui text-[12px] md:text-[13px] leading-[2] text-ink-soft">
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
        </Reveal>
      </div>
    </section>
  );
}
