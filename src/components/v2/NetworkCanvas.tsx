import { useEffect, useRef } from "react";

type N = { x: number; y: number; vx: number; vy: number; r: number; hot: boolean };
type Pulse = { a: number; b: number; t: number; speed: number };

/**
 * Living transaction graph: drifting nodes, proximity edges, cobalt pulses
 * travelling along them, gentle attraction toward the pointer. Pauses when
 * offscreen or the tab is hidden; renders a single static frame under
 * prefers-reduced-motion.
 */
export function NetworkCanvas({
  density = 11000,
  className = "",
}: {
  density?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let nodes: N[] = [];
    let pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999 };
    const EDGE = 150;

    // palette read from the active theme (comma rgb triplets)
    const palette = {
      edge: "77,125,255",
      edgeThreat: "255,92,92",
      node: "190,205,235",
      nodeThreat: "255,92,92",
      pulse: "141,175,255",
    };
    const readPalette = () => {
      const cs = getComputedStyle(document.documentElement);
      const get = (name: string, fallback: string) =>
        cs.getPropertyValue(name).trim().replace(/\s+/g, "") || fallback;
      palette.edge = get("--net-edge", palette.edge);
      palette.edgeThreat = get("--net-edge-threat", palette.edgeThreat);
      palette.node = get("--net-node", palette.node);
      palette.nodeThreat = get("--net-node-threat", palette.nodeThreat);
      palette.pulse = get("--net-pulse", palette.pulse);
    };
    readPalette();

    const seed = () => {
      const count = Math.max(24, Math.min(140, Math.floor((W * H) / density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() < 0.08 ? 2.4 : 1.2,
        hot: Math.random() < 0.05,
      }));
      pulses = [];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduce) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < EDGE) {
            const a = (1 - d / EDGE) * 0.28;
            ctx.strokeStyle =
              nodes[i].hot || nodes[j].hot
                ? `rgba(${palette.edgeThreat},${a * 0.9})`
                : `rgba(${palette.edge},${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // pulses
      ctx.fillStyle = `rgba(${palette.pulse},0.95)`;
      for (const p of pulses) {
        const a = nodes[p.a];
        const b = nodes[p.b];
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      // nodes
      for (const n of nodes) {
        ctx.fillStyle = n.hot ? `rgba(${palette.nodeThreat},0.9)` : `rgba(${palette.node},0.8)`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let lastPulse = 0;
    const tick = (now: number) => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      for (const n of nodes) {
        // faint pull toward the pointer
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.hypot(dx, dy);
        if (d < 220 && d > 1) {
          n.vx += (dx / d) * 0.004;
          n.vy += (dy / d) * 0.004;
        }
        n.vx = Math.max(-0.35, Math.min(0.35, n.vx));
        n.vy = Math.max(-0.35, Math.min(0.35, n.vy));
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      }
      // spawn a pulse along a random short edge
      if (now - lastPulse > 420 && nodes.length > 2) {
        lastPulse = now;
        for (let attempt = 0; attempt < 8; attempt++) {
          const a = Math.floor(Math.random() * nodes.length);
          const b = Math.floor(Math.random() * nodes.length);
          if (a !== b && Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y) < EDGE) {
            pulses.push({ a, b, t: 0, speed: 0.012 + Math.random() * 0.014 });
            break;
          }
        }
      }
      pulses = pulses.filter((p) => (p.t += p.speed) < 1);
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pointermove", onMove, { passive: true });
    // re-read colors and repaint immediately when the theme flips
    const onTheme = () => {
      readPalette();
      draw();
    };
    window.addEventListener("themechange", onTheme);

    resize();
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("themechange", onTheme);
    };
  }, [density]);

  return (
    <canvas ref={canvasRef} className={`block w-full h-full ${className}`} aria-hidden="true" />
  );
}
