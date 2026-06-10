const ITEMS = [
  ["ETH", "indexed"],
  ["BTC", "indexed"],
  ["SOL", "indexed"],
  ["TRON", "indexed"],
  ["BASE", "indexed"],
  ["ARB", "indexed"],
  ["TX SCORED", "14,000,000+"],
  ["MEDIAN SCORE TIME", "<3S"],
  ["SIGNALS", "NAMED & WEIGHTED"],
  ["BLACK BOXES", "ZERO"],
];

export function Ticker() {
  const row = (
    <div className="flex items-center shrink-0">
      {ITEMS.map(([k, v], i) => (
        <span
          key={i}
          className="flex items-baseline gap-2 px-8 font-mono-ui text-[10px] uppercase tracking-[0.26em] whitespace-nowrap"
        >
          <span className="text-ink-soft">{k}</span>
          <span className="text-cobalt">{v}</span>
          <span className="text-ink-soft/40 pl-8">///</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden border-y border-muted-line py-3 select-none" aria-hidden="true">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}
