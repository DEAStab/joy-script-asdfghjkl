import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Single, subtle entry animation used across the page: a short fade/rise on
 * first scroll into view. Renders static under prefers-reduced-motion.
 */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
