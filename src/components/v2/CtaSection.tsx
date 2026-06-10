import { Link } from "@tanstack/react-router";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-28 md:py-36 text-center">
        <div className="font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt">
          05 / clearance
        </div>
        <Link to="/access" className="block mt-8 group" aria-label="Request access">
          <span
            className="type-hollow relative inline-block font-display font-bold uppercase leading-[0.95] tracking-[-0.02em] select-none"
            style={{ fontSize: "clamp(44px, 9.5vw, 150px)" }}
          >
            Request
            <br />
            Access
            <span className="type-fill" aria-hidden="true">
              Request
              <br />
              Access
            </span>
          </span>
        </Link>
        <p className="text-ink-soft mt-10 text-[15px] max-w-[44ch] mx-auto leading-relaxed">
          Access is granted per desk, not per seat. Tell us what you investigate — a human reads
          every request.
        </p>
        <Link
          to="/access"
          className="inline-block mt-10 font-mono-ui text-[11px] uppercase tracking-[0.28em] bg-cobalt text-white px-8 py-4 hover:bg-[var(--cobalt-press)] hover:-translate-y-px active:translate-y-0 transition-[transform,background-color] duration-200"
        >
          Open a channel →
        </Link>
      </div>
    </section>
  );
}
