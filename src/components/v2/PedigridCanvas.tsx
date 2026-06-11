import { useEffect, useRef } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

type PNode = {
  id: string;
  x: number;
  y: number;
  hop: number;
  r: number;
  subject?: boolean;
  bad?: boolean;
  parent?: string;
  label?: string;
  chip?: string;
  flag?: string;
  flagSub?: string;
  onBad?: boolean;
  dom?: SVGGElement;
  labelDom?: SVGGElement;
  ring?: SVGCircleElement;
};

type PEdge = {
  from: PNode;
  to: PNode;
  w: number;
  alpha: number;
  bad: boolean;
  hop: number;
  child: PNode;
  node?: SVGPathElement;
  len?: number;
  scan?: SVGCircleElement;
  scanCore?: SVGCircleElement;
};

/**
 * PEDIGRID lineage trace: a genealogy that reconstructs itself outward from the
 * subject over ~5.5s, the flagged path peeling off as an upward side branch and
 * lighting red as ancestors are reached, then holds and loops. Colours come from
 * theme CSS variables (works in light + dark, no rebuild on flip); pauses
 * offscreen; renders a clean static final frame under prefers-reduced-motion.
 */
export function PedigridCanvas() {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function el<K extends keyof SVGElementTagNameMap>(
      tag: K,
      attrs?: Record<string, string | number>,
    ): SVGElementTagNameMap[K] {
      const e = document.createElementNS(SVG_NS, tag);
      if (attrs) for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      return e;
    }

    // ---- genealogy layout (subject right; flagged chain peels upward) ----
    const SUBJ: PNode = {
      id: "s",
      x: 690,
      y: 214,
      hop: 0,
      r: 9,
      subject: true,
      label: "SUBJECT",
      chip: "0x84f3…c2e1",
    };
    const NODES: PNode[] = [
      SUBJ,
      { id: "a1", x: 524, y: 214, hop: 1, r: 6.5, parent: "s" },
      { id: "a2", x: 540, y: 126, hop: 1, r: 6.5, parent: "s", bad: true, chip: "bc1q…m2v8" },
      { id: "a3", x: 524, y: 300, hop: 1, r: 6.5, parent: "s" },
      { id: "b1", x: 348, y: 178, hop: 2, r: 5.5, parent: "a1" },
      { id: "b2", x: 348, y: 244, hop: 2, r: 5.5, parent: "a1" },
      {
        id: "b3",
        x: 384,
        y: 80,
        hop: 2,
        r: 5.5,
        parent: "a2",
        bad: true,
        flag: "Tornado Cash",
        flagSub: "mixer · @ 2 hops",
      },
      { id: "b4", x: 348, y: 312, hop: 2, r: 5.5, parent: "a3" },
      { id: "b5", x: 348, y: 356, hop: 2, r: 5.5, parent: "a3" },
      { id: "c1", x: 166, y: 250, hop: 3, r: 4.5, parent: "b2" },
      {
        id: "c2",
        x: 214,
        y: 58,
        hop: 3,
        r: 4.5,
        parent: "b3",
        bad: true,
        flag: "OFAC SDN",
        flagSub: "flagged · @ 3 hops",
      },
      { id: "c3", x: 166, y: 330, hop: 3, r: 4.5, parent: "b4" },
    ];

    const byId: Record<string, PNode> = {};
    NODES.forEach((n) => (byId[n.id] = n));
    NODES.forEach((n) => {
      if (n.bad && n.hop === 3) {
        let cur: PNode | undefined = n;
        while (cur) {
          cur.onBad = true;
          cur = cur.parent ? byId[cur.parent] : undefined;
        }
      }
    });

    const EDGES: PEdge[] = [];
    NODES.forEach((n) => {
      if (!n.parent) return;
      const p = byId[n.parent];
      const w = [0, 3.2, 2.1, 1.3][n.hop] || 1.1;
      const alpha = [0, 0.95, 0.55, 0.32][n.hop] || 0.28;
      const bad = !!(n.onBad && p.onBad);
      EDGES.push({ from: p, to: n, w, alpha, bad, hop: n.hop, child: n });
    });
    EDGES.sort((a, b) => a.hop - b.hop);

    const curvePath = (p: PNode, c: PNode) => {
      const mx = (p.x + c.x) / 2;
      return `M${p.x} ${p.y} C ${mx} ${p.y} ${mx} ${c.y} ${c.x} ${c.y}`;
    };

    // ---- build ----
    const gGrid = el("g");
    for (let gx = 0; gx <= 820; gx += 56)
      gGrid.appendChild(
        el("line", {
          x1: gx,
          y1: 0,
          x2: gx,
          y2: 400,
          class: "pg-grid",
          "stroke-width": 1,
          opacity: 0.05,
        }),
      );
    for (let gy = 0; gy <= 400; gy += 56)
      gGrid.appendChild(
        el("line", {
          x1: 0,
          y1: gy,
          x2: 820,
          y2: gy,
          class: "pg-grid",
          "stroke-width": 1,
          opacity: 0.05,
        }),
      );
    svg.appendChild(gGrid);

    const gEdges = el("g");
    const gScan = el("g");
    const gPulse = el("g");
    const gNodes = el("g");
    const gLabels = el("g");
    [gEdges, gScan, gPulse, gNodes, gLabels].forEach((g) => svg.appendChild(g));

    EDGES.forEach((e) => {
      const path = el("path", {
        d: curvePath(e.from, e.to),
        class: "pg-edge" + (e.bad ? " bad" : ""),
        "stroke-width": e.w,
        opacity: e.bad ? 0.92 : e.alpha,
      });
      e.node = path;
      gEdges.appendChild(path);
      e.len = path.getTotalLength();
      path.style.strokeDasharray = String(e.len);
      path.style.strokeDashoffset = String(e.len);

      e.scan = el("circle", {
        r: e.bad ? 7 : 6,
        class: "pg-scan" + (e.bad ? " bad" : ""),
        opacity: 0,
      });
      e.scanCore = el("circle", { r: 2.2, class: "pg-scan" + (e.bad ? " bad" : ""), opacity: 0 });
      gScan.appendChild(e.scan);
      gScan.appendChild(e.scanCore);
    });

    NODES.forEach((n) => {
      const g = el("g", { transform: `translate(${n.x},${n.y})`, opacity: 0 });
      n.dom = g;
      if (n.subject) {
        g.appendChild(
          el("circle", { r: n.r + 7, class: "pg-node-ring", "stroke-width": 1, opacity: 0.35 }),
        );
        g.appendChild(el("circle", { r: n.r, class: "pg-node-core" }));
        g.appendChild(el("circle", { r: n.r - 3, class: "pg-node-hole" }));
        g.appendChild(el("circle", { r: 2, class: "pg-node-core" }));
      } else if (n.bad) {
        const ring = el("circle", {
          r: n.r + 5,
          class: "pg-bad-ring",
          "stroke-width": 1.2,
          opacity: 0,
        });
        n.ring = ring;
        g.appendChild(ring);
        g.appendChild(el("circle", { r: n.r, class: "pg-bad-stroke", "stroke-width": 1.6 }));
        g.appendChild(el("circle", { r: n.r - 2.5, class: "pg-bad-core" }));
      } else {
        const op = [1, 1, 0.7, 0.5][n.hop] || 0.5;
        g.appendChild(
          el("circle", { r: n.r, class: "pg-neutral-stroke", "stroke-width": 1.3, opacity: op }),
        );
        g.appendChild(
          el("circle", { r: Math.max(1.6, n.r - 3), class: "pg-node-core", opacity: op }),
        );
      }
      gNodes.appendChild(g);
    });

    NODES.forEach((n) => {
      const lg = el("g", { opacity: 0 });
      n.labelDom = lg;
      if (n.subject) {
        const t = el("text", { x: n.x + n.r + 12, y: n.y - 4, class: "pg-subj" });
        t.textContent = n.label || "";
        lg.appendChild(t);
      } else {
        if (n.hop >= 1 && !n.flag) {
          const ht = el("text", {
            x: n.x,
            y: n.y - n.r - 8,
            class: "pg-hop",
            "text-anchor": "middle",
          });
          ht.textContent = n.hop + (n.hop === 1 ? " HOP" : " HOPS");
          lg.appendChild(ht);
        }
        if (n.flag) {
          const lx = n.x - n.r - 8;
          const fl = el("text", { x: lx, y: n.y - 3, class: "pg-flag", "text-anchor": "end" });
          fl.textContent = n.flag;
          lg.appendChild(fl);
          const fs = el("text", { x: lx, y: n.y + 9, class: "pg-flagsub", "text-anchor": "end" });
          fs.textContent = n.flagSub || "";
          lg.appendChild(fs);
        }
      }
      gLabels.appendChild(lg);
    });

    const CHIPS: { dom: SVGGElement; node: PNode }[] = [];
    NODES.forEach((n) => {
      if (!n.chip) return;
      const below = n.subject ? n.y + n.r + 24 : n.y + n.r + 16;
      const cw = n.chip.length * 5.0 + 14;
      const cx = n.subject ? n.x + n.r + 12 + cw / 2 : n.x;
      const cg = el("g", { opacity: 0 });
      cg.appendChild(
        el("rect", { x: cx - cw / 2, y: below - 9, width: cw, height: 14, class: "pg-chip-bg" }),
      );
      const tx = el("text", { x: cx, y: below + 1, class: "pg-chip-tx", "text-anchor": "middle" });
      tx.textContent = n.chip;
      cg.appendChild(tx);
      gLabels.appendChild(cg);
      CHIPS.push({ dom: cg, node: n });
    });

    // risk readout (svg text, bottom-left of the viewBox)
    const rk = el("text", { x: 16, y: 368, class: "pg-rk" });
    rk.textContent = "LINEAGE RISK";
    const rvWrap = el("text", { x: 16, y: 387 });
    const rvNum = el("tspan", { class: "pg-rv-num" });
    const rvTxt = el("tspan", { class: "pg-rv-txt", dx: 6 });
    rvWrap.appendChild(rvNum);
    rvWrap.appendChild(rvTxt);
    svg.appendChild(rk);
    svg.appendChild(rvWrap);

    const pulseGlow = el("circle", { r: 6, class: "pg-pulse", opacity: 0 });
    const pulseDot = el("circle", { r: 2.6, class: "pg-pulse", opacity: 0 });
    gPulse.appendChild(pulseGlow);
    gPulse.appendChild(pulseDot);

    // ---- animation engine ----
    const SUBJ_IN = 520;
    const HOP_DRAW = 1180;
    const HOP_GAP = 160;
    const HOLD = 1800;
    const FADEOUT = 820;

    const hopEdges: Record<number, PEdge[]> = { 1: [], 2: [], 3: [] };
    EDGES.forEach((e) => hopEdges[e.hop].push(e));
    const hopStart: Record<number, number> = {};
    let tcur = SUBJ_IN;
    [1, 2, 3].forEach((hop) => {
      hopStart[hop] = tcur;
      tcur += HOP_DRAW + HOP_GAP;
    });
    const DRAW_END = SUBJ_IN + 3 * HOP_DRAW + 2 * HOP_GAP;
    const CYCLE = DRAW_END + HOLD + FADEOUT;

    const badSeq = EDGES.filter((e) => e.bad).sort((a, b) => b.hop - a.hop);

    const ss = (x: number) => {
      x = Math.max(0, Math.min(1, x));
      return x * x * (3 - 2 * x);
    };
    const pop = (x: number) => {
      x = Math.max(0, Math.min(1, x));
      const c = 1.70158;
      const t = x - 1;
      return 1 + t * t * ((c + 1) * t + c);
    };
    const setEdge = (e: PEdge, p: number) => {
      e.node!.style.strokeDashoffset = String(e.len! * (1 - p));
    };
    const nodeOp = (n: PNode, o: number) => {
      n.dom!.setAttribute("opacity", String(o));
      n.labelDom!.setAttribute("opacity", String(o));
    };
    const nodeScale = (n: PNode, s: number) => {
      n.dom!.setAttribute("transform", `translate(${n.x},${n.y}) scale(${s})`);
    };

    let riskShown = 0;
    const renderRisk = (v: number, settled: boolean) => {
      if (settled) {
        rvNum.textContent = "0.84";
        rvTxt.textContent = "· 3-hop flagged ancestor";
      } else {
        rvNum.textContent = v.toFixed(2);
        rvTxt.textContent = "";
      }
    };

    const resetCycle = () => {
      EDGES.forEach((e) => {
        e.node!.style.strokeDashoffset = String(e.len);
        e.node!.setAttribute("opacity", String(e.bad ? 0.92 : e.alpha));
        e.scan!.setAttribute("opacity", "0");
        e.scanCore!.setAttribute("opacity", "0");
      });
      NODES.forEach((n) => {
        nodeOp(n, 0);
        nodeScale(n, 0.6);
      });
      CHIPS.forEach((c) => c.dom.setAttribute("opacity", "0"));
      pulseDot.setAttribute("opacity", "0");
      pulseGlow.setAttribute("opacity", "0");
      riskShown = 0;
    };

    let startTime: number | null = null;
    let raf = 0;
    let lastT = 0;

    const frame = (ts: number) => {
      if (startTime === null) startTime = ts;
      const t = (ts - startTime) % CYCLE;
      if (t < lastT) resetCycle();
      let dt = t - lastT;
      if (dt < 0) dt = t;
      lastT = t;

      if (t < DRAW_END + HOLD) {
        svg.style.opacity = "1";
        nodeOp(SUBJ, ss(t / SUBJ_IN));
        nodeScale(SUBJ, 0.6 + 0.4 * pop(t / SUBJ_IN));

        [1, 2, 3].forEach((hop) => {
          const start = hopStart[hop];
          const local = (t - start) / HOP_DRAW;
          const p = ss(local);
          if (local <= 0) {
            hopEdges[hop].forEach((e) => {
              setEdge(e, 0);
              e.scan!.setAttribute("opacity", "0");
              e.scanCore!.setAttribute("opacity", "0");
            });
            return;
          }
          hopEdges[hop].forEach((e) => {
            setEdge(e, p);
            nodeOp(e.child, ss((p - 0.6) / 0.4));
            nodeScale(e.child, 0.6 + 0.4 * pop((p - 0.55) / 0.45));
            if (local > 0 && local < 1) {
              const pt = e.node!.getPointAtLength(e.len! * Math.min(1, p));
              const fade = Math.sin(p * Math.PI);
              e.scan!.setAttribute("cx", String(pt.x));
              e.scan!.setAttribute("cy", String(pt.y));
              e.scan!.setAttribute("opacity", String(0.16 * fade));
              e.scanCore!.setAttribute("cx", String(pt.x));
              e.scanCore!.setAttribute("cy", String(pt.y));
              e.scanCore!.setAttribute("opacity", String(0.7 * fade));
            } else {
              e.scan!.setAttribute("opacity", "0");
              e.scanCore!.setAttribute("opacity", "0");
            }
          });
        });

        CHIPS.forEach((c) => {
          const no = parseFloat(c.node.dom!.getAttribute("opacity") || "0");
          const cur = parseFloat(c.dom.getAttribute("opacity") || "0");
          const target = no > 0.7 ? 1 : 0;
          c.dom.setAttribute("opacity", String(cur + (target - cur) * Math.min(1, dt / 260)));
        });

        let visBad = 0;
        NODES.forEach((n) => {
          if (n.bad && parseFloat(n.dom!.getAttribute("opacity") || "0") > 0.55) visBad++;
        });
        const settled = t >= DRAW_END;
        const target = settled ? 0.84 : Math.min(0.84, visBad * 0.3);
        riskShown += (target - riskShown) * Math.min(1, dt / 380);
        if (Math.abs(target - riskShown) < 0.004) riskShown = target;
        renderRisk(riskShown, settled && riskShown > 0.82);

        const ph = (t % 1700) / 1700;
        NODES.forEach((n) => {
          if (!n.ring) return;
          const vis = parseFloat(n.dom!.getAttribute("opacity") || "0");
          if (vis > 0.4) {
            const rp = ss(ph < 0.65 ? ph / 0.65 : 1);
            n.ring.setAttribute("r", String(n.r + 5 + rp * 11));
            n.ring.setAttribute("opacity", String(vis * (1 - ph) * 0.65));
          } else {
            n.ring.setAttribute("opacity", "0");
          }
        });

        const fullBad = t >= DRAW_END - 220;
        if (fullBad && badSeq.length) {
          const loopT = ((t - (DRAW_END - 220)) % 1900) / 1900;
          const nb = badSeq.length;
          const fIdx = loopT * nb;
          const ei = Math.min(nb - 1, Math.floor(fIdx));
          const ep = fIdx - ei;
          const edge = badSeq[ei];
          const pt2 = edge.node!.getPointAtLength(edge.len! * (1 - ep));
          const fade2 = Math.sin(loopT * Math.PI);
          pulseDot.setAttribute("cx", String(pt2.x));
          pulseDot.setAttribute("cy", String(pt2.y));
          pulseDot.setAttribute("opacity", String(0.9 * fade2 + 0.1));
          pulseGlow.setAttribute("cx", String(pt2.x));
          pulseGlow.setAttribute("cy", String(pt2.y));
          pulseGlow.setAttribute("opacity", String(0.18 * fade2));
        } else {
          pulseDot.setAttribute("opacity", "0");
          pulseGlow.setAttribute("opacity", "0");
        }
      } else {
        svg.style.opacity = String(1 - ss((t - (DRAW_END + HOLD)) / FADEOUT));
        pulseDot.setAttribute("opacity", "0");
        pulseGlow.setAttribute("opacity", "0");
        EDGES.forEach((e) => {
          e.scan!.setAttribute("opacity", "0");
          e.scanCore!.setAttribute("opacity", "0");
        });
      }
      raf = requestAnimationFrame(frame);
    };

    const renderStatic = () => {
      EDGES.forEach((e) => {
        e.node!.style.strokeDashoffset = "0";
        e.node!.setAttribute("opacity", String(e.bad ? 0.92 : e.alpha));
      });
      NODES.forEach((n) => {
        nodeOp(n, 1);
        nodeScale(n, 1);
        if (n.ring) {
          n.ring.setAttribute("r", String(n.r + 7));
          n.ring.setAttribute("opacity", "0.5");
        }
      });
      CHIPS.forEach((c) => c.dom.setAttribute("opacity", "1"));
      if (badSeq.length) {
        const e0 = badSeq[badSeq.length - 1];
        const pt = e0.node!.getPointAtLength(e0.len! * 0.5);
        pulseDot.setAttribute("cx", String(pt.x));
        pulseDot.setAttribute("cy", String(pt.y));
        pulseDot.setAttribute("opacity", "0.9");
        pulseGlow.setAttribute("cx", String(pt.x));
        pulseGlow.setAttribute("cy", String(pt.y));
        pulseGlow.setAttribute("opacity", "0.16");
      }
      renderRisk(0.84, true);
      svg.style.opacity = "1";
    };

    if (reduce) {
      renderStatic();
      return;
    }

    resetCycle();
    renderRisk(0, false);

    let visible = true;
    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      startTime = null;
      lastT = 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(svg);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    start();

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <svg
      ref={ref}
      viewBox="0 0 820 400"
      preserveAspectRatio="xMidYMid meet"
      className="block w-full h-full"
      aria-hidden="true"
    />
  );
}
