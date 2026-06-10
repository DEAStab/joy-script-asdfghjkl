export function Footer() {
  return (
    <footer className="bg-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="font-mono-ui text-[11px] uppercase tracking-[0.32em] text-ink">00bit</div>
          <div className="font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft mt-6">
            © 2025 00bit. All rights reserved.
          </div>
          <div className="font-body italic text-ink-soft mt-4 text-[13px] max-w-[40ch]">
            Operated quietly. Audited openly.
          </div>
        </div>
        <div className="flex md:justify-end">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3">
            {["Algorithm", "Extending", "GitHub", "Contact"].map((l) => (
              <li key={l}>
                <a
                  href="/access"
                  className="font-mono-ui text-[11px] uppercase tracking-[0.28em] text-ink hover:text-cobalt transition-colors"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>

        </div>
      </div>
      <div className="h-px bg-cobalt w-full" />
    </footer>
  );
}
