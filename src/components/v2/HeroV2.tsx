import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { NetworkCanvas } from "./NetworkCanvas";
import { Scramble } from "./Scramble";

export function HeroV2() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: reduce ? 0 : delay, duration: reduce ? 0 : 0.7, ease: "easeOut" as const },
  });

  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg"
    >
      {/* living transaction graph behind everything */}
      <div className="absolute inset-0 opacity-70">
        <NetworkCanvas density={9000} />
      </div>
      {/* radial vignette so type stays legible */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 38% 48%, rgba(var(--base-rgb),0.92) 0%, rgba(var(--base-rgb),0.55) 55%, rgba(var(--base-rgb),0.15) 100%)",
        }}
      />

      <div className="relative max-w-[1500px] mx-auto px-5 md:px-10 w-full pt-28 pb-24">
        <motion.div
          {...rise(0.1)}
          className="flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[0.32em] text-cobalt"
        >
          <span className="inline-block w-5 h-px bg-cobalt" />
          00bit // precog v2.0 — blockchain intelligence
        </motion.div>

        <motion.h1
          {...rise(0.25)}
          className="font-display font-bold text-ink mt-8 leading-[0.96] tracking-[-0.035em] uppercase"
          style={{ fontSize: "clamp(46px, 9vw, 140px)" }}
        >
          <Scramble text="See it before" delay={400} />
          <br />
          <span className="text-cobalt">
            <Scramble text="it happens." delay={900} />
          </span>
        </motion.h1>

        <motion.p
          {...rise(0.45)}
          className="text-ink-soft mt-9 text-[16px] md:text-[17px] leading-relaxed max-w-[54ch]"
        >
          PreCog watches every chain at once — scoring wallets, naming laundering patterns, and
          surfacing the evidence before the headline writes itself.
        </motion.p>

        <motion.div {...rise(0.6)} className="mt-11 flex flex-wrap items-center gap-5">
          <Link
            to="/access"
            className="font-mono-ui text-[11px] uppercase tracking-[0.28em] bg-cobalt text-white px-7 py-4 hover:bg-[var(--cobalt-press)] hover:-translate-y-px active:translate-y-0 transition-[transform,background-color] duration-200"
          >
            Request access
          </Link>
          <a
            href="#trace"
            className="hud-frame font-mono-ui text-[11px] uppercase tracking-[0.28em] text-ink border border-muted-line px-7 py-4 hover:text-cobalt hover:border-cobalt transition-colors"
          >
            Run a trace ▸
          </a>
        </motion.div>

        <motion.div
          {...rise(0.8)}
          className="mt-20 flex flex-wrap gap-x-12 gap-y-4 font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft"
        >
          <span>
            <span className="text-ink">14,000,000+</span> tx scored
          </span>
          <span>
            <span className="text-ink">6</span> chains live
          </span>
          <span>
            <span className="text-ink">&lt;3s</span> median verdict
          </span>
          <span className="flex items-center gap-2">
            <span className="online-pulse inline-block w-1.5 h-1.5 bg-[var(--signal)]" />
            signal channel operational
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono-ui text-[9px] uppercase tracking-[0.4em] text-ink-soft/50 select-none">
        scroll ▾
      </div>
    </section>
  );
}
