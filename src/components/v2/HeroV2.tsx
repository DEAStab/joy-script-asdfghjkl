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
    <section id="top" className="relative min-h-screen flex items-center overflow-hidden grid-bg">
      <div className="relative max-w-[1500px] mx-auto px-5 md:px-10 w-full pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* left column: message */}
        <div className="lg:col-span-7">
          <motion.div
            {...rise(0.1)}
            className="flex items-center gap-3 font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cobalt"
          >
            <span className="inline-block w-5 h-px bg-cobalt" />
            <span>
              <span className="font-mono-ui normal-case">00bit</span> / PreCog — Blockchain
              intelligence
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.25)}
            className="font-display font-medium text-ink mt-8 leading-[1.02] tracking-[-0.03em]"
            style={{ fontSize: "clamp(44px, 6.2vw, 96px)" }}
          >
            <Scramble text="See it before" delay={350} />
            <br />
            <span className="text-cobalt">
              <Scramble text="it happens." delay={750} />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.45)}
            className="text-ink-soft mt-8 text-[16px] md:text-[17px] leading-relaxed max-w-[52ch]"
          >
            PreCog watches every chain at once — scoring wallets, naming laundering patterns, and
            surfacing the evidence before the headline writes itself.
          </motion.p>

          <motion.div {...rise(0.6)} className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              to="/access"
              className="font-body text-[13px] font-semibold tracking-[0.02em] bg-cobalt text-white px-7 py-4 hover:bg-[var(--cobalt-press)] hover:-translate-y-px active:translate-y-0 transition-[transform,background-color] duration-200"
            >
              Request access
            </Link>
            <a
              href="#trace"
              className="font-body text-[13px] font-semibold tracking-[0.02em] text-ink border border-muted-line px-7 py-4 hover:text-cobalt hover:border-cobalt transition-colors"
            >
              See the demo
            </a>
          </motion.div>

          <motion.div
            {...rise(0.8)}
            className="mt-14 flex flex-wrap gap-x-12 gap-y-4 font-body text-[12.5px] font-medium tracking-[0.02em] text-ink-soft"
          >
            <span>
              <span className="text-ink tabular-nums">14,000,000+</span> transactions scored
            </span>
            <span>
              <span className="text-ink tabular-nums">6</span> chains live
            </span>
            <span>
              <span className="text-ink tabular-nums">&lt;3s</span> median verdict
            </span>
          </motion.div>
        </div>

        {/* right column: live transaction-graph panel */}
        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 0.8, ease: "easeOut" }}
          className="lg:col-span-5 relative w-full aspect-square lg:aspect-auto lg:h-[clamp(380px,46vw,560px)] bg-surface border border-muted-line"
        >
          <div className="absolute inset-0 p-4">
            <div className="absolute top-3 left-4 z-10 font-mono-ui text-[9px] uppercase tracking-[0.28em] text-ink-soft">
              ATLAS / live graph
            </div>
            <div className="absolute top-3 right-4 z-10 flex items-center gap-1.5 font-mono-ui text-[9px] uppercase tracking-[0.28em] text-cobalt">
              <span className="online-pulse inline-block w-1.5 h-1.5 rounded-full bg-cobalt" />
              live
            </div>
            <NetworkCanvas density={5200} />
            <div className="absolute bottom-3 left-4 right-4 z-10 flex justify-between font-mono-ui text-[9px] uppercase tracking-[0.26em] text-ink-soft">
              <span>nodes: 38</span>
              <span>hops: 2</span>
              <span>chain: eth</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-body text-[12px] tracking-[0.08em] text-ink-soft/60 select-none">
        Scroll
      </div>
    </section>
  );
}
