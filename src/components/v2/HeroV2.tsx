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
          // 00bit / PreCog — blockchain intelligence
        </motion.div>

        <motion.h1
          {...rise(0.25)}
          className="font-display font-medium text-ink mt-8 leading-[1.02] tracking-[-0.03em]"
          style={{ fontSize: "clamp(42px, 6.5vw, 100px)" }}
        >
          <Scramble text="Detect the " delay={400} />
          <span className="text-cobalt">
            <Scramble text="signal" delay={700} />
          </span>
          <Scramble text="." delay={950} />
          <br />
          <Scramble text="Before the noise becomes the story." delay={1000} />
        </motion.h1>

        <motion.p
          {...rise(0.45)}
          className="text-ink-soft mt-9 text-[16px] md:text-[17px] leading-relaxed max-w-[54ch]"
        >
          PreCog is the blockchain intelligence layer for analysts who refuse to wait for the
          headline.
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
            See it in action ▸
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
            <span className="text-ink">&lt;3s</span> median score time
          </span>
          <span className="flex items-center gap-2">
            <span className="online-pulse inline-block w-1.5 h-1.5 bg-[var(--signal)]" />
            live signal channel · operational
          </span>
        </motion.div>
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 font-mono-ui text-[9px] uppercase tracking-[0.4em] text-ink-soft/50 select-none">
        scroll ▾
      </div>
    </section>
  );
}
