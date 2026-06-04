import { useEffect, useState } from "react";

const links = [
  { label: "Atlas", href: "#atlas" },
  { label: "Tango", href: "#tango" },
  { label: "Pedigrid", href: "#pedigrid" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [woke, setWoke] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      if (y > 10) setWoke(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base/70 border-b border-muted-line"
          : "bg-transparent border-b border-transparent"
      }`}
      style={scrolled ? { backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" } : undefined}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          className={`font-mono-ui lowercase text-ink font-medium text-base ${woke ? "wordmark-awake" : "wordmark-breathe"}`}
          style={{ letterSpacing: "0.18em" }}
        >
          00bit
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono-ui text-[11px] uppercase tracking-[0.24em] text-ink-soft hover:text-cobalt transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
          <a
            href="#access"
            className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-4 py-2.5 hover:-translate-y-px transition-transform duration-200"
          >
            Request Access
          </a>
        </div>
      </div>
    </nav>
  );
}
