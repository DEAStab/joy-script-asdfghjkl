import { Link } from "@tanstack/react-router";

export function CtaSection() {
  return (
    <section className="bg-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 md:py-36 text-center">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
          {"// 04 / Request access"}
        </div>
        <h2
          className="font-display text-ink mt-6 leading-[1.05] [text-wrap:balance] mx-auto max-w-[18ch]"
          style={{ fontSize: "clamp(38px, 5.5vw, 80px)" }}
        >
          Tell us what you're <em className="italic text-cobalt">investigating</em>.
        </h2>
        <p className="font-body italic text-ink-soft mt-8 text-[16px] leading-relaxed max-w-[44ch] mx-auto">
          We read every message.
        </p>
        <Link
          to="/access"
          className="inline-block mt-10 font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-8 py-4 hover:bg-[var(--cobalt-press)] transition-colors"
        >
          Request Access
        </Link>
      </div>
    </section>
  );
}
