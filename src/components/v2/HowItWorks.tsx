import { Fragment, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@tanstack/react-router";

function IngestIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <rect x="6" y="8" width="36" height="9" />
      <rect x="6" y="19.5" width="36" height="9" />
      <rect x="6" y="31" width="36" height="9" />
      <line x1="13" y1="17" x2="13" y2="19.5" />
      <line x1="35" y1="17" x2="35" y2="19.5" />
      <line x1="13" y1="28.5" x2="13" y2="31" />
      <line x1="35" y1="28.5" x2="35" y2="31" />
    </svg>
  );
}

function ScoreIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M6 38 A18 18 0 0 1 42 38" />
      <line x1="6" y1="38" x2="11" y2="38" />
      <line x1="42" y1="38" x2="37" y2="38" />
      <line x1="24" y1="38" x2="33" y2="22" />
      <circle cx="24" cy="38" r="2.4" fill="currentColor" stroke="none" />
      <line x1="24" y1="20" x2="24" y2="24" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <path d="M12 6 H30 L36 12 V42 H12 Z" />
      <polyline points="30,6 30,12 36,12" />
      <line x1="17" y1="20" x2="31" y2="20" />
      <line x1="17" y1="26" x2="31" y2="26" />
      <polyline points="17,33 20,36 26,30" />
    </svg>
  );
}

type Step = { num: string; label: string; title: string; body: ReactNode; Icon: () => ReactNode };

const steps: Step[] = [
  {
    num: "01",
    label: "Ingest",
    title: "Every transaction, every indexed chain.",
    body: (
      <>
        We index and normalize activity across{" "}
        <span className="font-mono-ui text-ink">6 chains</span> in real time — addresses, transfers,
        and counterparties resolved into one consistent graph.
      </>
    ),
    Icon: IngestIcon,
  },
  {
    num: "02",
    label: "Score",
    title: "Named signals, each with its own evidence.",
    body: (
      <>
        <span className="font-mono-ui text-ink">Atlas</span>,{" "}
        <span className="font-mono-ui text-ink">Tango</span> and{" "}
        <span className="font-mono-ui text-ink">Pedigrid</span> each return a sub-score, a
        confidence band, and the exact evidence it relied on.
      </>
    ),
    Icon: ScoreIcon,
  },
  {
    num: "03",
    label: "Report",
    title: "A verdict an analyst can defend.",
    body: (
      <>
        A single weighted risk score arrives with the full reasoning attached — sources, weights,
        and signal contributions. No black boxes.
      </>
    ),
    Icon: ReportIcon,
  },
];

function Connector() {
  return (
    <div
      aria-hidden="true"
      className="relative flex items-center justify-center self-center w-full h-14 lg:w-16 lg:h-auto lg:self-stretch"
    >
      <div className="bg-muted-line w-px h-full lg:w-full lg:h-px" />
      <span className="absolute bg-base px-1.5 flex items-center text-ink-soft rotate-90 lg:rotate-0">
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        >
          <polyline points="4,2 10,7 4,12" />
        </svg>
      </span>
    </div>
  );
}

export function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="trace" className="border-y border-muted-line">
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 py-24">
        <div className="max-w-[760px]">
          <div className="font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-cobalt">
            03 — How it works
          </div>
          <h2
            className="font-display font-medium text-ink mt-5 leading-[1.05] tracking-[-0.03em] [text-wrap:balance]"
            style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
          >
            From raw chain data to a verdict you can defend.
          </h2>
          <p className="text-ink-soft mt-5 text-[17px] leading-relaxed max-w-[620px]">
            PreCog turns multi-chain activity into a scored, fully-sourced risk assessment — every
            figure traceable back to the evidence behind it.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 items-stretch lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
          {steps.map((s, i) => (
            <Fragment key={s.num}>
              <motion.article
                initial={{ opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -8% 0px" }}
                transition={{
                  duration: reduce ? 0 : 0.6,
                  delay: reduce ? 0 : i * 0.09,
                  ease: "easeOut",
                }}
                className="flex flex-col bg-surface border border-muted-line p-9 md:p-10 transition-[border-color,box-shadow] duration-200 hover:border-[var(--ink)] hover:shadow-[0_1px_0_0_var(--ink)]"
              >
                <div className="font-mono-ui text-[13px] font-medium tracking-[0.06em] text-cobalt mb-7">
                  {s.num}
                  <span className="text-ink-soft">&nbsp;&nbsp;/ {s.label.toUpperCase()}</span>
                </div>
                <div className="text-cobalt mb-7">
                  <s.Icon />
                </div>
                <h3 className="font-display font-medium text-ink text-[22px] leading-[1.2] tracking-[-0.01em] mb-3.5">
                  {s.title}
                </h3>
                <p className="text-ink-soft text-[15.5px] leading-relaxed">{s.body}</p>
              </motion.article>
              {i < steps.length - 1 && <Connector />}
            </Fragment>
          ))}
        </div>

        <div className="mt-12 pt-7 border-t border-muted-line flex flex-wrap items-center justify-between gap-6">
          <p className="font-mono-ui text-[12.5px] tracking-[0.04em] text-ink-soft">
            <span className="text-ink">Multi-chain</span>
            <span className="text-muted-line px-2">·</span>
            <span className="text-ink">N-hop</span>
            <span className="text-muted-line px-2">·</span>
            <span className="text-ink">Auditable</span>
            <span className="text-muted-line px-2">·</span>
            <span className="text-ink">No black boxes</span>
          </p>
          <Link
            to="/access"
            className="group font-body text-[15px] font-medium text-cobalt inline-flex items-center gap-2 border-b border-transparent hover:border-cobalt transition-colors"
          >
            Request access
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
