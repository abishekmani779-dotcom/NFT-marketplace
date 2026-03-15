import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, CheckCircle, XCircle, Search, FileText,
  AlertTriangle, Activity, Vault, Scan, X, Award,
  TrendingUp, Cpu, Globe, Zap, Eye, Clock, ArrowRight,
  ChevronRight, Shield, Database, BarChart3, Layers,
  Lock, Unlock, RefreshCw, CheckSquare, Hash
} from 'lucide-react';
import { systemHealth } from '../lib/mockRegistry';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

/* ─── Data ──────────────────────────────────────────────────────── */
const pendingApprovals = [
  {
    id: 'sub-089',
    sellerId: '0x4f...9c21',
    title: 'Edo Period Katana',
    category: 'Militaria',
    era: 'Edo Period (1603–1867)',
    trustScore: 88,
    submittedAt: '2026-03-12',
    status: 'pending',
    riskFlags: [],
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=600&auto=format&fit=crop',
    metadata: {
      submitted: { material: 'Tamahagane Steel', weight: '1.2 kg', era: 'Edo Period (1603-1867)' },
      oracleDB:  { material: 'Tamahagane Steel', weight: '1.2 kg', era: 'Edo Period (1603-1867)' },
    },
    similarityScore: 98,
    blockchainTx: '0x82f3a...a91c',
    oracleNode: 'Node-Alpha-7',
    vaultLocation: 'Tokyo Fine Storage, JP, Wing B',
    aiConfidence: 96,
    provenance: ['Artcurial Paris 2019', 'Private Collection (30yr)', 'Edo Heritage Trust'],
  },
  {
    id: 'sub-090',
    sellerId: '0x7a...11b2',
    title: 'Victorian Emerald Brooch',
    category: 'Jewelry',
    era: 'Victorian (1837–1901)',
    trustScore: 45,
    submittedAt: '2026-03-11',
    status: 'review_required',
    riskFlags: ['AI Vision: Cut inconsistency', 'Metadata: Weight mismatch'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop',
    metadata: {
      submitted: { material: 'Gold & Emerald', weight: '24g', era: 'Victorian' },
      oracleDB:  { material: 'Gold & Emerald', weight: '32g (Expected)', era: 'Victorian' },
    },
    similarityScore: 62,
    blockchainTx: '0x19c4b...f33a',
    oracleNode: 'Node-Beta-3',
    vaultLocation: 'Geneva Free-port, CH, Unit 12A',
    aiConfidence: 41,
    provenance: ['Sotheby\'s London 2012', 'Unknown Intermediary'],
  },
  {
    id: 'sub-091',
    sellerId: '0x1b...99f0',
    title: 'Hellenistic Silver Coin',
    category: 'Numismatics',
    era: 'Hellenistic (323–31 BC)',
    trustScore: 95,
    submittedAt: '2026-03-10',
    status: 'pending',
    riskFlags: [],
    image: 'https://images.unsplash.com/photo-1601042732009-db9713aa67bd?q=80&w=600&auto=format&fit=crop',
    metadata: {
      submitted: { material: 'Silver', weight: '4g', era: 'Hellenistic' },
      oracleDB:  { material: 'Silver', weight: '4g', era: 'Hellenistic' },
    },
    similarityScore: 99,
    blockchainTx: '0xa71de...cc52',
    oracleNode: 'Node-Gamma-1',
    vaultLocation: 'Geneva Free-port, CH, Unit 4B',
    aiConfidence: 99,
    provenance: ['British Museum Authentication 2024', 'Numismatic Society of London'],
  },
  {
    id: 'sub-092',
    sellerId: '0x3c...44a1',
    title: 'Ming Dynasty Blue & White Vase',
    category: 'Ceramics',
    era: '15th Century',
    trustScore: 72,
    submittedAt: '2026-03-09',
    status: 'pending',
    riskFlags: ['AI Vision: Glaze pattern variation'],
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop',
    metadata: {
      submitted: { material: 'Porcelain', weight: '3.8 kg', era: '15th Century' },
      oracleDB:  { material: 'Porcelain', weight: '3.8 kg', era: '15th Century' },
    },
    similarityScore: 81,
    blockchainTx: '0xf88ba...110c',
    oracleNode: 'Node-Delta-2',
    vaultLocation: 'Hong Kong Freeport, HK, Bay 7',
    aiConfidence: 78,
    provenance: ['Christie\'s HK 2021', 'Imperial Collection'],
  },
];

type Asset = typeof pendingApprovals[0];

/* ─── Score Ring Component ───────────────────────────────────────── */
function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#ef4444';
  const glow  = score >= 80 ? 'rgba(34,197,94,0.25)' : score >= 60 ? 'rgba(234,179,8,0.25)' : 'rgba(239,68,68,0.25)';
  const bg    = score >= 80 ? 'rgba(34,197,94,0.08)' : score >= 60 ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)';

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} stroke="#1e1e2a" strokeWidth={6} fill={bg} />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          stroke={color}
          strokeWidth={6}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - (circ * score) / 100 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

/* ─── Status Badge ───────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  if (status === 'review_required') {
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-red-500/10 text-red-400 border border-red-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
        Flagged
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/25">
      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse inline-block" />
      Pending
    </span>
  );
}

/* ─── Live Ticker ────────────────────────────────────────────────── */
function LiveTicker() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      {time.toUTCString().slice(17, 25)} UTC
    </span>
  );
}

/* ─── Deep Dive Popup ────────────────────────────────────────────── */
function DeepDiveModal({ asset, onClose, onApprove, onReject }: {
  asset: Asset;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  const [sealed, setSealed] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'metadata' | 'provenance'>('overview');

  const handleApprove = () => {
    setSealed(true);
    setTimeout(() => { setSealed(false); onApprove(); }, 2800);
  };

  const r = 54;
  const circ = 2 * Math.PI * r;
  const simColor = asset.similarityScore >= 80 ? '#22c55e' : asset.similarityScore >= 60 ? '#eab308' : '#ef4444';

  const tabs = [
    { id: 'overview',   label: 'Overview',   icon: Eye },
    { id: 'metadata',   label: 'Metadata',   icon: Database },
    { id: 'provenance', label: 'Provenance', icon: Layers },
  ] as const;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-obsidian-700/80 bg-obsidian-950 shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 40 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        {/* Top glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent" />

        {/* Header */}
        <div className="relative px-8 pt-8 pb-6 border-b border-obsidian-800/60">
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)' }}
          />
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-5">
              {/* Asset thumbnail */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-16 h-16 rounded-xl overflow-hidden border border-obsidian-700 shrink-0 shadow-lg"
              >
                <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" />
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <Scan className="w-4 h-4 text-gold-500" />
                  <span className="text-xs font-mono uppercase tracking-widest text-gold-500/70">Oracle Deep Dive</span>
                  <StatusBadge status={asset.status} />
                </div>
                <h2 className="text-2xl font-serif text-slate-50">{asset.title}</h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs font-mono text-slate-500">#{asset.id}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs text-slate-500">{asset.era}</span>
                  <span className="text-slate-700">·</span>
                  <span className="text-xs font-mono text-slate-500">{asset.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ScoreRing score={asset.trustScore} size={64} />
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-obsidian-700 bg-obsidian-900 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-obsidian-600 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? 'text-gold-400 bg-gold-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-obsidian-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
                {activeTab === id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-lg border border-gold-500/20 bg-gold-500/5"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {/* ── Overview Tab ── */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Top row: Scores + Oracle info */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Similarity Ring */}
                  <div className="col-span-1 bg-obsidian-900/60 border border-obsidian-800 rounded-xl p-5 flex flex-col items-center gap-3">
                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">Image Similarity</p>
                    <div className="relative">
                      <svg width={120} height={120} style={{ transform: 'rotate(-90deg)' }}>
                        <circle cx={60} cy={60} r={r} stroke="#1e1e2a" strokeWidth={8} fill="transparent" />
                        <motion.circle
                          cx={60} cy={60} r={r}
                          stroke={simColor}
                          strokeWidth={8}
                          fill="transparent"
                          strokeLinecap="round"
                          strokeDasharray={circ}
                          initial={{ strokeDashoffset: circ }}
                          animate={{ strokeDashoffset: circ - (circ * asset.similarityScore) / 100 }}
                          transition={{ duration: 1.6, ease: 'easeOut' }}
                          style={{ filter: `drop-shadow(0 0 8px ${simColor}55)` }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold" style={{ color: simColor }}>{asset.similarityScore}%</span>
                        <span className="text-[10px] text-slate-500 font-mono">match</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 text-center">Registry artifact match</p>
                  </div>

                  {/* Oracle Info */}
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    {[
                      { icon: Cpu, label: 'Oracle Node', value: asset.oracleNode, color: 'text-blue-400' },
                      { icon: Globe, label: 'Vault Location', value: asset.vaultLocation, color: 'text-cyan-400', small: true },
                      { icon: Hash, label: 'Blockchain Tx', value: asset.blockchainTx, color: 'text-purple-400', mono: true },
                      { icon: Zap, label: 'AI Confidence', value: `${asset.aiConfidence}%`, color: asset.aiConfidence >= 80 ? 'text-emerald-400' : asset.aiConfidence >= 60 ? 'text-gold-400' : 'text-red-400' },
                    ].map(({ icon: Icon, label, value, color, small, mono }) => (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-obsidian-900/60 border border-obsidian-800 rounded-xl p-4"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">{label}</span>
                        </div>
                        <p className={`font-semibold ${color} ${small ? 'text-[11px]' : 'text-sm'} ${mono ? 'font-mono' : ''} leading-snug`}>{value}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Risk Flags */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-3 flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5" /> Risk Assessment
                  </p>
                  {asset.riskFlags.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                    >
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-400">No discrepancies detected</p>
                        <p className="text-xs text-slate-500 mt-0.5">Oracle Engine v4.2 — All checks passed</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-2">
                      {asset.riskFlags.map((flag, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-red-400">{flag}</p>
                            <p className="text-xs text-slate-500 mt-0.5">Detected by Vision + Metadata Oracle</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── Metadata Tab ── */}
            {activeTab === 'metadata' && (
              <motion.div
                key="metadata"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-4 flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" /> Cross-Reference Validation
                </p>
                <div className="rounded-xl border border-obsidian-700 overflow-hidden">
                  <div className="grid grid-cols-3 bg-obsidian-900 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 border-b border-obsidian-800">
                    <div>Field</div>
                    <div>Submitted</div>
                    <div>Oracle DB</div>
                  </div>
                  <div className="divide-y divide-obsidian-800/50">
                    {Object.keys(asset.metadata.submitted).map((key, i) => {
                      const subVal  = asset.metadata.submitted[key as keyof typeof asset.metadata.submitted];
                      const oracVal = asset.metadata.oracleDB[key as keyof typeof asset.metadata.oracleDB];
                      const mismatch = subVal !== oracVal;
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className={`grid grid-cols-3 px-5 py-4 text-sm ${mismatch ? 'bg-red-950/20' : 'hover:bg-obsidian-900/40'} transition-colors`}
                        >
                          <div className="capitalize font-mono text-xs text-slate-400">{key}</div>
                          <div className={`font-medium flex items-center gap-2 ${mismatch ? 'text-red-400' : 'text-slate-200'}`}>
                            {mismatch && <AlertTriangle className="w-3 h-3 shrink-0 text-red-400" />}
                            {subVal}
                          </div>
                          <div className="text-slate-200">{oracVal}</div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Hash verification */}
                <div className="mt-4 p-4 rounded-xl border border-obsidian-800 bg-obsidian-900/40">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-2">Document Hash</p>
                  <p className="font-mono text-xs text-gold-400/70 break-all">
                    0x8a3f2d...e1c9b4a2f07d3e8a1c5b9e4d2f8c6a3b7e0f1d2a5c8b...
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Provenance Tab ── */}
            {activeTab === 'provenance' && (
              <motion.div
                key="provenance"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
              >
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-4 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5" /> Ownership Chain
                </p>
                <div className="relative pl-4">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-gold-500/40 via-obsidian-700 to-transparent" />

                  <div className="space-y-4">
                    {asset.provenance.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-4 relative"
                      >
                        <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 z-10 ${
                          i === 0 ? 'bg-gold-500 border-gold-400' : 'bg-obsidian-900 border-obsidian-600'
                        }`}>
                          {i === 0
                            ? <CheckSquare className="w-3 h-3 text-obsidian-950" />
                            : <Clock className="w-3 h-3 text-slate-500" />
                          }
                        </div>
                        <div className="flex-1 bg-obsidian-900/60 border border-obsidian-800 rounded-xl px-4 py-3">
                          <p className="text-sm text-slate-200 font-medium">{entry}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">Verified chain link {i + 1}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="relative px-8 py-6 border-t border-obsidian-800/60">
          {/* Approval success overlay */}
          <AnimatePresence>
            {sealed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-obsidian-950/95 backdrop-blur-sm rounded-b-2xl"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.6)]"
                >
                  <Award className="w-8 h-8 text-obsidian-950" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-serif text-gold-400"
                >
                  Authenticity Sealed
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-xs text-slate-500 font-mono"
                >
                  Asset recorded on-chain · {asset.blockchainTx}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-slate-500">Submitted {asset.submittedAt} · Seller: <span className="font-mono text-slate-400">{asset.sellerId}</span></p>
            </div>
            <button
              onClick={onReject}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-900/50 bg-red-950/20 text-red-400 text-sm font-medium hover:bg-red-950/40 hover:border-red-700/50 transition-all"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <motion.button
              onClick={handleApprove}
              whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(212,175,55,0.4)' }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all"
            >
              <Lock className="w-4 h-4" />
              Seal & Vault
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Stat Card ──────────────────────────────────────────────────── */
function StatCard({
  icon: Icon, label, value, sub, color, delay = 0,
}: {
  icon: React.ElementType; label: string; value: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45 }}
      className="relative vault-glass rounded-2xl p-6 border border-obsidian-800 overflow-hidden group hover:border-obsidian-700 transition-colors"
    >
      {/* Glow */}
      <div className={`absolute -right-6 -top-6 w-28 h-28 rounded-full blur-[30px] pointer-events-none transition-opacity duration-500 opacity-40 group-hover:opacity-70 ${color.replace('text-', 'bg-').split(' ')[0]}/10`} />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3">{label}</p>
          <p className={`text-3xl font-serif ${color}`}>{value}</p>
          {sub && <p className="text-xs text-slate-600 font-mono mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${color.includes('gold') ? 'bg-gold-500/10 border-gold-500/20' : color.includes('red') ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-500/10 border-slate-500/20'}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────── */
export default function AdminDashboard() {
  const [selected, setSelected] = useState<Asset | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'clean'>('all');

  const filtered = pendingApprovals.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                        a.sellerId.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'flagged' ? a.riskFlags.length > 0 : a.riskFlags.length === 0;
    return matchSearch && matchFilter;
  });

  return (
    <PageTransition>
      {/* Page bg accent */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] bg-gold-600/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-800/4 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-6 py-10">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 border border-gold-500/30 flex items-center justify-center">
                <Activity className="w-4.5 h-4.5 text-gold-500 w-[18px] h-[18px]" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500/70">Oracle System</span>
              <LiveTicker />
            </div>
            <h1 className="text-4xl font-serif text-slate-50 tracking-tight">
              Command Center
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage RWA pipeline · Review AI risk flags · Monitor protocol health</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter pills */}
            <div className="flex items-center gap-1 bg-obsidian-900 border border-obsidian-700 rounded-xl p-1">
              {(['all', 'flagged', 'clean'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                    filter === f
                      ? f === 'flagged' ? 'bg-red-500/20 text-red-400 border border-red-500/25'
                        : f === 'clean' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/25'
                        : 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search artifacts..."
                className="w-full bg-obsidian-900 border border-obsidian-700/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 text-slate-100 placeholder-slate-600 font-sans transition-all"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <StatCard icon={Vault}         label="Total Vaulted Items"  value={String(systemHealth.tvlItems)}  sub="Active protocol assets"     color="text-slate-100"   delay={0.05} />
          <StatCard icon={TrendingUp}    label="Total Value Locked"   value={`${systemHealth.tvlETH.toLocaleString()} ETH`} sub="~$48.2M USD"  color="text-gold-400"    delay={0.10} />
          <StatCard icon={ShieldAlert}   label="Active Anomalies"     value={String(systemHealth.anomaliesDetected)} sub="Requires attention"   color="text-red-400"     delay={0.15} />
        </div>

        {/* ── Pipeline Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="vault-glass rounded-2xl border border-obsidian-800 overflow-hidden shadow-2xl"
        >
          {/* Table header */}
          <div className="px-7 py-5 border-b border-obsidian-800/60 flex items-center justify-between bg-gradient-to-r from-obsidian-900/80 to-transparent">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4 text-gold-500/70" />
              <span className="text-sm font-semibold text-slate-300">Pending Approval Pipeline</span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              <RefreshCw className="w-3 h-3" /> Auto-refresh 30s
            </div>
          </div>

          {/* Column labels */}
          <div className="grid grid-cols-12 gap-4 px-7 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-obsidian-950/40 border-b border-obsidian-800/30">
            <div className="col-span-4">Artifact & Submitter</div>
            <div className="col-span-2 text-center">Trust Score</div>
            <div className="col-span-4">Risk Intelligence</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-obsidian-800/30">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-500 text-sm">No artifacts match</div>
            ) : (
              filtered.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.07 }}
                  className="grid grid-cols-12 gap-4 px-7 py-5 items-center hover:bg-obsidian-900/30 transition-all group cursor-pointer"
                >
                  {/* Asset */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-obsidian-700 shrink-0 shadow-md">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div>
                      <p className="font-serif text-base text-slate-100 group-hover:text-gold-400 transition-colors leading-snug mb-1">{item.title}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={item.status} />
                        <span className="font-mono text-[10px] text-slate-600">{item.sellerId}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-700 mt-0.5 block">{item.submittedAt}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-2 flex justify-center">
                    <ScoreRing score={item.trustScore} size={52} />
                  </div>

                  {/* Risk */}
                  <div className="col-span-4 flex flex-col gap-2">
                    {item.riskFlags.length === 0 ? (
                      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-xs text-emerald-400/80 font-mono">All checks passed</span>
                      </div>
                    ) : (
                      item.riskFlags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/5 border border-red-500/15">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span className="text-xs text-red-400 font-mono">{flag}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Action */}
                  <div className="col-span-2 flex justify-end">
                    <motion.button
                      onClick={() => setSelected(item)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold-500/10 border border-gold-500/25 text-gold-400 text-xs font-semibold hover:bg-gold-500/20 hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Deep Dive
                      <ChevronRight className="w-3 h-3" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Deep Dive Popup ── */}
      <AnimatePresence>
        {selected && (
          <DeepDiveModal
            asset={selected}
            onClose={() => setSelected(null)}
            onApprove={() => setSelected(null)}
            onReject={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
