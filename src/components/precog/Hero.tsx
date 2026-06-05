import { motion } from "framer-motion";
import { NodeGraph } from "./NodeGraph";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.1, duration: 0.6, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section id="top" className="relative min-h-screen pt-24 pb-16 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center min-h-[calc(100vh-6rem)]">
        <div className="lg:col-span-7 flex flex-col">
          <motion.span
            custom={0}
            initial="hidden"
            animate="show"
            variants={fade}
            className="font-mono-ui text-[11px] tracking-[0.28em] text-cobalt uppercase"
          >
            // 00bit / PreCog v1.0
          </motion.span>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="show"
            variants={fade}
            className="font-display text-ink mt-6 leading-[1.02] tracking-[-0.02em]"
            style={{ fontSize: "clamp(52px, 7vw, 96px)" }}
          >
            Detect the <em className="italic text-cobalt">signal</em>.
            <br />
            Before the noise becomes the story.
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="show"
            variants={fade}
            className="font-body text-ink-soft mt-8 text-[17px] leading-relaxed max-w-[52ch]"
          >
            PreCog is the blockchain intelligence layer for analysts who refuse to wait for the headline.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <a
              href="/access"
              className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 py-3.5 hover:-translate-y-px transition-transform duration-200"
            >
              Request Access
            </a>
            <a
              href="docs/ALGORITHM.md"
              className="font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink underline decoration-cobalt decoration-1 underline-offset-[6px] hover:text-cobalt transition-colors"
            >
              Read the Algorithm ↗
            </a>
          </motion.div>

          <motion.div
            custom={4}
            initial="hidden"
            animate="show"
            variants={fade}
            className="mt-16 flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[0.3em] text-ink-soft"
          >
            <span className="block w-2 h-2 bg-cobalt" />
            Live signal channel · operational
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="lg:col-span-5 relative aspect-square w-full bg-surface border border-muted-line"
        >
          <div className="absolute inset-0 p-4">
            <div className="absolute top-3 left-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
              ATLAS / live graph
            </div>
            <div className="absolute top-3 right-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-cobalt">
              ● rec
            </div>
            <NodeGraph />
            <div className="absolute bottom-3 left-4 right-4 flex justify-between font-mono-ui text-[9px] uppercase tracking-[0.28em] text-ink-soft">
              <span>nodes: 18</span>
              <span>hops: 2</span>
              <span>chain: eth</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
