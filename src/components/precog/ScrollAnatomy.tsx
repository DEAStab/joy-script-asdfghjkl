import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";

const milestones = [
  {
    label: "ENTRY",
    title: "A wallet arrives.",
    body: "One address. One timestamp. No prior assumptions.",
  },
  {
    label: "ATLAS · 25%",
    title: "Atlas maps its exposure.",
    body: "We trace every hop to known-bad addresses across chains, building a behavioural map in seconds.",
  },
  {
    label: "TANGO · 50%",
    title: "Tango reads its rhythm.",
    body: "Timing. Fan-out. Peel-chain behaviour. Dormancy bursts. The signature beneath the transactions.",
  },
  {
    label: "PEDIGRID · 75%",
    title: "Pedigrid traces the bloodline.",
    body: "N-hop lineage through flagged addresses, weighted by distance and source confidence.",
  },
  {
    label: "OUTPUT · 100%",
    title: "A score. Named evidence. No black box.",
    body: "Every component is auditable. Every weight is documented. Every signal is named.",
  },
];

// helper: clamp motion value into 0..1 piece
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

  // path lengths drive each schematic part
  const pAtlas = usePiece(p, 0.15, 0.4);
  const pTango = usePiece(p, 0.38, 0.62);
  const pPedi = usePiece(p, 0.6, 0.85);
  const pScore = usePiece(p, 0.85, 1);

  const ringScale = useTransform(p, [0, 0.15], [0.6, 1]);
  const ringOpacity = useTransform(p, [0, 0.1, 0.15], [0, 1, 1]);

  // active milestone index for left text
  const activeIdx = useTransform(p, (v): number => {
    if (v < 0.18) return 0;
    if (v < 0.42) return 1;
    if (v < 0.65) return 2;
    if (v < 0.87) return 3;
    return 4;
  });

  return (
    <section className="relative bg-base">
      {/* section overline */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-32 pb-10">
        <div className="font-mono-ui text-[11px] uppercase tracking-[0.3em] text-cobalt">
          // 02 / Scoring Anatomy
        </div>
        <h2 className="font-display text-ink mt-4 leading-[1.05]" style={{ fontSize: "clamp(36px, 4.6vw, 64px)" }}>
          The anatomy of a <em className="italic text-cobalt">risk score</em>.
        </h2>
      </div>

      <div ref={ref} className="relative" style={{ height: "420vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left text */}
            <div className="lg:col-span-5 relative h-[60vh]">
              {milestones.map((m, i) => (
                <Milestone key={i} index={i} activeIdx={activeIdx} milestone={m} />
              ))}
            </div>

            {/* Right diagram — 55% via lg:col-span-7 (~58%) */}
            <div className="lg:col-span-7 h-[80vh] relative">
              <Schematic
                pAtlas={pAtlas}
                pTango={pTango}
                pPedi={pPedi}
                pScore={pScore}
                ringScale={ringScale}
                ringOpacity={ringOpacity}
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
    Math.round(v) === index ? "auto" : "none"
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

function Schematic({
  pAtlas,
  pTango,
  pPedi,
  pScore,
  ringScale,
  ringOpacity,
}: {
  pAtlas: MotionValue<number>;
  pTango: MotionValue<number>;
  pPedi: MotionValue<number>;
  pScore: MotionValue<number>;
  ringScale: MotionValue<number>;
  ringOpacity: MotionValue<number>;
}) {
  // Use pathLength for stroke draw
  const ATLAS_PATHS = [
    "M 400 300 L 220 180",
    "M 400 300 L 200 320",
    "M 400 300 L 250 460",
    "M 400 300 L 560 200",
    "M 400 300 L 600 360",
    "M 400 300 L 520 470",
  ];
  const ATLAS_NODES = [
    { x: 220, y: 180, bad: true },
    { x: 200, y: 320, bad: false },
    { x: 250, y: 460, bad: true },
    { x: 560, y: 200, bad: false },
    { x: 600, y: 360, bad: false },
    { x: 520, y: 470, bad: true },
  ];

  // Pedigrid branching tree
  const PEDI_PATHS = [
    "M 400 300 L 400 560",
    "M 400 560 L 280 620",
    "M 400 560 L 520 620",
    "M 280 620 L 220 680",
    "M 280 620 L 340 680",
    "M 520 620 L 460 680",
    "M 520 620 L 580 680",
  ];

  return (
    <div className="relative w-full h-full bg-surface border border-muted-line">
      {/* HUD corners */}
      <div className="absolute top-3 left-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        SCHEMATIC // RISK_ENGINE
      </div>
      <div className="absolute top-3 right-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-cobalt">
        ● live
      </div>
      <div className="absolute bottom-3 left-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        wallet: 1Kuf...rkVo
      </div>
      <div className="absolute bottom-3 right-4 font-mono-ui text-[9px] uppercase tracking-[0.3em] text-ink-soft">
        engine: v1.0
      </div>

      <svg viewBox="0 0 800 800" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C8C8C8" strokeWidth="0.3" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="800" height="800" fill="url(#grid2)" />

        {/* Crosshairs through center */}
        <line x1="0" y1="300" x2="800" y2="300" stroke="#C8C8C8" strokeWidth="0.4" strokeDasharray="2 4" />
        <line x1="400" y1="0" x2="400" y2="800" stroke="#C8C8C8" strokeWidth="0.4" strokeDasharray="2 4" />

        {/* Pulsing ring */}
        <motion.circle
          cx="400"
          cy="300"
          r="40"
          fill="none"
          stroke="#0047FF"
          strokeWidth="1"
          style={{ scale: ringScale, opacity: ringOpacity, transformOrigin: "400px 300px" } as any}
        />
        <motion.circle
          cx="400"
          cy="300"
          r="60"
          fill="none"
          stroke="#0047FF"
          strokeWidth="0.6"
          opacity="0.4"
          style={{ scale: ringScale, transformOrigin: "400px 300px" } as any}
        />

        {/* Entry node — center */}
        <circle cx="400" cy="300" r="6" fill="#0047FF" />
        <text x="412" y="296" className="font-mono-ui" fontSize="9" fill="#0E0E0E" fontFamily="DM Mono, monospace">
          ENTRY · 0x1Kuf...rkVo
        </text>

        {/* ATLAS lines */}
        {ATLAS_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={ATLAS_NODES[i].bad ? "#0E0E0E" : "#3A3A3A"}
            strokeWidth="0.8"
            style={{ pathLength: pAtlas }}
          />
        ))}
        {/* ATLAS nodes (opacity tied to atlas progress) */}
        {ATLAS_NODES.map((n, i) => (
          <motion.g key={i} style={{ opacity: pAtlas }}>
            <circle cx={n.x} cy={n.y} r={n.bad ? 5 : 3.5} fill={n.bad ? "#0E0E0E" : "#3A3A3A"} />
            {n.bad && (
              <circle cx={n.x} cy={n.y} r="10" fill="none" stroke="#0E0E0E" strokeWidth="0.5" />
            )}
            <text
              x={n.x + 10}
              y={n.y + 3}
              fontSize="7.5"
              fill="#3A3A3A"
              fontFamily="DM Mono, monospace"
            >
              {n.bad ? "FLAG" : "addr"}
            </text>
          </motion.g>
        ))}

        {/* TANGO waveform — below center */}
        <g transform="translate(120, 130)">
          <motion.path
            d={tangoWave()}
            fill="none"
            stroke="#0047FF"
            strokeWidth="1.2"
            style={{ pathLength: pTango }}
          />
          <motion.text
            x="0"
            y="-8"
            fontSize="8"
            fill="#0047FF"
            fontFamily="DM Mono, monospace"
            style={{ opacity: pTango }}
          >
            TANGO · tx_rhythm
          </motion.text>
          {/* tick marks */}
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.line
              key={i}
              x1={i * 80}
              y1="0"
              x2={i * 80}
              y2="6"
              stroke="#C8C8C8"
              strokeWidth="0.5"
              style={{ opacity: pTango }}
            />
          ))}
        </g>

        {/* PEDIGRID tree */}
        {PEDI_PATHS.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke={i === 0 || i === 1 || i === 3 ? "#0E0E0E" : "#3A3A3A"}
            strokeWidth={i === 0 || i === 1 || i === 3 ? "1" : "0.7"}
            style={{ pathLength: pPedi }}
          />
        ))}
        {[
          { x: 400, y: 560 },
          { x: 280, y: 620 },
          { x: 520, y: 620 },
          { x: 220, y: 680, hot: true },
          { x: 340, y: 680 },
          { x: 460, y: 680 },
          { x: 580, y: 680, hot: true },
        ].map((n, i) => (
          <motion.g key={i} style={{ opacity: pPedi }}>
            <circle cx={n.x} cy={n.y} r={n.hot ? 4 : 3} fill={n.hot ? "#0E0E0E" : "#3A3A3A"} />
            {n.hot && (
              <circle cx={n.x} cy={n.y} r="8" fill="none" stroke="#0E0E0E" strokeWidth="0.5" />
            )}
          </motion.g>
        ))}
        <motion.text
          x="160"
          y="555"
          fontSize="8"
          fill="#0047FF"
          fontFamily="DM Mono, monospace"
          style={{ opacity: pPedi }}
        >
          PEDIGRID · lineage_tree
        </motion.text>

        {/* Final score badge */}
        <motion.g style={{ opacity: pScore }}>
          <rect x="320" y="240" width="160" height="64" fill="#0047FF" />
          <text
            x="400"
            y="266"
            textAnchor="middle"
            fontSize="9"
            fill="#fff"
            fontFamily="DM Mono, monospace"
            letterSpacing="2"
          >
            RISK SCORE
          </text>
          <text
            x="400"
            y="294"
            textAnchor="middle"
            fontSize="22"
            fill="#fff"
            fontFamily="Playfair Display, serif"
            fontStyle="italic"
          >
            87 / HIGH
          </text>
        </motion.g>
      </svg>
    </div>
  );
}

function tangoWave() {
  // sine-like waveform
  const pts: string[] = [];
  for (let i = 0; i <= 480; i += 4) {
    const y = Math.sin(i / 18) * 18 + Math.sin(i / 7) * 4;
    pts.push(`${i === 0 ? "M" : "L"} ${i} ${y}`);
  }
  return pts.join(" ");
}
