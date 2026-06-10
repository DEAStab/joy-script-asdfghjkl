import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";

export function CtaBand() {
  return (
    <section className="border-b border-muted-line bg-surface">
      <Reveal className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-24 text-center">
        <h2
          className="font-display font-medium text-ink leading-[1.1] tracking-[-0.02em] [text-wrap:balance]"
          style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}
        >
          Ready to see it on your cases?
        </h2>
        <p className="text-ink-soft mt-5 text-[15px] md:text-[16px] max-w-[44ch] mx-auto leading-relaxed">
          Tell us who you are and why you want access. We read every message.
        </p>
        <Link
          to="/access"
          className="inline-block mt-8 font-body text-[14px] font-semibold bg-cobalt text-white px-7 py-3.5 hover:bg-[var(--cobalt-press)] transition-colors"
        >
          Request access
        </Link>
      </Reveal>
    </section>
  );
}
