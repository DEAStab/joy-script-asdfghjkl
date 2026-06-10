import { useEffect, useRef } from "react";

type Node = { x: number; y: number; vx: number; vy: number; highlight?: boolean };

export function NodeGraph() {
  const ref = useRef<SVGSVGElement | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const W = 600,
      H = 600;
    const count = 18;
    const nodes: Node[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      highlight: i === 4,
    }));
    nodesRef.current = nodes;

    const svg = ref.current!;
    const linesGroup = svg.querySelector("#lines")!;
    const dotsGroup = svg.querySelector("#dots")!;

    // Initial dom
    dotsGroup.innerHTML = nodes
      .map(
        (n, i) =>
          `<circle data-i="${i}" cx="${n.x}" cy="${n.y}" r="${n.highlight ? 4.5 : 2}" fill="${
            n.highlight ? "#0047FF" : "#0E0E0E"
          }" />` +
          (n.highlight
            ? `<circle data-pulse cx="${n.x}" cy="${n.y}" r="10" fill="none" stroke="#0047FF" stroke-width="1" opacity="0.4" />`
            : ""),
      )
      .join("");

    const drawLines = () => {
      let lines = "";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 160) {
            const op = (1 - d / 160) * 0.5;
            const stroke = nodes[i].highlight || nodes[j].highlight ? "#0047FF" : "#0E0E0E";
            lines += `<line x1="${nodes[i].x}" y1="${nodes[i].y}" x2="${nodes[j].x}" y2="${nodes[j].y}" stroke="${stroke}" stroke-width="0.6" opacity="${op}" />`;
          }
        }
      }
      linesGroup.innerHTML = lines;
    };

    // reduced motion: render one static frame, no animation loop
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      drawLines();
      return;
    }

    let t = 0;
    const tick = () => {
      t += 0.016;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 20 || n.x > W - 20) n.vx *= -1;
        if (n.y < 20 || n.y > H - 20) n.vy *= -1;
      }
      // update dots
      const circles = dotsGroup.querySelectorAll("circle[data-i]");
      circles.forEach((c) => {
        const i = parseInt(c.getAttribute("data-i")!);
        c.setAttribute("cx", String(nodes[i].x));
        c.setAttribute("cy", String(nodes[i].y));
      });
      const pulse = dotsGroup.querySelector("[data-pulse]") as SVGCircleElement | null;
      if (pulse) {
        const hi = nodes.find((n) => n.highlight)!;
        pulse.setAttribute("cx", String(hi.x));
        pulse.setAttribute("cy", String(hi.y));
        const r = 8 + Math.sin(t * 2) * 6 + 6;
        pulse.setAttribute("r", String(r));
        pulse.setAttribute("opacity", String(0.5 - (r - 8) / 40));
      }
      drawLines();
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 600"
      className="w-full h-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="#C8C8C8"
            strokeWidth="0.3"
            opacity="0.4"
          />
        </pattern>
      </defs>
      <rect width="600" height="600" fill="url(#grid)" />
      <g id="lines" />
      <g id="dots" />
    </svg>
  );
}
