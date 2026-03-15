import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Camera, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck,
  DollarSign, Fingerprint, Box, MapPin, Scale, Loader2, Zap,
  ExternalLink, Copy, X, ClipboardCheck, Upload, ImageIcon,
  Trash2, Eye, Globe, Lock, Award, Hash, Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

/* ─── Mint Modal ──────────────────────────────────────────────────── */
type MintStage = 'idle' | 'signing' | 'broadcasting' | 'confirming' | 'success';

const MOCK_TX_HASH = '0x4f9a2b3c1d8e7f06a5b4c3d2e1f09876543210abcdef1234567890abcdef1234';
const MOCK_TOKEN_ID = `#${Math.floor(Math.random() * 9000 + 1000)}`;

const STAGES: { key: MintStage; label: string; desc: string }[] = [
  { key: 'signing',      label: 'Awaiting Signature',     desc: 'Sign the transaction in your wallet…' },
  { key: 'broadcasting', label: 'Broadcasting to Network', desc: 'Propagating tx to Ethereum nodes…' },
  { key: 'confirming',   label: 'Block Confirmation',      desc: 'Waiting for 3 block confirmations…' },
  { key: 'success',      label: 'Minted Successfully',     desc: 'Your artifact is now on-chain!' },
];

function MintModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState<MintStage>('idle');
  const [blocks, setBlocks] = useState(0);
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    if (!isOpen) { setStage('idle'); setBlocks(0); return; }
    setStage('signing');
    const t1 = setTimeout(() => setStage('broadcasting'), 1800);
    const t2 = setTimeout(() => setStage('confirming'),   3400);
    let b = 0;
    const iv = setInterval(() => { if (b < 3) { b++; setBlocks(b); } }, 700);
    const t3 = setTimeout(() => { setStage('success'); clearInterval(iv); }, 5800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(iv); };
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) { document.body.style.overflow = 'hidden'; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const stageIdx  = STAGES.findIndex(s => s.key === stage);
  const isComplete = stage === 'success';

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian-950/90 backdrop-blur-md"
            onClick={isComplete ? onClose : undefined} />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-[460px] bg-obsidian-950 border border-obsidian-700 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
          >
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gold-500/4 blur-[40px] pointer-events-none" />

            <div className="p-7">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isComplete ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-obsidian-800 border border-obsidian-700'}`}>
                    {isComplete ? <Award className="w-4 h-4 text-gold-400" /> : <Zap className="w-4 h-4 text-gold-400 animate-pulse" />}
                  </div>
                  <div>
                    <h2 className="text-lg font-serif text-slate-50">{isComplete ? 'Artifact Minted!' : 'Minting to Vault…'}</h2>
                    <p className="text-[10px] text-slate-500 font-mono">{isComplete ? 'Your RWA token is live on-chain.' : 'Do not close this window.'}</p>
                  </div>
                </div>
                {isComplete && (
                  <button onClick={onClose} className="w-8 h-8 rounded-lg bg-obsidian-800 hover:bg-obsidian-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-1.5 mb-7">
                {STAGES.map((s, i) => (
                  <div key={s.key} className={cn(
                    'flex-1 h-1 rounded-full transition-all duration-500',
                    i < stageIdx || isComplete ? 'bg-gold-500' : i === stageIdx ? 'bg-gold-500/50 animate-pulse' : 'bg-obsidian-800'
                  )} />
                ))}
              </div>

              {/* Stage cards */}
              <div className="space-y-2.5 mb-6">
                {STAGES.map((s, i) => {
                  const done   = i < stageIdx || isComplete;
                  const active = i === stageIdx && !isComplete;
                  return (
                    <motion.div key={s.key}
                      animate={{ opacity: active ? 1 : done ? 0.9 : 0.35, y: 0 }}
                      className={cn('flex items-center gap-4 px-4 py-3 rounded-xl border transition-all duration-300',
                        done   ? 'bg-gold-900/10 border-gold-500/20'
                        : active ? 'bg-obsidian-900 border-gold-500/20 shadow-[0_0_16px_rgba(212,175,55,0.08)]'
                        : 'bg-obsidian-900/40 border-obsidian-800'
                      )}>
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', done ? 'bg-gold-500/20' : active ? 'bg-obsidian-800' : 'bg-obsidian-900')}>
                        {done   ? <CheckCircle2 className="w-4 h-4 text-gold-400" />
                         : active ? <Loader2 className="w-4 h-4 text-gold-400 animate-spin" />
                         : <div className="w-2 h-2 rounded-full bg-obsidian-600" />}
                      </div>
                      <div className="flex-1">
                        <p className={cn('text-sm font-semibold', done ? 'text-gold-400' : active ? 'text-slate-200' : 'text-slate-600')}>{s.label}</p>
                        {active && <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>}
                        {s.key === 'confirming' && active && (
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {[1,2,3].map(b => <div key={b} className={cn('w-4 h-1.5 rounded-full transition-all', blocks >= b ? 'bg-emerald-400' : 'bg-obsidian-700')} />)}
                            <span className="text-[10px] font-mono text-slate-500">{blocks}/3 blocks</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <AnimatePresence>
                {isComplete && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-obsidian-900 border border-gold-500/20 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div><p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Token ID</p><p className="text-2xl font-serif text-gold-400 mt-0.5">{MOCK_TOKEN_ID}</p></div>
                      <div className="text-right"><p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Standard</p><p className="text-sm text-slate-200 font-mono mt-0.5">ERC-721</p></div>
                    </div>
                    <div className="bg-obsidian-950 border border-obsidian-800 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-400 truncate">{MOCK_TX_HASH.slice(0,20)}…{MOCK_TX_HASH.slice(-8)}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => { navigator.clipboard.writeText(MOCK_TX_HASH); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="w-6 h-6 rounded-md bg-obsidian-800 flex items-center justify-center transition-colors">
                          {copied ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-500" />}
                        </button>
                        <button className="w-6 h-6 rounded-md bg-obsidian-800 flex items-center justify-center transition-colors"><ExternalLink className="w-3 h-3 text-slate-500" /></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" /><span className="text-[11px] font-mono text-slate-400">Confirmed · Ethereum Mainnet · 3 blocks</span></div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <ClipboardCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">Pending Admin Approval</span>
                      </div>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => { onClose(); navigate('/admin'); }}
                        className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                        <Zap className="w-4 h-4" /> Go to Admin for Approval
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─── Image Upload Zone ───────────────────────────────────────────── */
function ImageUploadZone({ images, onAdd, onRemove }: {
  images: { file: File; url: string }[];
  onAdd: (files: File[]) => void;
  onRemove: (i: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const valid = Array.from(files).filter(f => f.type.startsWith('image/'));
    onAdd(valid);
  }, [onAdd]);

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <motion.div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        animate={{ borderColor: drag ? 'rgba(212,175,55,0.6)' : 'rgba(255,255,255,0.08)', scale: drag ? 1.01 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 bg-obsidian-900/40 hover:bg-obsidian-900/60 transition-colors group overflow-hidden"
        style={{ minHeight: 180 }}
      >
        {/* Animated glow on drag */}
        <AnimatePresence>
          {drag && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gold-500/5 pointer-events-none" />
          )}
        </AnimatePresence>

        <motion.div
          animate={{ y: drag ? -4 : 0 }}
          className="w-14 h-14 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center group-hover:border-gold-500/30 transition-colors"
        >
          <Upload className="w-6 h-6 text-slate-500 group-hover:text-gold-400 transition-colors" />
        </motion.div>

        <div className="text-center">
          <p className="text-sm font-semibold text-slate-300 group-hover:text-slate-100 transition-colors">
            {drag ? 'Drop images here' : 'Drag & drop artifact images'}
          </p>
          <p className="text-xs text-slate-600 mt-1">or <span className="text-gold-400 underline underline-offset-2">browse files</span> · JPG, PNG, WEBP</p>
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />
      </motion.div>

      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <motion.div key={img.url} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }}
              className="relative group rounded-xl overflow-hidden border border-obsidian-700 aspect-square bg-obsidian-900"
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => setPreview(img.url)} className="w-7 h-7 rounded-lg bg-obsidian-900 border border-obsidian-700 flex items-center justify-center text-gold-400 hover:bg-obsidian-800 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => onRemove(i)} className="w-7 h-7 rounded-lg bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-400 hover:bg-red-950 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {i === 0 && (
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-gold-500 text-obsidian-950 uppercase tracking-wider">Cover</div>
              )}
            </motion.div>
          ))}
          {/* Add more */}
          <motion.div whileHover={{ scale: 1.02 }} onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-obsidian-700 flex items-center justify-center cursor-pointer hover:border-gold-500/40 hover:bg-obsidian-900/40 transition-all"
          >
            <ImageIcon className="w-5 h-5 text-slate-600" />
          </motion.div>
        </div>
      )}

      {/* Fullscreen preview */}
      <AnimatePresence>
        {preview && createPortal(
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-obsidian-950/95 backdrop-blur-lg p-8"
            onClick={() => setPreview(null)}
          >
            <motion.img initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
              src={preview} alt="" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
            <button onClick={() => setPreview(null)} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-obsidian-900 border border-obsidian-700 flex items-center justify-center text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Styled input ────────────────────────────────────────────────── */
function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-slate-600">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full bg-obsidian-900 border border-obsidian-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all font-mono";

/* ─── Step Nav Pills ──────────────────────────────────────────────── */
const STEPS = [
  { num: 1, title: 'Identity',    icon: Fingerprint },
  { num: 2, title: 'Asset Info',  icon: Camera },
  { num: 3, title: 'Logistics',   icon: MapPin },
  { num: 4, title: 'Financials',  icon: DollarSign },
];

/* ─── Main Page ───────────────────────────────────────────────────── */
export default function SubmitAsset() {
  const [step, setStep]             = useState(1);
  const [fractionalize, setFractionalize] = useState(false);
  const [kycStatus, setKycStatus]   = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [isMintOpen, setIsMintOpen] = useState(false);

  /* Form state */
  const [assetName,    setAssetName]    = useState('');
  const [category,     setCategory]     = useState('');
  const [era,          setEra]          = useState('');
  const [material,     setMaterial]     = useState('');
  const [weight,       setWeight]       = useState('');
  const [condition,    setCondition]    = useState('');
  const [description,  setDescription]  = useState('');
  const [images,       setImages]       = useState<{ file: File; url: string }[]>([]);
  const [vault,        setVault]        = useState('');
  const [price,        setPrice]        = useState('');
  const [royalty,      setRoyalty]      = useState('5');
  const [fractions,    setFractions]    = useState('1000');

  const handleAddImages = useCallback((files: File[]) => {
    const newImgs = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setImages(prev => [...prev, ...newImgs].slice(0, 8));
  }, []);

  const handleRemoveImage = useCallback((i: number) => {
    setImages(prev => { URL.revokeObjectURL(prev[i].url); return prev.filter((_, idx) => idx !== i); });
  }, []);

  const handleKycScan = () => {
    setKycStatus('scanning');
    setTimeout(() => setKycStatus('verified'), 2200);
  };

  const canNext = step === 1 ? kycStatus === 'verified' : true;

  /* Cover image preview for sidebar */
  const coverImg = images[0]?.url;

  return (
    <PageTransition>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[40vw] h-[40vw] bg-gold-600/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-900/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-6 py-12">

        {/* ── Header ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/5 border border-gold-500/30 flex items-center justify-center">
              <Zap className="w-[18px] h-[18px] text-gold-500" />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-500/70">Minting Protocol</span>
          </div>
          <h1 className="text-4xl font-serif text-slate-50 tracking-tight">Mint Artifact to Vault</h1>
          <p className="text-slate-500 text-sm mt-2 max-w-lg">Initialize a new RWA token by completing the four-stage secure onboarding protocol.</p>
        </motion.div>

        {/* ── Step bar ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="relative mb-12 flex justify-between">
          <div className="absolute top-6 left-0 w-full h-0.5 bg-obsidian-800 -z-10" />
          <div className="absolute top-6 left-0 h-0.5 bg-gradient-to-r from-gold-600 to-gold-400 -z-10 transition-all duration-500 shadow-[0_0_10px_#D4AF37]"
            style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          {STEPS.map(s => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <motion.div animate={{ scale: step === s.num ? 1.15 : 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className={cn('w-12 h-12 rounded-full flex items-center justify-center border-2 bg-obsidian-950 transition-all duration-300',
                  step > s.num ? 'border-gold-500 bg-gold-500/10 shadow-[0_0_20px_rgba(212,175,55,0.35)]'
                  : step === s.num ? 'border-gold-500 shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                  : 'border-obsidian-700'
                )}>
                {step > s.num
                  ? <CheckCircle2 className="w-5 h-5 text-gold-400" />
                  : <s.icon className={cn('w-5 h-5', step >= s.num ? 'text-gold-400' : 'text-slate-600')} />
                }
              </motion.div>
              <span className={cn('text-[10px] font-semibold tracking-widest uppercase hidden sm:block transition-colors', step >= s.num ? 'text-gold-400' : 'text-slate-600')}>
                {s.title}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Main two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Sidebar preview card ── */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="vault-glass border border-obsidian-800 rounded-2xl overflow-hidden h-fit sticky top-28"
          >
            {/* Image preview */}
            <div className={cn('relative w-full aspect-[4/3] bg-obsidian-900 flex items-center justify-center overflow-hidden', coverImg ? '' : '')}>
              {coverImg ? (
                <motion.img key={coverImg} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} src={coverImg} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-center p-6">
                  <div className="w-16 h-16 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
                    <Camera className="w-7 h-7 text-slate-600" />
                  </div>
                  <p className="text-xs text-slate-600 font-mono">Asset image preview</p>
                </div>
              )}
              {images.length > 1 && (
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full bg-obsidian-950/80 text-[10px] font-mono text-slate-400 border border-obsidian-700">
                  +{images.length - 1} more
                </div>
              )}
            </div>

            {/* NFT preview info */}
            <div className="p-5 space-y-4">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-gold-500/70 mb-1">Artifact Preview</p>
                <p className="font-serif text-lg text-slate-100 leading-tight">{assetName || 'Untitled Artifact'}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{era || 'Era unknown'} · {category || 'Category'}</p>
              </div>

              <div className="space-y-2">
                {[
                  { icon: Globe,  label: 'Network',  value: 'Ethereum Mainnet' },
                  { icon: Hash,   label: 'Standard', value: 'ERC-721' },
                  { icon: Lock,   label: 'Vault',    value: vault || 'Not selected' },
                  { icon: Cpu,    label: 'Images',   value: `${images.length} uploaded` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 text-xs">
                    <Icon className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <span className="text-slate-600 font-mono min-w-[60px]">{label}</span>
                    <span className={cn('font-mono ml-auto text-right', value.includes('Not') ? 'text-slate-600' : 'text-slate-300')}>{value}</span>
                  </div>
                ))}
              </div>

              {price && (
                <div className="pt-3 border-t border-obsidian-800">
                  <p className="text-[9px] font-mono uppercase tracking-widest text-slate-600 mb-1">Floor Price</p>
                  <p className="text-2xl font-serif text-gold-400">Ξ {price}</p>
                </div>
              )}

              {/* Step badge */}
              <div className="w-full py-2 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center gap-2">
                <span className={cn('w-2 h-2 rounded-full', canNext ? 'bg-emerald-400' : 'bg-amber-400')} />
                <span className="text-[10px] font-mono text-slate-500">Step {step} of 4</span>
              </div>
            </div>
          </motion.div>

          {/* ── Form Panel ── */}
          <div className="lg:col-span-2">
            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 min-h-[520px] relative overflow-hidden">
              {/* Top gold accent */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.25 }}>

                  {/* ─── STEP 1: Identity ─── */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <ShieldCheck className="w-5 h-5 text-gold-500" />
                        <div>
                          <h2 className="text-xl font-serif text-slate-100">KYC / AML Verification</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Required for all artifact minters under international RWA standards.</p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ borderColor: kycStatus === 'verified' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)' }}
                        className="p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-5 bg-obsidian-900/40 transition-colors"
                      >
                        {kycStatus === 'idle' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
                              <Fingerprint className="w-10 h-10 text-slate-500" />
                            </div>
                            <div className="text-center">
                              <h3 className="text-slate-200 font-medium mb-1">Liveness & Document Check</h3>
                              <p className="text-xs text-slate-500">We use AI-powered biometric verification to confirm your identity.</p>
                            </div>
                            <motion.button onClick={handleKycScan} whileHover={{ scale: 1.04, boxShadow: '0 0 24px rgba(212,175,55,0.3)' }} whileTap={{ scale: 0.97 }}
                              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold rounded-xl shadow-[0_0_16px_rgba(212,175,55,0.2)] transition-all">
                              <Fingerprint className="w-4 h-4" /> Initiate Secure Scan
                            </motion.button>
                          </motion.div>
                        )}

                        {kycStatus === 'scanning' && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                            <div className="relative w-20 h-20">
                              <div className="absolute inset-0 rounded-full border-4 border-obsidian-800" />
                              <div className="absolute inset-0 rounded-full border-4 border-t-gold-500 border-r-gold-500/50 animate-spin" />
                              <div className="absolute inset-2 rounded-full bg-gold-500/5 flex items-center justify-center">
                                <Fingerprint className="w-8 h-8 text-gold-400 animate-pulse" />
                              </div>
                            </div>
                            <div className="text-center">
                              <p className="text-gold-400 font-mono font-semibold">Analyzing Biometrics…</p>
                              <p className="text-xs text-slate-500 mt-1">Please remain still</p>
                            </div>
                            <div className="flex gap-1.5">
                              {[0.1, 0.2, 0.3].map(d => <motion.div key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: d }} className="w-1.5 h-1.5 rounded-full bg-gold-400" />)}
                            </div>
                          </motion.div>
                        )}

                        {kycStatus === 'verified' && (
                          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.4 }} className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.15)]">
                              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-emerald-400 font-semibold font-mono">Identity Verified</p>
                              <p className="text-xs text-slate-500 mt-1 font-mono">DID:ETH:0x82...4B1A</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/8 border border-emerald-500/20">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">KYC · AML Passed</span>
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  )}

                  {/* ─── STEP 2: Asset Info + Image Upload ─── */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Camera className="w-5 h-5 text-gold-500" />
                        <div>
                          <h2 className="text-xl font-serif text-slate-100">Asset Information & Images</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Provide details and upload high-quality photos of your artifact.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <Field label="Artifact Name">
                          <input value={assetName} onChange={e => setAssetName(e.target.value)} placeholder="e.g. Edo Period Katana" className={inputCls} />
                        </Field>
                        <Field label="Category">
                          <select value={category} onChange={e => setCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
                            <option value="">Select category</option>
                            {['Militaria','Jewelry','Numismatics','Ceramics','Paintings','Sculpture','Manuscripts','Textiles'].map(c => <option key={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Era / Period">
                          <input value={era} onChange={e => setEra(e.target.value)} placeholder="e.g. Edo Period (1603-1867)" className={inputCls} />
                        </Field>
                        <Field label="Primary Material">
                          <input value={material} onChange={e => setMaterial(e.target.value)} placeholder="e.g. Tamahagane Steel" className={inputCls} />
                        </Field>
                        <Field label="Artifact Weight">
                          <input value={weight} onChange={e => setWeight(e.target.value)} placeholder="e.g. 1.2 kg" className={inputCls} />
                        </Field>
                        <Field label="Condition Grade">
                          <select value={condition} onChange={e => setCondition(e.target.value)} className={`${inputCls} cursor-pointer`}>
                            <option value="">Select grade</option>
                            {[10,9,8,7,6,5].map(g => <option key={g} value={g}>{g} — {['','','','','','Fair','Good','Very Good','Excellent','Near Mint','Mint'][g]}</option>)}
                          </select>
                        </Field>
                      </div>

                      <Field label="Description / Provenance Notes">
                        <textarea value={description} onChange={e => setDescription(e.target.value)}
                          placeholder="Describe the artifact's history, provenance, and distinguishing features…"
                          rows={3} className={`${inputCls} resize-none`} />
                      </Field>

                      {/* ── Image Upload ── */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Asset Images</p>
                          {images.length > 0 && (
                            <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/20">{images.length}/8</span>
                          )}
                        </div>
                        <ImageUploadZone images={images} onAdd={handleAddImages} onRemove={handleRemoveImage} />
                        {images.length === 0 && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-amber-400/70 font-mono mt-2 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse inline-block" />
                            At least one image is required for minting
                          </motion.p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 3: Logistics ─── */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <MapPin className="w-5 h-5 text-gold-500" />
                        <div>
                          <h2 className="text-xl font-serif text-slate-100">Logistics & Custody</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Select a certified Vault Partner to take custody of the physical artifact.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'geneva', name: 'Geneva Free-port', sub: 'Switzerland · CHF', desc: 'Climate-controlled, Level 3 Security, Protocol Insured. ISO 27001 certified.' },
                          { id: 'london', name: 'London Safe Deposit', sub: 'United Kingdom · GBP', desc: "Armed guard, biometrics access, Lloyd's insured." },
                          { id: 'tokyo',  name: 'Tokyo Fine Storage',  sub: 'Japan · JPY', desc: 'Seismic-rated facility, RFID tracking, 99.99% uptime guarantee.' },
                          { id: 'hk',     name: 'Hong Kong Freeport',  sub: 'Hong Kong · HKD', desc: 'China-border exempt, humidity-controlled, 24/7 surveillance.' },
                        ].map(v => (
                          <motion.label key={v.id} whileHover={{ scale: 1.01 }}
                            className={cn('cursor-pointer border rounded-xl p-5 flex flex-col gap-2 transition-all relative',
                              vault === v.id ? 'border-gold-500/50 bg-gold-500/5 shadow-[0_0_20px_rgba(212,175,55,0.08)]' : 'border-obsidian-700 bg-obsidian-900/40 hover:border-obsidian-600'
                            )}>
                            <input type="radio" name="vault" value={v.id} checked={vault === v.id} onChange={() => setVault(v.id)} className="sr-only" />
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className={cn('font-serif text-base leading-snug', vault === v.id ? 'text-gold-400' : 'text-slate-200')}>{v.name}</h4>
                                <p className="text-[10px] font-mono text-slate-500 mt-0.5">{v.sub}</p>
                              </div>
                              <div className={cn('w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all', vault === v.id ? 'border-gold-500 bg-gold-500' : 'border-obsidian-600')}>
                                {vault === v.id && <div className="w-1.5 h-1.5 rounded-full bg-obsidian-950" />}
                              </div>
                            </div>
                            <p className="text-xs text-slate-400">{v.desc}</p>
                          </motion.label>
                        ))}
                      </div>

                      <div className="flex gap-3 items-start p-4 bg-obsidian-900/60 rounded-xl border border-obsidian-800">
                        <ShieldCheck className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Once shipped and received, an appraiser will verify the condition and seal the physical RFID/NFC tag before the smart contract unlocks the NFT.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ─── STEP 4: Financials ─── */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-6">
                        <DollarSign className="w-5 h-5 text-gold-500" />
                        <div>
                          <h2 className="text-xl font-serif text-slate-100">Financials & Royalties</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Set pricing and configure on-chain revenue sharing.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-5">
                        <Field label="Floor Price (ETH)">
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-serif text-lg">Ξ</span>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.00" className={`${inputCls} pl-10 text-gold-400`} />
                          </div>
                        </Field>
                        <Field label="Creator Royalty (%)">
                          <div className="relative">
                            <input type="number" value={royalty} onChange={e => setRoyalty(e.target.value)} placeholder="5" className={`${inputCls} pr-10 text-gold-400`} />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">%</span>
                          </div>
                        </Field>
                      </div>

                      {/* Fee breakdown */}
                      {price && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-obsidian-700 bg-obsidian-900/60 overflow-hidden">
                          <div className="px-4 py-2 bg-obsidian-900 border-b border-obsidian-800">
                            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Estimated Fee Breakdown</p>
                          </div>
                          <div className="divide-y divide-obsidian-800/50">
                            {[
                              { label: 'Floor Price',       value: `Ξ ${price}`, bold: false },
                              { label: 'Protocol Fee (2%)', value: `Ξ ${(parseFloat(price || '0') * 0.02).toFixed(4)}`, bold: false },
                              { label: 'Gas Estimate',      value: '~Ξ 0.0045', bold: false },
                              { label: 'You Receive',       value: `Ξ ${(parseFloat(price || '0') * 0.98 - 0.0045).toFixed(4)}`, bold: true },
                            ].map(r => (
                              <div key={r.label} className="flex justify-between px-4 py-3 text-sm">
                                <span className="text-slate-500 font-mono">{r.label}</span>
                                <span className={cn('font-mono', r.bold ? 'text-gold-400 font-bold' : 'text-slate-300')}>{r.value}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {/* Fractionalization toggle */}
                      <div>
                        <motion.div
                          animate={{ borderColor: fractionalize ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)' }}
                          className="flex items-center justify-between p-5 border rounded-xl bg-obsidian-900/60 transition-all"
                        >
                          <div>
                            <h4 className="text-sm font-semibold text-slate-200 mb-1">Enable Fractionalization</h4>
                            <p className="text-xs text-slate-500">Allow multiple collectors to own fractional ERC-20 tokens.</p>
                          </div>
                          <button onClick={() => setFractionalize(p => !p)}
                            className={cn('relative w-12 h-6 rounded-full border-2 transition-all duration-300 shrink-0',
                              fractionalize ? 'bg-gold-500 border-gold-400' : 'bg-obsidian-800 border-obsidian-700')}>
                            <motion.div animate={{ x: fractionalize ? 24 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-[2px] w-4 h-4 rounded-full bg-white shadow-sm" />
                          </button>
                        </motion.div>

                        <AnimatePresence>
                          {fractionalize && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                              <div className="mt-3 p-4 border border-gold-500/20 bg-gold-500/5 rounded-xl space-y-3">
                                <Field label="Number of Fractions (ERC-20 Tokens)">
                                  <input type="number" value={fractions} onChange={e => setFractions(e.target.value)} className={inputCls} />
                                </Field>
                                <p className="text-[10px] text-gold-400/70 font-mono flex items-center gap-1.5">
                                  <Scale className="w-3 h-3" /> Generates an ERC-20 vault for shared ownership.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-10 flex justify-between items-center border-t border-obsidian-800 pt-6">
                {step > 1 ? (
                  <motion.button whileHover={{ x: -2 }} onClick={() => setStep(p => Math.max(p - 1, 1))}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-obsidian-700 bg-obsidian-900 text-slate-300 text-sm font-medium hover:border-obsidian-600 hover:text-slate-100 transition-all">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </motion.button>
                ) : <div />}

                {step < 4 ? (
                  <motion.button
                    whileHover={canNext ? { scale: 1.03 } : {}}
                    whileTap={canNext ? { scale: 0.97 } : {}}
                    onClick={() => canNext && setStep(p => Math.min(p + 1, 4))}
                    disabled={!canNext || (step === 2 && images.length === 0)}
                    className={cn(
                      'flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm transition-all',
                      (canNext && !(step === 2 && images.length === 0))
                        ? 'bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]'
                        : 'bg-obsidian-800 text-slate-600 cursor-not-allowed'
                    )}
                  >
                    Next Step <ChevronRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setIsMintOpen(true)}
                    whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(212,175,55,0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all"
                  >
                    <Zap className="w-4 h-4" /> Mint to Vault <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MintModal isOpen={isMintOpen} onClose={() => setIsMintOpen(false)} />
    </PageTransition>
  );
}
