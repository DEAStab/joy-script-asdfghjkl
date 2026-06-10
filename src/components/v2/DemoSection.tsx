import { Reveal } from "./Reveal";
import { TracePanel } from "./TracePanel";

export function DemoSection() {
  return (
    <section id="demo" className="border-b border-muted-line bg-surface">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <Reveal className="lg:col-span-5">
          <h2
            className="font-display font-medium text-ink leading-[1.1] tracking-[-0.02em] [text-wrap:balance]"
            style={{ fontSize: "clamp(30px, 3.4vw, 44px)" }}
          >
            Run a trace, step by step.
          </h2>
          <p className="text-ink-soft mt-5 text-[15px] md:text-[16px] leading-relaxed max-w-[46ch]">
            Paste any address — or run the example — and watch the engine explain its reasoning,
            signal by signal. Every real verdict ships with this level of explanation.
          </p>
          <p className="font-body text-[12px] text-ink-soft/70 mt-6">
            Demo — illustrative output only
          </p>
        </Reveal>

        <Reveal className="lg:col-span-7">
          <TracePanel />
        </Reveal>
      </div>
    </section>
  );
}
