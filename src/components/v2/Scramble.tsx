import { useEffect, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#@$01";

/**
 * Decode effect: the text resolves out of random glyph noise, left to right.
 * The visible span starts empty and "loads in"; a visually-hidden copy carries
 * the real text for SEO and screen readers. Renders instantly (no scramble)
 * under prefers-reduced-motion.
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
  const [out, setOut] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    setOut("");
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
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  );
}
