import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";

const milestones = [
  {
    label: "ENTRY",
    title: "A wallet moves.",
    body: "One address. One outbound transaction. No labels yet — just motion on a quiet grid.",
  },
  {
    label: "MIXER · 25%",
    title: "It touches a mixer.",
    body: "Tornado Cash resolves on the second node. Three fresh addresses peel off in fast succession — the obfuscation pattern, made visible.",
  },
  {
    label: "BRIDGE · 50%",
    title: "It crosses a bridge.",
    body: "Funds jump chain. Atlas lights the cross-chain link in cobalt and the trail continues on the other side of an ETH → BTC band.",
  },
  {
    label: "PEDIGRID · 75%",
    title: "Pedigrid traces the bloodline.",
    body: "The destination wallet is dragged backward through N-hop lineage. Compromised ancestors surface. Distance is labelled. The chain remembers.",
  },
  {
    label: "VERDICT · 100%",
    title: "The pattern is named. The chain is broken.",
    body: "Mixer exposure, bridge hop, lineage risk, score. Every line is auditable. Every weight is documented.",
  },
];

function usePiece(p: MotionValue<number>, start: number, end: number) {
  return useTransform(p, [start, end], [0, 1], { clamp: true });
}

export function ScrollAnatomy() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Entry: 0 - 0.12
  const pEntry = usePiece(p, 0.02, 0.14);
  // Mixer: 0.15 - 0.35
  const pMixerNode = usePiece(p, 0.15, 0.22);
  const pMixerBranch1 = usePiece(p, 0.22, 0.27);
  const pMixerBranch2 = usePiece(p, 0.24, 0.30);
  const pMixerBranch3 = usePiece(p, 0.27, 0.33);
  // Bridge: 0.38 - 0.55
  const pBridgeBand = usePiece(p, 0.38, 0.45);
  const pBridgeCross = usePiece(p, 0.43, 0.55);
  // Pedigrid: 0.60 - 0.80
  const pPedi = usePiece(p, 0.60, 0.78);
  // Verdict lines staggered 0.85 -> 1.0
  const pV1 = usePiece(p, 0.84, 0.88);
  const pV2 = usePiece(p, 0.87, 0.91);
  const pV3 = usePiece(p, 0.90, 0.94);
  const pV4 = usePiece(p, 0.93, 0.97);
  const pV5 = usePiece(p, 0.96, 1.0);

  const activeIdx = useTransform(p, (v): number => {
    if (v < 0.15) return 0;
    if (v < 0.38) return 1;
    if (v < 0.60) return 2;
    if (v < 0.84) return 3;
    return 4;
  });

  return (
    <section className="relative bg-base">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-10">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
          // 02 / Forensic Trace
        </div>
        <h2 className="font-display text-ink mt-4 leading-[1.05]" style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>
          Unraveling a <em className="italic text-cobalt">mixer</em>, in real time.
        </h2>
        <p className="font-body text-ink-soft mt-6 max-w-[58ch] text-[16px] leading-relaxed">
          One wallet. One mixer. One bridge. Watch PreCog illuminate a money trail that was built to disappear.
        </p>
      </div>

      <div ref={ref} className="relative" style={{ height: "460vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 relative h-[60vh]">
              {milestones.map((m, i) => (
                <Milestone key={i} index={i} activeIdx={activeIdx} milestone={m} />
              ))}
            </div>

            <div className="lg:col-span-7 h-[82vh] relative">
              <Schematic
                pEntry={pEntry}
                pMixerNode={pMixerNode}
                pMixerBranches={[pMixerBranch1, pMixerBranch2, pMixerBranch3]}
                pBridgeBand={pBridgeBand}
                pBridgeCross={pBridgeCross}
                pPedi={pPedi}
                pVerdict={[pV1, pV2, pV3, pV4, pV5]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Milestone({
  index,
  activeIdx,
  milestone,
}: {
  index: number;
  activeIdx: MotionValue<number>;
  milestone: { label: string; title: string; body: string };
}) {
  const opacity = useTransform(activeIdx, (v) => (Math.round(v) === index ? 1 : 0));
  const y = useTransform(activeIdx, (v) => (Math.round(v) === index ? 0 : 12));
  const pointerEvents = useTransform(activeIdx, (v) =>
    Math.round(v) === index ? "auto" : "none",
  );

  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col justify-center"
    >
      <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
        {milestone.label}
      </div>
      <h3
        className="font-display italic text-ink mt-5 leading-[1.05]"
        style={{ fontSize: "clamp(30px, 3.4vw, 48px)" }}
      >
        {milestone.title}
      </h3>
      <p className="font-body text-ink-soft mt-6 max-w-[44ch] text-[16px] leading-relaxed">
        {milestone.body}
      </p>
    </motion.div>
  );
}

/* ---------- SCHEMATIC ---------- */

const INK = "#0E0E0E";
const SOFT = "#3A3A3A";
const GRID = "#C8C8C8";
const COBALT = "#0047FF";
const BAD = "#C53030";

// Layout coordinates (viewBox 800 x 800)
const WALLET = { x: 90, y: 240 };
const MIXER = { x: 320, y: 240 };
const MIXOUT = [
  { x: 470, y: 150 },
  { x: 500, y: 250 },
  { x: 470, y: 340 }, // this one goes to the bridge
];
const BRIDGE_Y = 430; // band y-center
// BTC side
const BTC_DEST = { x: 540, y: 560 };
// Pedigrid ancestors
const PEDI_NODES = [
  { x: 540, y: 640, hot: false, label: "1 hop" },
  { x: 430, y: 700, hot: false, label: "2 hops" },
  { x: 650, y: 700, hot: true, label: "2 hops" },
  { x: 360, y: 760, hot: true, label: "3 hops" },
  { x: 720, y: 760, hot: false, label: "" },
];

function Schematic({
  pEntry,
  pMixerNode,
  pMixerBranches,
  pBridgeBand,
  pBridgeCross,
  pPedi,
  pVerdict,
}: {
  pEntry: MotionValue<number>;
  pMixerNode: MotionValue<number>;
  pMixerBranches: MotionValue<number>[];
  pBridgeBand: MotionValue<number>;
  pBridgeCross: MotionValue<number>;
  pPedi: MotionValue<number>;
  pVerdict: MotionValue<number>[];
}) {
  return (
    <div className="relative w-full h-full bg-surface border border-muted-line">
      {/* HUD */}
      <div className="absolute top-3 left-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        TRACE_MAP // case_0x1Kuf
      </div>
      <div className="absolute top-3 right-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-cobalt">
        ● live
      </div>
      <div className="absolute bottom-3 left-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        engine: precog v1.0
      </div>
      <div className="absolute bottom-3 right-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        analyst: 00bit
      </div>

      <svg viewBox="0 0 800 800" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="forensic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={GRID} strokeWidth="0.3" opacity="0.5" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={INK} />
          </marker>
          <marker id="arrow-cobalt" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={COBALT} />
          </marker>
        </defs>

        <rect width="800" height="800" fill="url(#forensic-grid)" />

        {/* ===== ENTRY ===== */}
        {/* Wallet node */}
        <circle cx={WALLET.x} cy={WALLET.y} r="5" fill={INK} />
        <text x={WALLET.x - 8} y={WALLET.y - 14} fontSize="8" fontFamily="DM Mono, monospace" fill={SOFT}>
          0x1Kuf...rkVo
        </text>
        <text x={WALLET.x - 8} y={WALLET.y - 4} fontSize="7" fontFamily="DM Mono, monospace" fill={GRID}>
          t = 00:00
        </text>

        {/* Entry line wallet -> mixer */}
        <motion.path
          d={`M ${WALLET.x + 6} ${WALLET.y} L ${MIXER.x - 14} ${MIXER.y}`}
          stroke={INK}
          strokeWidth="1"
          fill="none"
          style={{ pathLength: pEntry }}
          markerEnd="url(#arrow)"
        />

        {/* ===== MIXER ===== */}
        <motion.g style={{ opacity: pMixerNode }}>
          {/* Mixer node — vortex glyph */}
          <circle cx={MIXER.x} cy={MIXER.y} r="14" fill="none" stroke={INK} strokeWidth="1" />
          <Vortex cx={MIXER.x} cy={MIXER.y} r={10} />
          <text x={MIXER.x + 22} y={MIXER.y - 6} fontSize="10" fontFamily="DM Mono, monospace" fill={INK}>
            Tornado Cash
          </text>
          <text x={MIXER.x + 22} y={MIXER.y + 6} fontSize="7" fontFamily="DM Mono, monospace" fill={SOFT}>
            mixer_contract
          </text>
        </motion.g>

        {/* Mixer branches */}
        {MIXOUT.map((out, i) => (
          <g key={i}>
            <motion.path
              d={`M ${MIXER.x + 14} ${MIXER.y} L ${out.x - 4} ${out.y}`}
              stroke={SOFT}
              strokeWidth="0.7"
              fill="none"
              style={{ pathLength: pMixerBranches[i] }}
            />
            <motion.circle
              cx={out.x}
              cy={out.y}
              r="3"
              fill={SOFT}
              style={{ opacity: pMixerBranches[i] }}
            />
            <motion.text
              x={out.x + 8}
              y={out.y + 3}
              fontSize="7"
              fontFamily="DM Mono, monospace"
              fill={SOFT}
              style={{ opacity: pMixerBranches[i] }}
            >
              0x{["a4","9f","c1"][i]}...{["3e","b2","77"][i]}
            </motion.text>
          </g>
        ))}

        {/* ===== BRIDGE BAND ===== */}
        <motion.g style={{ opacity: pBridgeBand }}>
          <line x1="0" y1={BRIDGE_Y - 24} x2="800" y2={BRIDGE_Y - 24} stroke={GRID} strokeWidth="0.5" strokeDasharray="3 4" />
          <line x1="0" y1={BRIDGE_Y + 24} x2="800" y2={BRIDGE_Y + 24} stroke={GRID} strokeWidth="0.5" strokeDasharray="3 4" />
          <text x="20" y={BRIDGE_Y - 30} fontSize="9" fontFamily="DM Mono, monospace" fill={COBALT} letterSpacing="2">
            BRIDGE · ETH → BTC
          </text>
          <text x="20" y={BRIDGE_Y + 38} fontSize="7" fontFamily="DM Mono, monospace" fill={SOFT}>
            wormhole_v2 · fee 0.04%
          </text>
          {/* double-arrow glyph */}
          <g transform={`translate(680, ${BRIDGE_Y - 6})`}>
            <path d="M 0 6 L 14 6 M 10 2 L 14 6 L 10 10" stroke={COBALT} strokeWidth="1" fill="none" />
            <path d="M 30 6 L 16 6 M 20 2 L 16 6 L 20 10" stroke={COBALT} strokeWidth="1" fill="none" />
          </g>
        </motion.g>

        {/* Cross-chain path: from MIXOUT[2] -> down through band -> BTC_DEST */}
        <motion.path
          d={`M ${MIXOUT[2].x} ${MIXOUT[2].y + 4} L ${MIXOUT[2].x + 30} ${BRIDGE_Y - 28}`}
          stroke={COBALT}
          strokeWidth="1.2"
          fill="none"
          style={{ pathLength: pBridgeCross }}
        />
        {/* dashed across band */}
        <motion.path
          d={`M ${MIXOUT[2].x + 30} ${BRIDGE_Y - 24} L ${BTC_DEST.x - 20} ${BRIDGE_Y + 24}`}
          stroke={COBALT}
          strokeWidth="1"
          strokeDasharray="3 3"
          fill="none"
          style={{ pathLength: pBridgeCross }}
        />
        {/* btc side — thicker stroke */}
        <motion.path
          d={`M ${BTC_DEST.x - 20} ${BRIDGE_Y + 28} L ${BTC_DEST.x} ${BTC_DEST.y - 6}`}
          stroke={INK}
          strokeWidth="1.6"
          fill="none"
          style={{ pathLength: pBridgeCross }}
          markerEnd="url(#arrow)"
        />
        {/* BTC dest node */}
        <motion.g style={{ opacity: pBridgeCross }}>
          <rect x={BTC_DEST.x - 5} y={BTC_DEST.y - 5} width="10" height="10" fill={INK} />
          <text x={BTC_DEST.x + 12} y={BTC_DEST.y - 2} fontSize="9" fontFamily="DM Mono, monospace" fill={INK}>
            bc1q...m2v8
          </text>
          <text x={BTC_DEST.x + 12} y={BTC_DEST.y + 8} fontSize="7" fontFamily="DM Mono, monospace" fill={SOFT}>
            chain: btc
          </text>
        </motion.g>

        {/* ===== PEDIGRID ===== */}
        {/* edges */}
        {[
          { from: BTC_DEST, to: PEDI_NODES[0], label: "1 hop", hot: false },
          { from: PEDI_NODES[0], to: PEDI_NODES[1], label: "2 hops", hot: false },
          { from: PEDI_NODES[0], to: PEDI_NODES[2], label: "2 hops", hot: true },
          { from: PEDI_NODES[1], to: PEDI_NODES[3], label: "3 hops", hot: true },
          { from: PEDI_NODES[2], to: PEDI_NODES[4], label: "", hot: false },
        ].map((e, i) => (
          <g key={i}>
            <motion.path
              d={`M ${e.from.x} ${e.from.y + 6} L ${e.to.x} ${e.to.y - 4}`}
              stroke={e.hot ? BAD : SOFT}
              strokeWidth={e.hot ? "1" : "0.7"}
              fill="none"
              style={{ pathLength: pPedi }}
            />
            {e.label && (
              <motion.text
                x={(e.from.x + e.to.x) / 2 + 6}
                y={(e.from.y + e.to.y) / 2}
                fontSize="6.5"
                fontFamily="DM Mono, monospace"
                fill={e.hot ? BAD : GRID}
                style={{ opacity: pPedi }}
              >
                {e.label}
              </motion.text>
            )}
          </g>
        ))}
        {PEDI_NODES.map((n, i) => (
          <motion.g key={i} style={{ opacity: pPedi }}>
            <circle cx={n.x} cy={n.y} r={n.hot ? 4 : 3} fill={n.hot ? BAD : SOFT} />
            {n.hot && (
              <circle cx={n.x} cy={n.y} r="9" fill="none" stroke={BAD} strokeWidth="0.6" />
            )}
            {n.hot && (
              <text x={n.x + 10} y={n.y + 3} fontSize="6.5" fontFamily="DM Mono, monospace" fill={BAD}>
                FLAGGED
              </text>
            )}
          </motion.g>
        ))}

        {/* ===== VERDICT PANEL ===== */}
        <Verdict pVerdict={pVerdict} />
      </svg>
    </div>
  );
}

function Vortex({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  // simple inward spiral
  const pts: string[] = [];
  const turns = 2.2;
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const angle = turns * Math.PI * 2 * t;
    const rad = r * (1 - t * 0.85);
    const x = cx + Math.cos(angle) * rad;
    const y = cy + Math.sin(angle) * rad;
    pts.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  return <path d={pts.join(" ")} stroke={INK} strokeWidth="0.8" fill="none" />;
}

function Verdict({ pVerdict }: { pVerdict: MotionValue<number>[] }) {
  const lines = [
    { label: "MIXER EXPOSURE", value: "CONFIRMED" },
    { label: "BRIDGE HOP", value: "ETH → BTC" },
    { label: "LINEAGE RISK", value: "3-HOP FLAGGED ANCESTOR" },
    { label: "PATTERN", value: "MIX_THEN_BRIDGE_v2" },
  ];
  const x = 160;
  const y = 290;
  const w = 380;
  const h = 220;

  // total opacity of panel rides on first line
  return (
    <g>
      <motion.g style={{ opacity: pVerdict[0] }}>
        <rect x={x} y={y} width={w} height={h} fill="#fff" stroke={INK} strokeWidth="1" />
        <text x={x + 14} y={y + 22} fontSize="9" fontFamily="DM Mono, monospace" fill={INK} letterSpacing="2">
          VERDICT
        </text>
        <text x={x + w - 14} y={y + 22} textAnchor="end" fontSize="8" fontFamily="DM Mono, monospace" fill={COBALT}>
          ● locked
        </text>
        <line x1={x + 14} y1={y + 32} x2={x + w - 14} y2={y + 32} stroke={GRID} strokeWidth="0.5" />
      </motion.g>

      {lines.map((l, i) => (
        <motion.g key={i} style={{ opacity: pVerdict[i + 0] }}>
          <text
            x={x + 14}
            y={y + 60 + i * 26}
            fontSize="8"
            fontFamily="DM Mono, monospace"
            fill={SOFT}
            letterSpacing="1.5"
          >
            {l.label}
          </text>
          <text
            x={x + w - 14}
            y={y + 60 + i * 26}
            textAnchor="end"
            fontSize="9"
            fontFamily="DM Mono, monospace"
            fill={INK}
          >
            {l.value}
          </text>
        </motion.g>
      ))}

      {/* score line — pulses once via cobalt fill on last */}
      <motion.g style={{ opacity: pVerdict[4] }}>
        <line x1={x + 14} y1={y + h - 56} x2={x + w - 14} y2={y + h - 56} stroke={GRID} strokeWidth="0.5" />
        <text x={x + 14} y={y + h - 22} fontSize="9" fontFamily="DM Mono, monospace" fill={SOFT} letterSpacing="1.5">
          SCORE
        </text>
        <text
          x={x + w - 14}
          y={y + h - 18}
          textAnchor="end"
          fontSize="26"
          fontFamily="Playfair Display, serif"
          fontStyle="italic"
          fill={COBALT}
        >
          91 / CRITICAL
        </text>
      </motion.g>
    </g>
  );
}
