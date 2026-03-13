import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2, Copy, ExternalLink, Unplug } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { WalletType } from '../context/AuthContext';
import { cn } from '../lib/utils';

/* ─────────────────────────────────────────
   Wallet definitions with inline SVG logos
   ───────────────────────────────────────── */
const WALLETS: {
  id: WalletType;
  name: string;
  desc: string;
  popular?: boolean;
  logo: React.ReactNode;
}[] = [
  {
    id: 'MetaMask',
    name: 'MetaMask',
    desc: 'Browser extension',
    popular: true,
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <path d="M36.3 3L22 14.6l2.5-5.9L36.3 3z" fill="#E17726" stroke="#E17726" strokeWidth="0.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.7 3l14.2 11.7-2.4-6L3.7 3z" fill="#E27625" stroke="#E27625" strokeWidth="0.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M31 27.3l-3.8 5.8 8.2 2.3 2.3-8L31 27.3z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
        <path d="M2.3 27.4l2.3 8 8.2-2.3-3.8-5.8-6.7.1z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
        <path d="M12.4 18.2l-2.2 3.4 7.9.4-.3-8.5-5.4 4.7z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
        <path d="M27.6 18.2l-5.5-4.8-.2 8.6 7.9-.4-2.2-3.4z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
        <path d="M12.8 33.1l4.8-2.3-4.1-3.2-.7 5.5z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
        <path d="M22.4 30.8l4.8 2.3-.7-5.5-4.1 3.2z" fill="#E27625" stroke="#E27625" strokeWidth="0.3"/>
      </svg>
    ),
  },
  {
    id: 'WalletConnect',
    name: 'WalletConnect',
    desc: 'Scan with phone',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <circle cx="20" cy="20" r="18" fill="#3B99FC" opacity="0.15"/>
        <path d="M9.6 16.4c5.8-5.7 15.1-5.7 20.9 0l.7.7c.3.3.3.7 0 1l-2.3 2.3c-.1.1-.4.1-.5 0l-.9-.9c-4-4-10.5-4-14.6 0l-1 1c-.1.1-.4.1-.5 0l-2.3-2.3c-.3-.3-.3-.7 0-1l.5-.8zm25.8 4.8l2 2c.3.3.3.7 0 1L27 33.5c-.3.3-.7.3-1 0l-5.6-5.6c-.1-.1-.3-.1-.4 0l-5.6 5.6c-.3.3-.7.3-1 0L3.1 23.2c-.3-.3-.3-.7 0-1l2-2c.3-.3.7-.3 1 0l5.6 5.7c.1.1.3.1.4 0l5.6-5.7c.3-.3.7-.3 1 0l5.6 5.7c.1.1.3.1.4 0l5.6-5.7c.5-.3.9-.3 1.1 0z" fill="#3B99FC"/>
      </svg>
    ),
  },
  {
    id: 'Coinbase Wallet',
    name: 'Coinbase',
    desc: 'Coinbase Wallet app',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="10" fill="#0052FF" opacity="0.15"/>
        <rect x="6" y="6" width="28" height="28" rx="8" fill="#0052FF"/>
        <circle cx="20" cy="20" r="8" fill="white"/>
        <rect x="16" y="18" width="8" height="4" rx="2" fill="#0052FF"/>
      </svg>
    ),
  },
  {
    id: 'Phantom',
    name: 'Phantom',
    desc: 'Solana / EVM',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="10" fill="#AB9FF2" opacity="0.2"/>
        <rect x="5" y="5" width="30" height="30" rx="9" fill="#AB9FF2"/>
        <path d="M28.5 16.5H12c0 6 4 12 10 12 4 0 7.5-3 7.5-7v-2c0-1.7-1.3-3-1-3z" fill="white" opacity="0.9"/>
        <circle cx="16.5" cy="20" r="1.5" fill="#AB9FF2"/>
        <circle cx="23.5" cy="20" r="1.5" fill="#AB9FF2"/>
      </svg>
    ),
  },
  {
    id: 'Ledger',
    name: 'Ledger',
    desc: 'Hardware wallet',
    logo: (
      <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
        <rect width="40" height="40" rx="8" fill="#1d1d1b" opacity="0.1"/>
        <rect x="7" y="12" width="18" height="18" rx="2" stroke="#e2e8f0" strokeWidth="2" fill="none"/>
        <rect x="15" y="20" width="18" height="10" rx="2" stroke="#e2e8f0" strokeWidth="2" fill="none"/>
      </svg>
    ),
  },
];

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'select' | 'connecting' | 'success';

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { connectWallet, disconnectWallet, wallet, isWalletConnected } = useAuth();
  const [step, setStep] = useState<ModalStep>(isWalletConnected ? 'success' : 'select');
  const [selectedWallet, setSelectedWallet] = useState<(typeof WALLETS)[0] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSelectWallet = async (w: (typeof WALLETS)[0]) => {
    setSelectedWallet(w);
    setStep('connecting');
    try {
      await connectWallet(w.id);
      setStep('success');
    } catch {
      setStep('select');
    }
  };

  const handleCopy = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setStep('select');
    setSelectedWallet(null);
    onClose();
  };

  const handleClose = () => {
    if (step !== 'connecting') {
      onClose();
      // Reset to success if wallet is connected
      setTimeout(() => {
        setStep(wallet ? 'success' : 'select');
      }, 300);
    }
  };

  // Sync step when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setStep(isWalletConnected ? 'success' : 'select');
    }
  }, [isOpen, isWalletConnected]);

  const connectedWallet = WALLETS.find((w) => w.id === wallet?.type);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md"
            onClick={handleClose}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md bg-obsidian-950 border border-obsidian-700 rounded-2xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
          >
            {/* Gold accent top bar */}
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

            <AnimatePresence mode="wait">
              {/* ── Step: Select Wallet ── */}
              {step === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-serif text-slate-50">Connect Wallet</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Choose your preferred wallet provider</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Popular badge */}
                  <p className="text-[10px] text-slate-600 uppercase tracking-widest font-mono mb-2">Popular</p>

                  {/* Wallet Grid */}
                  <div className="space-y-2 mb-4">
                    {WALLETS.map((w) => (
                      <button
                        key={w.id}
                        onClick={() => handleSelectWallet(w)}
                        className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl border border-obsidian-700 bg-obsidian-900/50 hover:bg-obsidian-800 hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)] transition-all duration-200 group"
                      >
                        <div className="shrink-0">{w.logo}</div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-semibold text-slate-200 group-hover:text-gold-400 transition-colors">{w.name}</p>
                          <p className="text-[11px] text-slate-500">{w.desc}</p>
                        </div>
                        {w.popular && (
                          <span className="text-[9px] font-bold uppercase tracking-widest text-gold-500 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="w-7 h-7 rounded-lg border border-obsidian-700 bg-obsidian-800 group-hover:border-gold-500/40 flex items-center justify-center">
                          <svg className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-500 -rotate-90 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>

                  <p className="text-center text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-obsidian-800">
                    By connecting, you agree to Aura Protocol's{' '}
                    <span className="text-gold-600 hover:text-gold-400 cursor-pointer transition-colors">Terms of Service</span>
                    {' '}and{' '}
                    <span className="text-gold-600 hover:text-gold-400 cursor-pointer transition-colors">Privacy Policy</span>
                  </p>
                </motion.div>
              )}

              {/* ── Step: Connecting Spinner ── */}
              {step === 'connecting' && (
                <motion.div
                  key="connecting"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-6 flex flex-col items-center justify-center gap-6 py-16"
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text-4xl shadow-inner">
                      {selectedWallet?.logo}
                    </div>
                    {/* Spinning ring */}
                    <div className="absolute -inset-1.5 rounded-[18px] border-2 border-transparent border-t-gold-500 animate-spin" />
                    {/* Pulse ring */}
                    <div className="absolute -inset-3 rounded-[22px] border border-gold-500/20 animate-ping" style={{ animationDuration: '2s' }} />
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="text-lg font-serif text-slate-100">Connecting to {selectedWallet?.name}</p>
                    <p className="text-sm text-slate-500">Approve the request in your wallet extension</p>
                    <div className="flex items-center justify-center gap-1.5 mt-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step: Success / Wallet Info ── */}
              {step === 'success' && wallet && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif text-slate-50">Wallet Connected</h2>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Wallet Identity Card */}
                  <div className="bg-obsidian-900 border border-obsidian-800 rounded-xl p-5 mb-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/5 rounded-full -translate-y-20 translate-x-20 blur-2xl" />
                    <div className="relative z-10 flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center shrink-0">
                        {connectedWallet?.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <span className="text-sm font-semibold text-emerald-400">Connected</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{connectedWallet?.name} · {connectedWallet?.desc}</p>
                      </div>
                    </div>

                    {/* Address row */}
                    <div className="bg-obsidian-950 border border-obsidian-800 rounded-lg px-4 py-3 flex items-center justify-between mb-3">
                      <span className="font-mono text-sm text-slate-200 tracking-wide">{wallet.address}</span>
                      <div className="flex items-center gap-1.5 ml-3 shrink-0">
                        <button onClick={handleCopy} className="w-7 h-7 rounded-md bg-obsidian-800 hover:bg-obsidian-700 flex items-center justify-center transition-colors group" title="Copy address">
                          {copied
                            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                            : <Copy className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                          }
                        </button>
                        <button className="w-7 h-7 rounded-md bg-obsidian-800 hover:bg-obsidian-700 flex items-center justify-center transition-colors group" title="View on explorer">
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                        </button>
                      </div>
                    </div>

                    {/* Balance */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Balance</span>
                      <div className="flex items-center gap-1.5">
                        <svg viewBox="0 0 12 12" className="w-3.5 h-3.5" fill="none">
                          <polygon points="6,0.5 9.5,6 6,7.5 2.5,6" fill="#627EEA" opacity="0.9"/>
                          <polygon points="6,8.5 9.5,6.5 6,11.5 2.5,6.5" fill="#627EEA" opacity="0.6"/>
                        </svg>
                        <span className="text-lg font-serif text-gold-400">{wallet.balance} ETH</span>
                        <span className="text-xs text-slate-500">≈ ${(parseFloat(wallet.balance) * 2750).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Network pill */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex items-center gap-1.5 bg-obsidian-900 border border-obsidian-800 rounded-full px-3 py-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                      <span className="text-[11px] font-mono text-slate-400">Ethereum Mainnet</span>
                    </div>
                  </div>

                  {/* Disconnect */}
                  <button
                    onClick={handleDisconnect}
                    className="w-full py-3 rounded-xl border border-red-900/50 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Unplug className="w-4 h-4" />
                    Disconnect Wallet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
