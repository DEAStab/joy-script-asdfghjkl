import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { label: "Modules", href: "#modules" },
  { label: "Demo", href: "#demo" },
  { label: "Method", href: "#method" },
];

export function NavV2() {
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
        scrolled ? "bg-base/85 border-muted-line" : "bg-transparent border-transparent"
      }`}
      style={
        scrolled
          ? {
              backdropFilter: "blur(12px) saturate(1.2)",
              WebkitBackdropFilter: "blur(12px) saturate(1.2)",
            }
          : undefined
      }
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">
        <a href="#top" className="flex items-baseline gap-2.5">
          <span className="font-mono-ui text-ink text-[14px] tracking-[0.18em]">
            <span className="zero-slashed">0</span>
            <span className="zero-slashed">0</span>bit
          </span>
          <span className="hidden sm:inline font-body italic text-[12px] text-ink-soft">
            / PreCog
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="link-rule font-mono-ui text-[11px] uppercase tracking-[0.18em] text-ink-soft hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/access"
            className="font-mono-ui text-[11px] uppercase tracking-[0.18em] bg-cobalt text-white px-5 py-2.5 hover:bg-[var(--cobalt-press)] transition-colors"
          >
            Request Access
          </Link>
        </div>
      </div>
    </nav>
  );
}
