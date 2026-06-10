const STATS = [
  { value: "14,000,000+", label: "transactions scored" },
  { value: "6", label: "chains supported" },
  { value: "<3s", label: "median score time" },
];

/** Thin bordered band of headline numbers under the hero. */
export function StatBand() {
  return (
    <section className="border-b border-muted-line bg-surface">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="font-display font-medium text-ink text-[28px] md:text-[34px] leading-none tabular-nums">
              {s.value}
            </div>
            <div className="font-body text-[13px] text-ink-soft mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
