import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "Feed", href: "#feed" },
  { label: "Modules", href: "#modules" },
  { label: "Trace", href: "#trace" },
  { label: "Doctrine", href: "#doctrine" },
];

function useUtcClock() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setNow(`${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`);
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function NavV2() {
  const clock = useUtcClock();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 border-b ${
        scrolled ? "bg-base/70 border-muted-line" : "bg-transparent border-transparent"
      }`}
      style={
        scrolled
          ? {
              backdropFilter: "blur(14px) saturate(1.4)",
              WebkitBackdropFilter: "blur(14px) saturate(1.4)",
            }
          : undefined
      }
    >
      <div className="max-w-[1500px] mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="font-mono-ui lowercase text-ink font-medium text-[15px] tracking-[0.18em]">
            00bit
          </span>
          <span className="hidden sm:inline font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
            / precog v2
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-rule font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:flex items-center gap-2 font-mono-ui text-[10px] tracking-[0.2em] text-ink-soft tabular-nums">
            <span className="online-pulse inline-block w-1.5 h-1.5 bg-[var(--signal)]" />
            SYS:ONLINE · {clock} UTC
          </span>
          <ThemeToggle />
          <Link
            to="/access"
            className="hud-frame font-mono-ui text-[10px] uppercase tracking-[0.28em] text-ink border border-muted-line px-4 py-2.5 hover:border-cobalt hover:text-cobalt transition-colors"
          >
            Initiate access
          </Link>
        </div>
      </div>
    </nav>
  );
}
