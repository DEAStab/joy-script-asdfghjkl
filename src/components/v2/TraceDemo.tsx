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

export function TraceDemo() {
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
    <section id="demo" className="border-y border-muted-line bg-panel-soft">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-28 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5">
          <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
            {"// 03 / A worked example"}
          </div>
          <h2
            className="font-display text-ink mt-4 leading-[1.05] [text-wrap:balance]"
            style={{ fontSize: "clamp(34px, 3.8vw, 56px)" }}
          >
            Run a trace, <em className="italic text-cobalt">step by step</em>.
          </h2>
          <p className="font-body text-ink-soft mt-6 text-[15px] leading-relaxed max-w-[44ch]">
            Enter any address — or run the example — and watch the engine narrate its own reasoning,
            signal by signal. Every real verdict ships with this level of explanation.
          </p>
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.26em] text-ink-soft/70 mt-8">
            Demo — illustrative output only
          </p>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-surface border border-muted-line">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run();
              }}
              className="flex border-b border-muted-line"
            >
              <span className="flex items-center pl-5 font-mono-ui text-[12px] text-cobalt select-none">
                ▸
              </span>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="0x84f3…c2e1 — paste an address or run the example"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none px-4 py-4 font-mono-ui text-[12px] md:text-[13px] text-ink placeholder:text-ink-soft/50"
                aria-label="Address to trace"
              />
              <button
                type="submit"
                disabled={phase === "running"}
                className="font-mono-ui text-[10px] uppercase tracking-[0.24em] bg-cobalt text-white px-6 hover:bg-[var(--cobalt-press)] transition-colors disabled:opacity-50"
              >
                {phase === "running" ? "Tracing…" : "Run trace"}
              </button>
            </form>

            <div className="px-5 md:px-6 py-5 font-mono-ui text-[11px] md:text-[12px] leading-[2.3] min-h-[240px]">
              {phase === "idle" && (
                <div className="text-ink-soft/70">
                  Enter an address to begin{" "}
                  <span className="caret-blink inline-block w-[7px] h-[12px] bg-cobalt align-middle" />
                </div>
              )}
              {phase !== "idle" && (
                <>
                  <div className="text-ink-soft/80">
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
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-ink-soft">
                      verdict
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-cobalt">
                      ● locked
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
                    <div>
                      <div
                        className="font-display text-threat leading-none"
                        style={{ fontSize: "clamp(44px, 5vw, 72px)" }}
                      >
                        91
                        <span className="text-ink-soft text-[0.35em] font-mono-ui tracking-[0.2em] pl-3">
                          / CRITICAL
                        </span>
                      </div>
                      <div className="mt-3 font-mono-ui text-[10px] uppercase tracking-[0.26em] text-ink-soft">
                        pattern: MIX_THEN_BRIDGE_v2
                      </div>
                    </div>
                    <Link
                      to="/access"
                      className="font-mono-ui text-[10px] uppercase tracking-[0.24em] bg-cobalt text-white px-5 py-3.5 hover:bg-[var(--cobalt-press)] transition-colors"
                    >
                      Request full report →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
