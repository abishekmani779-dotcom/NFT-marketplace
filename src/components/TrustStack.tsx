/**
 * TrustStack — Bento-Grid "Built for Institutional Trust"
 *
 * Grid Architecture (desktop):
 *   3 equal columns, gap-6
 *   Row 1: [Custody   col-span-2] [Provenance col-span-1 row-span-2]
 *   Row 2: [Oracle    col-span-2] [Provenance ↑ continued           ]
 *   Row 3: [Liquidity col-span-1] [NFC col-span-1] [Escrow col-span-1]
 *
 * Tablet: 2-col grid  |  Mobile: 1-col stack (fade-up each card)
 *
 * Design tokens:
 *   border-radius : rounded-3xl (24px) on every card
 *   padding       : p-8 on every card
 *   gap           : gap-6 (24px) between every card
 *   icon size     : w-12 h-12 wrapper, w-6 h-6 icon — same on all cards
 *   glow intensity: shadow-[0_0_28px_…] at 35% opacity — same on all cards
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence, type Variants } from 'framer-motion';
import { ShieldCheck, Anchor, Globe, Zap, Lock, Clock } from 'lucide-react';

// ─── Design constants ────────────────────────────────────────────────────────

const GOLD_GRADIENT     = 'linear-gradient(135deg, #D4AF37 0%, #F1D27C 50%, #D4AF37 100%)';
const GOLD_GRADIENT_BG  = 'linear-gradient(135deg, #b8860b 0%, #D4AF37 40%, #F1D27C 70%, #D4AF37 100%)';

/** Every card shares the same base surface style applied inline */
const CARD_BASE: React.CSSProperties = {
  backdropFilter : 'blur(24px)',
  WebkitBackdropFilter: 'blur(24px)',
  border         : '1px solid rgba(255,255,255,0.065)',
  borderRadius   : 24,           // rounded-3xl
};

// ─── Motion variants ─────────────────────────────────────────────────────────

const containerV: Variants = {
  hidden  : {},
  visible : { transition: { staggerChildren: 0.13, delayChildren: 0.05 } },
};

const cardV: Variants = {
  hidden  : { opacity: 0, y: 40, scale: 0.97 },
  visible : { opacity: 1, y: 0,  scale: 1,
    transition: { duration: 0.6, ease: 'easeOut' } },
};

// ─── MagneticCard (tilt wrapper) ─────────────────────────────────────────────

function MagneticCard({
  children, className = '', intensity = 8, style,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  style?: React.CSSProperties;
}) {
  const ref  = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r  = ref.current.getBoundingClientRect();
    const nx = (e.clientX - r.left)  / r.width  - 0.5;
    const ny = (e.clientY - r.top)   / r.height - 0.5;
    setTilt({ x: ny * -intensity, y: nx * intensity });
  }, [intensity]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 22 }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000, ...style }}
      data-hovered={hovered}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Border beam (hover glow ring) ───────────────────────────────────────────

function BorderBeam({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="beam"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            borderRadius: 'inherit',
            boxShadow: '0 0 0 1px rgba(212,175,55,0.50), inset 0 0 24px 0 rgba(212,175,55,0.06), 0 0 24px 4px rgba(212,175,55,0.12)',
          }}
        />
      )}
    </AnimatePresence>
  );
}

// ─── Shared icon block (consistent size + glow across all cards) ───────────

function CardIcon({
  Icon, bg, glow,
}: {
  Icon: React.ElementType;
  bg: string;           // CSS background value
  glow: string;         // CSS box-shadow value
}) {
  return (
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
      style={{ background: bg, boxShadow: glow }}
    >
      <Icon className="w-6 h-6 text-white" />
    </div>
  );
}

// ─── Shared metadata footer (keeps footer baseline consistent) ───────────────

function CardMeta({ text }: { text: string }) {
  return (
    <p className="text-[9px] font-mono text-slate-700 tracking-widest uppercase leading-relaxed">
      {text}
    </p>
  );
}

// ─── Shared badge ────────────────────────────────────────────────────────────

function CardBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex text-[9px] uppercase tracking-widest font-mono px-2.5 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}44`, background: `${color}14` }}
    >
      {label}
    </span>
  );
}

// ─── Animated mesh background ────────────────────────────────────────────────

function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{ background: 'radial-gradient(circle, #D4AF37 0%, transparent 70%)',
                 opacity: 0.055, top: '-20%', left: '-15%' }}
        animate={{ x: [0, 70, 0], y: [0, 45, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[650px] h-[650px] rounded-full"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
                 opacity: 0.045, bottom: '-15%', right: '-12%' }}
        animate={{ x: [0, -55, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
                 opacity: 0.035, top: '38%', left: '38%' }}
        animate={{ x: [0, 35, -25, 0], y: [0, -35, 22, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 10 }}
      />
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)',
          backgroundSize : '28px 28px',
          opacity: 0.022,
        }}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 01 — Protocol-Insured Custody (col-span-2, row 1)
// ═══════════════════════════════════════════════════════════════

function CustodyCard() {
  const [hovered, setHovered] = useState(false);
  const vaults = [
    { city: 'Geneva',    lat: '46.2022', lon: '6.1457'    },
    { city: 'London',    lat: '51.5074', lon: '-0.1278'   },
    { city: 'Tokyo',     lat: '35.6892', lon: '139.6917'  },
    { city: 'Zurich',    lat: '47.3769', lon: '8.5417'    },
    { city: 'Hong Kong', lat: '22.3193', lon: '114.1694'  },
  ];

  return (
    <MagneticCard className="relative h-full cursor-default" intensity={6}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{ ...CARD_BASE, background: 'linear-gradient(140deg, rgba(18,16,10,0.97) 0%, rgba(10,10,10,0.99) 100%)' }}
      >
        <BorderBeam active={hovered} />

        {/* Ghost shield */}
        <motion.div
          className="absolute -right-12 -bottom-12 pointer-events-none select-none"
          animate={{ rotate: hovered ? 6 : 0, scale: hovered ? 1.06 : 1, opacity: hovered ? 0.07 : 0.04 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <ShieldCheck className="w-72 h-72 text-gold-500" />
        </motion.div>

        {/* ── Header row ── */}
        <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <CardIcon
              Icon={ShieldCheck}
              bg={GOLD_GRADIENT_BG}
              glow="0 0 28px rgba(212,175,55,0.35)"
            />
            <div>
              <span
                className="inline-block text-[9px] uppercase tracking-[0.24em] font-mono px-2.5 py-1 rounded-full border mb-2"
                style={{ color: '#D4AF37', borderColor: 'rgba(212,175,55,0.28)', background: 'rgba(212,175,55,0.08)' }}
              >
                L3 Standard
              </span>
              <h3 className="font-serif text-2xl md:text-3xl text-slate-50 leading-tight">
                Protocol-Insured Custody
              </h3>
            </div>
          </div>

          {/* Vault Status — top-right */}
          <div className="shrink-0 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-900/20">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] font-mono text-green-400 uppercase tracking-wider whitespace-nowrap">Vault Status: Active</span>
          </div>
        </div>

        {/* ── Body ── */}
        <p className="relative z-10 text-slate-400 text-sm leading-relaxed max-w-xl mb-auto">
          Physical assets are stored in climate-controlled, globally distributed vaults
          with Lloyd's of London insurance — backed at the protocol layer with on-chain
          claim settlement.
        </p>

        {/* ── Location tags (single row) ── */}
        <div className="relative z-10 mt-8 flex flex-wrap items-center gap-2">
          {vaults.map(({ city, lat, lon }) => (
            <div key={city} className="group/tag relative">
              <span
                className="text-[10px] font-mono text-slate-400 border rounded-md px-2.5 py-1 flex items-center gap-1.5 cursor-default whitespace-nowrap"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />
                {city}
              </span>
              {/* Geo tooltip */}
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tag:block z-30" style={{ pointerEvents: 'none' }}>
                <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg px-3 py-2 shadow-2xl whitespace-nowrap">
                  <p className="text-[9px] font-mono text-slate-500">LAT: {lat} | LON: {lon}</p>
                </div>
              </div>
            </div>
          ))}
          <span className="text-[10px] font-mono text-slate-600 border border-dashed border-obsidian-800 rounded-md px-2.5 py-1">
            +18 vaults
          </span>
        </div>

        {/* ── Footer metadata ── */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="COVERAGE: FULL | INSURER: LLOYD'S OF LONDON | PROTOCOL: ERC-721 | STANDARD: ISO 27001" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 02 — Provenance Chain (col-span-1, row-span-2 — TALL)
// ═══════════════════════════════════════════════════════════════

const LIVE_EVENTS = [
  { event: 'Transfer',   hash: '0x4a3…e12f', age: '12s ago',  color: '#06b6d4' },
  { event: 'Appraisal',  hash: '0x7b1…c98d', age: '1m ago',   color: '#a78bfa' },
  { event: 'Minted',     hash: '0xdd2…5a70', age: '4m ago',   color: '#34d399' },
  { event: 'Transfer',   hash: '0x1fc…b831', age: '11m ago',  color: '#06b6d4' },
  { event: 'Appraisal',  hash: '0x8e9…41da', age: '18m ago',  color: '#a78bfa' },
  { event: 'Fractional', hash: '0xb72…92c4', age: '32m ago',  color: '#fbbf24' },
  { event: 'Insured',    hash: '0x5c1…e07b', age: '1h ago',   color: '#f472b6' },
  { event: 'Transfer',   hash: '0x9a4…7f23', age: '2h ago',   color: '#06b6d4' },
];

function ProvenanceCard() {
  const [hovered, setHovered] = useState(false);
  const [block,   setBlock]   = useState(19_842_700);
  const [txCount, setTxCount] = useState(4_218_301);

  useEffect(() => {
    const blockTimer = setInterval(() => setBlock  (b => b + Math.floor(Math.random() * 3) + 1), 2800);
    const txTimer    = setInterval(() => setTxCount(t => t + Math.floor(Math.random() * 4) + 1), 1900);
    return () => { clearInterval(blockTimer); clearInterval(txTimer); };
  }, []);

  return (
    <MagneticCard className="relative h-full cursor-default" intensity={5}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{ ...CARD_BASE, background: 'linear-gradient(160deg, rgba(5,35,30,0.15) 0%, rgba(10,10,10,0.97) 100%)' }}
      >
        <BorderBeam active={hovered} />

        {/* ── Header ── */}
        <div className="relative z-10 flex items-start gap-4 mb-6">
          <CardIcon
            Icon={Anchor}
            bg="linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)"
            glow="0 0 28px rgba(6,182,212,0.35)"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-serif text-xl text-slate-100">Provenance Chain</h3>
              <CardBadge label="On-Chain" color="#06b6d4" />
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Every transfer and appraisal event is cryptographically recorded as an ERC-721 event on Ethereum — permanent and tamper-proof.
            </p>
          </div>
        </div>

        {/* ── Live stats row ── */}
        <div className="relative z-10 grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'Block', val: block,    prefix: '#', color: '#34d399' },
            { label: 'Events', val: txCount, prefix: '',  color: '#06b6d4' },
          ].map(({ label, val, prefix, color }) => (
            <div
              key={label}
              className="rounded-xl border px-3 py-2.5"
              style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.025)' }}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }} />
                <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">{label}</span>
              </div>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={val}
                  initial={{ y: -6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 6, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="font-mono text-xs tabular-nums font-semibold"
                  style={{ color }}
                >
                  {prefix}{val.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* ── Live activity feed ── */}
        <div
          className="relative z-10 rounded-2xl border flex-1 flex flex-col overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.018)' }}
        >
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Live On-Chain Activity</p>
            <span className="text-[9px] font-mono text-green-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
              Streaming
            </span>
          </div>
          {/* Column headers */}
          <div className="grid grid-cols-3 px-4 py-1.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {['Event', 'Hash', 'Age'].map(h => (
              <span key={h} className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">{h}</span>
            ))}
          </div>
          {/* Rows */}
          <div className="flex flex-col divide-y overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            {LIVE_EVENTS.map((row, i) => (
              <motion.div
                key={row.hash}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.35 }}
                className="grid grid-cols-3 px-4 py-2 items-center"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-[9px] font-mono font-semibold" style={{ color: row.color }}>{row.event}</span>
                <span className="text-[9px] font-mono text-slate-600">{row.hash}</span>
                <span className="text-[9px] font-mono text-slate-700 text-right">{row.age}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="NETWORK: ETHEREUM MAINNET | STANDARD: ERC-721 | EVENTS: IMMUTABLE" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 03 — AI Oracle Verification (col-span-2, row 2)
// ═══════════════════════════════════════════════════════════════

function OracleCard() {
  const [hovered, setHovered] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const barInView = useInView(barRef, { once: true });

  const stats = [
    { label: 'Models Active',        val: '4 LLMs', color: '#818cf8' },
    { label: 'Scan Time',            val: '280ms',  color: '#34d399' },
    { label: 'Daily Checks',         val: '12,400', color: '#a78bfa' },
    { label: 'Avg Confidence',       val: '96.4%',  color: '#fbbf24' },
    { label: 'Counterfeits Blocked', val: '1,847',  color: '#f87171' },
    { label: 'Dataset Size',         val: '14.2M',  color: '#06b6d4' },
  ];

  return (
    <MagneticCard className="relative h-full cursor-default" intensity={6}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{ ...CARD_BASE, background: 'linear-gradient(140deg, rgba(25,20,55,0.18) 0%, rgba(10,10,10,0.97) 100%)' }}
      >
        <BorderBeam active={hovered} />

        {/* ── Header ── */}
        <div className="relative z-10 flex items-start gap-4 mb-6">
          <CardIcon
            Icon={Globe}
            bg="linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)"
            glow="0 0 28px rgba(99,102,241,0.35)"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-serif text-xl text-slate-100">AI Oracle Verification</h3>
              <CardBadge label="98.7% Accuracy" color="#818cf8" />
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Multi-model Vision Oracle cross-references submitted artifacts against 14M auction records — eliminating counterfeits before listing.
            </p>
          </div>
        </div>

        {/* ── Accuracy bar ── */}
        <div ref={barRef} className="relative z-10 mb-5">
          <div className="flex justify-between text-[9px] font-mono mb-2">
            <span className="text-slate-600 uppercase tracking-widest">Accuracy Score</span>
            <span style={{ color: '#818cf8' }}>98.7 / 100</span>
          </div>
          <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6366f1, #a78bfa, #c084fc)' }}
              initial={{ width: 0 }}
              animate={{ width: barInView ? '98.7%' : 0 }}
              transition={{ duration: 1.6, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* ── Stats mini-grid ── */}
        <div className="relative z-10 grid grid-cols-3 gap-3 mb-auto">
          {stats.map(({ label, val, color }) => (
            <div
              key={label}
              className="rounded-xl border px-3 py-2.5"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}
            >
              <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest mb-1">{label}</p>
              <p className="text-xs font-semibold font-mono" style={{ color }}>{val}</p>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="MODEL: VISION-LM-4 | DATASET: 14.2M RECORDS | PIPELINE: MULTI-STAGE | UPDATED: DAILY" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 04 — Instant Liquidity Pools (col-span-1, row 3)
// ═══════════════════════════════════════════════════════════════

function LiquidityCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <MagneticCard className="relative h-full cursor-default">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{
          ...CARD_BASE,
          background: 'linear-gradient(140deg, rgba(76,29,149,0.12) 0%, rgba(10,10,10,0.97) 100%)',
          borderLeft: '2.5px solid rgba(147,51,234,0.55)',
        }}
      >
        <BorderBeam active={hovered} />

        {/* Ghost number — watermarked, scales on hover */}
        <motion.span
          className="absolute top-3 right-5 font-serif font-bold leading-none select-none pointer-events-none"
          style={{ fontSize: '5.5rem', color: 'rgba(147,51,234,0.10)' }}
          animate={{ scale: hovered ? 1.12 : 1, opacity: hovered ? 0.22 : 0.10 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          04
        </motion.span>

        {/* ── Icon (pulsing rings on hover) ── */}
        <div className="relative w-12 h-12 mb-6">
          <CardIcon
            Icon={Zap}
            bg="linear-gradient(135deg, #7c3aed 0%, #9333ea 100%)"
            glow="0 0 28px rgba(147,51,234,0.35)"
          />
          {hovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-2xl border border-purple-500/40"
                animate={{ scale: [1, 1.7], opacity: [0.45, 0] }}
                transition={{ duration: 0.9, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-2xl border border-purple-400/20"
                animate={{ scale: [1, 2.2], opacity: [0.25, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: 0.25 }}
              />
            </>
          )}
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <h3 className="font-serif text-xl text-slate-100 mb-2">Instant Liquidity Pools</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-auto">
            Fractionalize ownership across hundreds of co-owners, enabling price discovery and exit liquidity for even the rarest assets.
          </p>

          {/* Fraction bar */}
          <div className="mt-5 mb-4">
            <div className="flex justify-between text-[9px] font-mono mb-1.5">
              <span className="text-slate-700 uppercase tracking-widest">Pool Fill</span>
              <span style={{ color: '#9333ea' }}>78%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: '78%', background: 'linear-gradient(90deg,#7c3aed,#a855f7)' }} />
            </div>
          </div>

          <CardBadge label="ERC-1155" color="#9333ea" />
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="MAX FRACTIONS: 10,000 | SETTLEMENT: INSTANT | STANDARD: ERC-1155" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 05 — NFC Twin Binding (col-span-1, row 3)
// ═══════════════════════════════════════════════════════════════

function NFCCard() {
  const [hovered, setHovered] = useState(false);

  return (
    <MagneticCard className="relative h-full cursor-default">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{
          ...CARD_BASE,
          background: 'linear-gradient(140deg, rgba(5,46,22,0.14) 0%, rgba(10,10,10,0.97) 100%)',
          borderLeft: '2.5px solid rgba(34,197,94,0.55)',
        }}
      >
        <BorderBeam active={hovered} />

        {/* Ghost number */}
        <span
          className="absolute top-3 right-5 font-serif font-bold leading-none select-none pointer-events-none"
          style={{ fontSize: '5.5rem', color: 'rgba(34,197,94,0.09)' }}
        >
          05
        </span>

        <div className="relative z-10 mb-6">
          <CardIcon
            Icon={Lock}
            bg="linear-gradient(135deg, #15803d 0%, #22c55e 100%)"
            glow="0 0 28px rgba(34,197,94,0.35)"
          />
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <h3 className="font-serif text-xl text-slate-100 mb-2">NFC Twin Binding</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            Military-grade NFC microchips embedded into every artifact, permanently binding the digital twin to its physical counterpart.
          </p>

          {/* Scan zone */}
          <div
            className="relative rounded-2xl border h-[72px] flex items-center justify-center mb-4 overflow-hidden"
            style={{ borderColor: 'rgba(34,197,94,0.18)', background: 'rgba(34,197,94,0.03)' }}
          >
            <ShieldCheck className="w-9 h-9 text-green-400/15" />

            {hovered && (
              <>
                {/* Corner brackets */}
                {[
                  'top-2 left-2 border-t-2 border-l-2 rounded-tl',
                  'top-2 right-2 border-t-2 border-r-2 rounded-tr',
                  'bottom-2 left-2 border-b-2 border-l-2 rounded-bl',
                  'bottom-2 right-2 border-b-2 border-r-2 rounded-br',
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-4 h-4 border-green-400/60 ${cls}`} />
                ))}
                <motion.div
                  className="absolute left-3 right-3 h-[1.5px]"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.85), transparent)' }}
                  initial={{ top: '12%' }}
                  animate={{ top: ['12%', '85%', '12%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <p className="absolute bottom-1.5 right-3 text-[8px] font-mono text-green-400/60 uppercase tracking-widest">
                  Scanning…
                </p>
              </>
            )}
          </div>

          <CardBadge label="Tamper-Proof" color="#22c55e" />
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="CHIP: ISO 14443-A | ENCRYPTION: AES-256 | BINDING: PERMANENT" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// CARD 06 — Escrow Settlement (col-span-1, row 3)
// ═══════════════════════════════════════════════════════════════

function EscrowCard() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [hovered, setHovered] = useState(false);

  const R  = 22;
  const C  = 2 * Math.PI * R;

  return (
    <MagneticCard className="relative h-full cursor-default">
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative h-full flex flex-col p-8 overflow-hidden"
        style={{
          ...CARD_BASE,
          background: 'linear-gradient(140deg, rgba(78,49,4,0.13) 0%, rgba(10,10,10,0.97) 100%)',
          borderLeft: '2.5px solid rgba(245,158,11,0.55)',
        }}
      >
        <BorderBeam active={hovered} />

        {/* Ghost number */}
        <span
          className="absolute top-3 right-5 font-serif font-bold leading-none select-none pointer-events-none"
          style={{ fontSize: '5.5rem', color: 'rgba(245,158,11,0.09)' }}
        >
          06
        </span>

        {/* ── SVG progress ring + icon ── */}
        <div className="relative w-12 h-12 mb-6">
          <svg className="absolute inset-0 w-12 h-12 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(245,158,11,0.10)" strokeWidth="3" />
            <motion.circle
              cx="28" cy="28" r={R}
              fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: inView ? 0 : C }}
              transition={{ duration: 2.4, delay: 0.4, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <CardIcon
              Icon={Clock}
              bg="transparent"
              glow="none"
            />
          </div>
        </div>

        <div className="relative z-10 flex flex-col flex-1">
          <h3 className="font-serif text-xl text-slate-100 mb-2">Escrow Settlement</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-auto">
            All purchases route through a time-locked smart contract escrow — funds release only after vault confirmation of physical custody transfer.
          </p>

          {/* Linear progress bar */}
          <div className="mt-5 mb-4">
            <div className="flex justify-between text-[9px] font-mono mb-1.5">
              <span className="text-slate-700 uppercase tracking-widest">Settlement Progress</span>
              <span style={{ color: '#f59e0b' }}>100%</span>
            </div>
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg,#d97706,#f59e0b,#fcd34d)' }}
                initial={{ width: 0 }}
                animate={{ width: inView ? '100%' : 0 }}
                transition={{ duration: 2.6, delay: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>

          <CardBadge label="<48hr Settlement" color="#f59e0b" />
        </div>

        {/* ── Footer ── */}
        <div className="mt-5 pt-4 border-t border-white/[0.04]">
          <CardMeta text="TIMELOCK: 48HR MAX | CHAIN: ETHEREUM | AUDIT: CERTIK | INSURED" />
        </div>
      </div>
    </MagneticCard>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════

export default function TrustStack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-28 overflow-hidden"
      style={{ background: '#080808' }}
    >
      <MeshBackground />

      <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] relative z-10">

        {/* ── Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end gap-6 mb-14"
        >
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span className="text-xs uppercase tracking-[0.22em] text-indigo-400 font-mono">Why Aura</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-serif text-slate-50 leading-tight">
              Built for{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{ WebkitBackgroundClip: 'text', backgroundImage: GOLD_GRADIENT }}
              >
                Institutional
              </span>{' '}
              Trust
            </h2>
          </div>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm md:text-right">
            Every architectural decision at Aura is designed for collectors, estate managers,
            and institutional investors who demand provenance certainty.
          </p>
        </motion.div>

        {/* ══════════════════════════════════════════
            TRUE BENTO GRID
            Desktop 3-col:
              [Custody  2-col row-1] [Provenance 1-col row-1+2]
              [Oracle   2-col row-2] [Provenance ↑]
              [Liq] [NFC] [Escrow]  row-3

            Tablet: 2-col
            Mobile: 1-col
        ══════════════════════════════════════════ */}
        <motion.div
          variants={containerV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* ── Row 1+2 left: Custody (lg:col-span-2, row 1) ── */}
          <motion.div
            variants={cardV}
            className="lg:col-span-2 lg:row-start-1"
          >
            <CustodyCard />
          </motion.div>

          {/* ── Provenance: tall card — right column, spans rows 1 + 2 ── */}
          <motion.div
            variants={cardV}
            className="lg:col-start-3 lg:row-start-1 lg:row-span-2"
          >
            <ProvenanceCard />
          </motion.div>

          {/* ── Row 2 left: Oracle (lg:col-span-2) ── */}
          <motion.div
            variants={cardV}
            className="lg:col-span-2 lg:row-start-2"
          >
            <OracleCard />
          </motion.div>

          {/* ── Row 3: three equal cards ── */}
          <motion.div variants={cardV} className="lg:row-start-3">
            <LiquidityCard />
          </motion.div>
          <motion.div variants={cardV} className="lg:row-start-3">
            <NFCCard />
          </motion.div>
          <motion.div variants={cardV} className="lg:row-start-3">
            <EscrowCard />
          </motion.div>
        </motion.div>

        {/* ── System Status Footer ── */}
        <motion.div
          variants={cardV}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/[0.06] px-6 py-4"
          style={{ background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">All Systems Operational</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {[
              { label: 'Vault Network', val: '99.98% Uptime' },
              { label: 'Oracle API',    val: '18ms Latency'  },
              { label: 'Chain Sync',    val: 'Real-time'     },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center gap-2 text-[10px] font-mono">
                <span className="text-slate-700">{label}:</span>
                <span className="text-slate-400">{val}</span>
              </div>
            ))}
          </div>
          <span className="text-[9px] font-mono text-slate-700 uppercase tracking-widest">
            PROTOCOL v3.2.1 · AUDIT: CERTIK · SOC2 TYPE II
          </span>
        </motion.div>

      </div>
    </section>
  );
}
