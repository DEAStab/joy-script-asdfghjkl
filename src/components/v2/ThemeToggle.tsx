import { useEffect, useState } from "react";

type Theme = "dark" | "light";

const KEY = "precog-theme";

function SunIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path
        d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M19.4 4.6l-1.8 1.8M6.4 17.6l-1.8 1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Flips between the dark and light console themes. The active theme is set on
 * <html data-theme> (also pre-applied by the no-flash script in __root), saved
 * to localStorage, and broadcast via a "themechange" event so the canvas can
 * re-read its palette.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  // Light is the site default; dark is the theme you switch into.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — theme still applies for this session */
    }
    window.dispatchEvent(new Event("themechange"));
    setTheme(next);
    window.setTimeout(() => root.classList.remove("theme-transition"), 480);
  };

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
      aria-pressed={isLight}
      title={`Switch to ${isLight ? "dark" : "light"} theme`}
      className={`inline-flex items-center justify-center w-9 h-9 border border-muted-line text-ink-soft hover:text-cobalt hover:border-cobalt transition-colors ${className}`}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
