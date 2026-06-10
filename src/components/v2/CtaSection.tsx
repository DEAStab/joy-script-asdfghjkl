import { Link } from "@tanstack/react-router";

export function CtaSection() {
  return (
    <section id="request" className="relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-28 md:py-36 text-center">
        <div className="font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cobalt">
          05 — Request access
        </div>
        <Link to="/access" className="block mt-8 group" aria-label="Request access">
          <span
            className="inline-block font-display font-medium text-ink leading-[1.02] tracking-[-0.02em] group-hover:text-cobalt transition-colors duration-300"
            style={{ fontSize: "clamp(40px, 6vw, 84px)" }}
          >
            Request access
          </span>
        </Link>
        <p className="text-ink-soft mt-10 text-[15px] max-w-[44ch] mx-auto leading-relaxed">
          Tell us who you are and why you want access. We read every message.
        </p>
        <Link
          to="/access"
          className="inline-block mt-10 font-body text-[13px] font-semibold tracking-[0.02em] bg-cobalt text-white px-8 py-4 hover:bg-[var(--cobalt-press)] hover:-translate-y-px active:translate-y-0 transition-[transform,background-color] duration-200"
        >
          Send a message →
        </Link>
      </div>
    </section>
  );
}
