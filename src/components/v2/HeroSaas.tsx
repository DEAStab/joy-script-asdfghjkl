import { Link } from "@tanstack/react-router";
import { TangoCanvas } from "./TangoCanvas";
import { Reveal } from "./Reveal";

/**
 * Contained two-column hero: plain typographic pitch on the left, the live
 * TANGO visualization in a bordered card on the right. No full-bleed canvas.
 */
export function HeroSaas() {
  return (
    <section id="product" className="border-b border-muted-line">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 pt-32 pb-20 md:pt-40 md:pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <Reveal className="lg:col-span-6">
          <p className="font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-cobalt">
            PreCog by 00bit
          </p>
          <h1
            className="font-display font-medium text-ink mt-5 leading-[1.05] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(40px, 5vw, 72px)" }}
          >
            Blockchain intelligence that shows its work.
          </h1>
          <p className="text-ink-soft mt-6 text-[16px] md:text-[17px] leading-relaxed max-w-[54ch]">
            PreCog scores wallet risk across six chains in real time — every verdict built from
            named signals and auditable evidence. No black boxes.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link
              to="/access"
              className="font-body text-[14px] font-semibold bg-cobalt text-white px-6 py-3.5 hover:bg-[var(--cobalt-press)] transition-colors"
            >
              Request access
            </Link>
            <a
              href="#demo"
              className="link-rule font-body text-[14px] font-medium text-ink hover:text-cobalt transition-colors"
            >
              See the demo →
            </a>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-6">
          <div className="bg-surface border border-muted-line">
            <div className="flex items-center justify-between px-4 py-3 border-b border-muted-line">
              <span className="font-body text-[12px] font-medium text-ink-soft">
                TANGO — live pattern detection
              </span>
              <span className="font-body text-[11px] text-ink-soft/70">Illustrative</span>
            </div>
            <div className="h-[280px] md:h-[340px]">
              <TangoCanvas />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
