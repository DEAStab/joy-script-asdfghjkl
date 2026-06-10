import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#@$01";

/**
 * Decode effect: characters resolve left-to-right out of glyph noise.
 * Renders the final text immediately under prefers-reduced-motion.
 */
export function Scramble({
  text,
  className = "",
  delay = 0,
  speed = 28,
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  // Render the real text by default (SSR/no-JS safe); the decode only
  // ever replaces it with same-length glyph noise, so layout never shifts.
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let frame = 0;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame / 2);
        if (reveal >= text.length) {
          setOut(text);
          clearInterval(interval);
          return;
        }
        let s = text.slice(0, reveal);
        for (let i = reveal; i < text.length; i++) {
          s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setOut(s);
      }, speed);
    }, delay);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [text, delay, speed]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
