import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "Product", href: "#product" },
  { label: "Modules", href: "#modules" },
  { label: "Demo", href: "#demo" },
  { label: "Methodology", href: "#methodology" },
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
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="font-mono-ui lowercase text-ink font-semibold text-[16px] tracking-[0.08em]">
            00bit
          </span>
          <span className="hidden sm:inline font-body text-[12px] font-medium text-ink-soft">
            / PreCog
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-rule font-body text-[13.5px] font-medium text-ink-soft hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden md:inline font-mono-ui text-[11.5px] tabular-nums text-ink-soft/70">
            {clock} UTC
          </span>
          <ThemeToggle />
          <Link
            to="/access"
            className="font-body text-[13px] font-semibold bg-cobalt text-white px-5 py-2.5 hover:bg-[var(--cobalt-press)] transition-colors"
          >
            Request access
          </Link>
        </div>
      </div>
    </nav>
  );
}
