import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

const STEPS = [
  { text: "resolving entity graph", result: "ok · 6 chains" },
  { text: "walking 3-hop neighborhood", result: "1,284 edges" },
  { text: "mixer adjacency check", result: "HIT · tornado.cash @ 2 hops", threat: true },
  { text: "temporal pattern scan", result: "fan-out burst · conf 0.92", threat: true },
  { text: "lineage trace", result: "flagged ancestor @ 3 hops", threat: true },
  { text: "compiling weighted verdict", result: "done" },
];

type Phase = "idle" | "running" | "done";

/**
 * The interactive trace panel: address input, streamed reasoning steps and a
 * final verdict card. Output is canned and illustrative; respects
 * prefers-reduced-motion by jumping straight to the result.
 */
export function TracePanel() {
  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (phase === "running") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStep(0);
    setPhase("running");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStep(STEPS.length);
      setPhase("done");
      return;
    }
    STEPS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setStep(i + 1), 550 * (i + 1)));
    });
    timers.current.push(setTimeout(() => setPhase("done"), 550 * (STEPS.length + 1)));
  };

  const subject = value.trim() || "0x84f3…c2e1";

  return (
    <div className="bg-surface border border-muted-line">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
        className="flex border-b border-muted-line"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Paste an address, or run the example: 0x84f3…c2e1"
          spellCheck={false}
          className="flex-1 bg-transparent outline-none px-5 py-4 font-mono-ui text-[12px] md:text-[13px] text-ink placeholder:text-ink-soft/40"
          aria-label="Address to trace"
        />
        <button
          type="submit"
          disabled={phase === "running"}
          className="font-body text-[13px] font-semibold bg-cobalt text-white px-6 hover:bg-[var(--cobalt-press)] transition-colors disabled:opacity-50"
        >
          {phase === "running" ? "Tracing…" : "Run trace"}
        </button>
      </form>

      <div className="px-5 md:px-6 py-5 font-mono-ui text-[11px] md:text-[12px] leading-[2.3] min-h-[240px]">
        {phase === "idle" && (
          <div className="text-ink-soft/60">
            Enter an address to begin{" "}
            <span className="caret-blink inline-block w-[7px] h-[12px] bg-cobalt align-middle" />
          </div>
        )}
        {phase !== "idle" && (
          <>
            <div className="text-ink-soft/60">
              Example trace · subject <span className="text-ink">{subject}</span>
            </div>
            {STEPS.slice(0, step).map((s, i) => (
              <div key={i} className="flex flex-wrap gap-x-3">
                <span className="text-cobalt">▸</span>
                <span className="text-ink-soft">{s.text}…</span>
                <span className={s.threat ? "text-threat" : "text-signal"}>{s.result}</span>
              </div>
            ))}
            {phase === "running" && (
              <span className="caret-blink inline-block w-[7px] h-[12px] bg-cobalt align-middle" />
            )}
          </>
        )}

        {phase === "done" && (
          <div className="panel-rise mt-5 border border-muted-line bg-base p-5 md:p-6">
            <div className="flex items-center justify-between font-body">
              <span className="text-[12px] font-medium text-ink-soft">Verdict</span>
              <span className="text-[12px] font-medium text-cobalt">Complete</span>
            </div>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div
                  className="font-display font-medium text-threat leading-none"
                  style={{ fontSize: "clamp(40px, 4.5vw, 64px)" }}
                >
                  91
                  <span className="text-ink-soft text-[0.32em] font-body font-medium pl-3">
                    / Critical
                  </span>
                </div>
                <div className="mt-3 font-body text-[13px] text-ink-soft">
                  Pattern: <span className="font-mono-ui text-[12px]">MIX_THEN_BRIDGE_v2</span>
                </div>
              </div>
              <Link
                to="/access"
                className="font-body text-[13px] font-semibold bg-cobalt text-white px-5 py-3 hover:bg-[var(--cobalt-press)] transition-colors"
              >
                Request full report →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
