import { useEffect, useRef } from "react";

type Marker = { index: number; v: number; born: number; conf: string };

/**
 * Live transaction-cadence oscilloscope for the TANGO panel: a scrolling
 * signal trace with gradient fill and glowing head, an expected-cadence band,
 * and periodic fan-out bursts that break the band and get flagged in real
 * time with a pulsing marker and confidence readout. Theme-aware (re-reads
 * its palette on "themechange"), pauses offscreen, and renders a single
 * static frame under prefers-reduced-motion.
 */
export function TangoCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const STEP = 1.4; // px scrolled per sample
    const DT = 1 / 60; // signal seconds per sample
    const BAND = 0.62; // expected-band half-height in signal units

    let raf = 0;
    let visible = true;
    let W = 0;
    let H = 0;
    let capacity = 0;
    let samples: number[] = [];
    let markers: Marker[] = [];
    let t = 0; // signal time
    let now = 0; // animation clock (ring pulses)
    let scroll = 0; // total px scrolled (drives the grid)
    let nextBurst = 3;
    let burstCenter = -1;
    let burstMarked = true;
    let rate = 16;

    const palette = {
      cobalt: "#0b46e6",
      threat: "#d62828",
      ink: "#0b1120",
      inkSoft: "#3a4660",
      edge: "11,70,230",
    };
    const readPalette = () => {
      const cs = getComputedStyle(document.documentElement);
      const get = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
      palette.cobalt = get("--cobalt", palette.cobalt);
      palette.threat = get("--threat", palette.threat);
      palette.ink = get("--ink", palette.ink);
      palette.inkSoft = get("--ink-soft", palette.inkSoft);
      palette.edge = get("--net-edge", palette.edge).replace(/\s+/g, "");
    };
    readPalette();

    // calm multi-sine cadence with an occasional gaussian burst breaking upward
    const value = (tt: number) => {
      let v =
        Math.sin(tt * 0.9) * 0.34 +
        Math.sin(tt * 2.1 + 1.3) * 0.18 +
        Math.sin(tt * 4.6 + 0.4) * 0.07;
      if (burstCenter > 0) {
        const d = tt - burstCenter;
        v -= 1.6 * Math.exp(-(d * d) / 0.045);
      }
      return v;
    };

    const advance = () => {
      t += DT;
      now += DT;
      scroll += STEP;

      // schedule / retire bursts
      if (burstCenter < 0 && t >= nextBurst) {
        burstCenter = t + 0.35;
        burstMarked = false;
      }
      if (burstCenter > 0 && t > burstCenter + 0.9) {
        burstCenter = -1;
        nextBurst = t + 5 + Math.random() * 4;
      }

      const v = value(t);
      samples.push(v);
      if (samples.length > capacity) {
        samples.shift();
        for (const m of markers) m.index--;
        markers = markers.filter((m) => m.index > -10);
      }
      // flag the burst once, at its peak
      if (burstCenter > 0 && !burstMarked && t >= burstCenter) {
        burstMarked = true;
        markers.push({
          index: samples.length - 1,
          v,
          born: now,
          conf: (0.85 + Math.random() * 0.13).toFixed(2),
        });
      }
      rate += (16 + v * 4 + (Math.random() - 0.5) * 0.6 - rate) * 0.04;
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const midY = H * 0.52;
      const amp = H * 0.17;
      const bandTop = midY - BAND * amp;
      const bandBot = midY + BAND * amp;
      const headX = (samples.length - 1) * STEP;
      const latest = samples[samples.length - 1] ?? 0;

      // scrolling vertical grid + static horizontal rules
      ctx.lineWidth = 1;
      ctx.strokeStyle = palette.inkSoft;
      ctx.globalAlpha = 0.07;
      for (let x = -(scroll % 56); x < W; x += 56) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (const fy of [0.25, 0.5, 0.75]) {
        ctx.beginPath();
        ctx.moveTo(0, H * fy);
        ctx.lineTo(W, H * fy);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // expected-cadence band
      ctx.fillStyle = `rgba(${palette.edge},0.05)`;
      ctx.fillRect(0, bandTop, W, bandBot - bandTop);
      ctx.strokeStyle = `rgba(${palette.edge},0.28)`;
      ctx.setLineDash([3, 4]);
      for (const y of [bandTop, bandBot]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.font = '8px "IBM Plex Mono", monospace';
      ctx.fillStyle = palette.inkSoft;
      ctx.globalAlpha = 0.75;
      ctx.textAlign = "right";
      ctx.fillText("expected band", W - 8, bandTop - 5);
      ctx.textAlign = "left";
      ctx.globalAlpha = 1;

      if (samples.length > 1) {
        // gradient area fill under the trace
        const grad = ctx.createLinearGradient(0, midY - amp * 1.7, 0, H);
        grad.addColorStop(0, `rgba(${palette.edge},0.22)`);
        grad.addColorStop(1, `rgba(${palette.edge},0)`);
        ctx.beginPath();
        ctx.moveTo(0, midY + samples[0] * amp);
        for (let i = 1; i < samples.length; i++) ctx.lineTo(i * STEP, midY + samples[i] * amp);
        ctx.lineTo(headX, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        // the trace itself
        ctx.beginPath();
        ctx.moveTo(0, midY + samples[0] * amp);
        for (let i = 1; i < samples.length; i++) ctx.lineTo(i * STEP, midY + samples[i] * amp);
        ctx.strokeStyle = `rgba(${palette.edge},0.95)`;
        ctx.lineWidth = 1.6;
        ctx.lineJoin = "round";
        ctx.stroke();

        // glowing head
        const hy = midY + latest * amp;
        const glow = ctx.createRadialGradient(headX, hy, 0, headX, hy, 14);
        glow.addColorStop(0, `rgba(${palette.edge},0.4)`);
        glow.addColorStop(1, `rgba(${palette.edge},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(headX, hy, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = palette.cobalt;
        ctx.beginPath();
        ctx.arc(headX, hy, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // flagged bursts: pulsing marker + label that rides with the data
      for (const m of markers) {
        const x = m.index * STEP;
        if (x < -8 || x > W + 8) continue;
        const y = midY + m.v * amp;
        const fade = Math.min(1, Math.max(0, x / 70));
        const pulse = ((now - m.born) % 1.8) / 1.8;

        ctx.globalAlpha = fade * (1 - pulse) * 0.85;
        ctx.strokeStyle = palette.threat;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, 5 + pulse * 13, 0, Math.PI * 2);
        ctx.stroke();

        ctx.globalAlpha = fade;
        ctx.fillStyle = palette.threat;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
        // guideline up to the label
        const ly = Math.max(16, y - 26);
        ctx.strokeStyle = palette.threat;
        ctx.globalAlpha = fade * 0.45;
        ctx.beginPath();
        ctx.moveTo(x, y - 6);
        ctx.lineTo(x, ly + 4);
        ctx.stroke();
        ctx.globalAlpha = fade;
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        const label = "fan-out burst";
        const sub = `conf ${m.conf}`;
        const tx = Math.min(Math.max(6, x + 8), W - 96);
        ctx.fillText(label, tx, ly);
        ctx.font = '9px "IBM Plex Mono", monospace';
        ctx.globalAlpha = fade * 0.8;
        ctx.fillText(sub, tx, ly + 12);
        ctx.globalAlpha = 1;
      }

      // live readouts
      const dev = Math.abs(latest) / BAND;
      ctx.font = '9px "IBM Plex Mono", monospace';
      ctx.fillStyle = palette.inkSoft;
      ctx.fillText(`rate ${rate.toFixed(1)} tx/min`, 8, 14);
      ctx.fillStyle = dev > 1 ? palette.threat : palette.inkSoft;
      ctx.fillText(`deviation ${dev.toFixed(2)}σ`, 8, 26);

      // axis + caption
      ctx.strokeStyle = palette.inkSoft;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(0, H - 22);
      ctx.lineTo(W, H - 22);
      ctx.stroke();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = palette.inkSoft;
      ctx.fillText("tx cadence · live window", 8, H - 8);
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      if (!visible || document.hidden) {
        raf = 0;
        return;
      }
      advance();
      draw();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!raf && !reduce) raf = requestAnimationFrame(tick);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      capacity = Math.max(16, Math.ceil(W / STEP) + 2);
      // prefill so the trace is full-width (with at least one flagged burst)
      samples = [];
      markers = [];
      t = 0;
      scroll = 0;
      burstCenter = -1;
      burstMarked = true;
      nextBurst = capacity * DT * 0.45;
      for (let i = 0; i < capacity; i++) advance();
      draw();
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
      window.removeEventListener("themechange", onTheme);
    };
  }, []);

  return <canvas ref={canvasRef} className="block w-full h-full" aria-hidden="true" />;
}
