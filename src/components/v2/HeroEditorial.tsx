import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { NetworkCanvas } from "./NetworkCanvas";

export function HeroEditorial() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: reduce ? 0 : delay,
      duration: reduce ? 0 : 0.6,
      ease: "easeOut" as const,
    },
  });

  return (
    <section id="top" className="relative pt-32 pb-20 md:pb-28 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col">
          <motion.span
            {...rise(0.1)}
            className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-cobalt"
          >
            {"// 00bit / PreCog"}
          </motion.span>

          <motion.h1
            {...rise(0.2)}
            className="font-display text-ink mt-6 leading-[1.02] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(48px, 6.5vw, 92px)" }}
          >
            Detect the <em className="italic text-cobalt">signal</em>.
            <br />
            Before the noise becomes the story.
          </motion.h1>

          <motion.p
            {...rise(0.3)}
            className="font-body text-ink-soft mt-8 text-[17px] leading-relaxed max-w-[52ch]"
          >
            PreCog is the blockchain intelligence layer for analysts who refuse to wait for the
            headline.
          </motion.p>

          <motion.div {...rise(0.4)} className="mt-10 flex flex-wrap items-center gap-7">
            <Link
              to="/access"
              className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 py-3.5 hover:bg-[var(--cobalt-press)] transition-colors"
            >
              Request Access
            </Link>
            <a
              href="#demo"
              className="group font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink underline underline-offset-[6px] decoration-[1px] decoration-[color:var(--muted-line)] hover:text-cobalt hover:decoration-[color:var(--cobalt)] transition-colors"
            >
              See the demo{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-px">
                ↗
              </span>
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.5, duration: reduce ? 0 : 0.8 }}
          className="lg:col-span-5 relative aspect-square w-full bg-surface border border-muted-line"
        >
          <span className="absolute top-3 left-4 z-10 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
            ATLAS / live graph
          </span>
          <span className="absolute top-3 right-4 z-10 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft/70">
            Illustrative
          </span>
          <div className="absolute inset-0 pt-9 pb-4 px-4">
            <NetworkCanvas density={7000} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
