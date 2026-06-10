import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

const links = [
  { id: "atlas", label: "Atlas", href: "#atlas" },
  { id: "tango", label: "Tango", href: "#tango" },
  { id: "pedigrid", label: "Pedigrid", href: "#pedigrid" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scrollspy: highlight the module currently in the middle band of the viewport
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveId(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const l of links) {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base/60 border-b border-ink/10 shadow-[0_1px_0_rgba(14,14,14,0.04)]"
          : "bg-transparent border-b border-transparent"
      }`}
      style={
        scrolled
          ? {
              backdropFilter: "blur(16px) saturate(1.5)",
              WebkitBackdropFilter: "blur(16px) saturate(1.5)",
            }
          : undefined
      }
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-mono-ui lowercase text-ink font-medium text-base"
          style={{ letterSpacing: "0.18em" }}
        >
          00bit
        </a>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-7">
            {links.map((l) => (
              <a
                key={l.id}
                href={l.href}
                data-active={activeId === l.id}
                className={`link-rule font-mono-ui text-[11px] uppercase tracking-[0.24em] transition-colors ${
                  activeId === l.id ? "text-cobalt" : "text-ink-soft hover:text-cobalt"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
          <Link
            to="/access"
            className="font-mono-ui text-[11px] uppercase tracking-[0.24em] bg-cobalt text-white px-4 py-2.5 hover:-translate-y-px hover:bg-[var(--cobalt-press)] active:translate-y-0 transition-[transform,background-color] duration-200"
          >
            Request Access
          </Link>
        </div>
      </div>
    </nav>
  );
}
