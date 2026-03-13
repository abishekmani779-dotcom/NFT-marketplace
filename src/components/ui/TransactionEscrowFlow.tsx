import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, ShieldCheck, MapPin, Box, ArrowRight, ExternalLink, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  asset: any;
}

export function TransactionEscrowFlow({ isOpen, onClose, asset }: Props) {
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    if (step === 1 && isOpen) {
      const timer = setTimeout(() => setStep(2), 2000);
      return () => clearTimeout(timer);
    }
    if (step === 3 && isOpen) {
      const timer = setTimeout(() => setStep(4), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-md"
        onClick={() => {
            if (step === 4) onClose();
        }}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-obsidian-900 border border-obsidian-700 rounded-xl shadow-2xl overflow-hidden vault-glass m-auto"
      >
        <div className="p-4 sm:p-6 border-b border-obsidian-800 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-serif text-slate-50 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold-500" /> Secure Escrow Processing
          </h2>
        </div>

        <div className="p-4 sm:p-8 overflow-y-auto custom-scroll">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col items-center py-10"
              >
                <Loader2 className="w-12 h-12 text-gold-500 animate-spin mb-4" />
                <h3 className="text-lg font-medium text-slate-100 mb-2">Checking Liquidity</h3>
                <p className="text-slate-400 text-sm">Verifying wallet balance and allowance...</p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col"
              >
                <div className="bg-obsidian-950/50 p-6 rounded-lg border border-obsidian-800 mb-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm">Action</span>
                    <span className="text-slate-100 font-mono text-sm">Acquire Asset</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400 text-sm">Contract</span>
                    <span className="text-slate-100 font-mono text-sm truncate max-w-[200px]">{asset.digitalOwnership?.contractAddress || '0x4f...9c21'}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-obsidian-800 pt-4">
                    <span className="text-slate-400 text-sm">Total Cost</span>
                    <span className="text-gold-400 font-serif text-xl">{asset.priceETH} ETH</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-slate-100 mb-2 text-center">Awaiting Signature</h3>
                <p className="text-slate-400 text-sm text-center mb-6">Please sign the transaction in your wallet to proceed with the escrow.</p>
                
                <button 
                  onClick={() => setStep(3)}
                  className="primary-btn w-full py-4 relative overflow-hidden group"
                >
                  <span className="relative z-10">Sign & Confirm Transaction</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-600 to-gold-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col items-center py-6"
              >
                <h3 className="text-lg font-medium text-slate-100 mb-8">Transferring Digital Title</h3>
                
                <div className="flex items-center justify-between w-full px-8 relative h-32">
                    {/* Path */}
                    <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-64 h-1 border-t-2 border-dashed border-obsidian-700" />
                    
                    {/* Seller */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-obsidian-950 border-2 border-obsidian-700 flex items-center justify-center">
                            <Box className="w-6 h-6 text-slate-400" />
                        </div>
                        <span className="text-xs font-mono text-slate-500">Seller Escrow</span>
                    </div>

                    {/* Animated NFT */}
                    <motion.div 
                        className="absolute left-[20%] top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-gradient-to-br from-gold-500 to-gold-700 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center"
                        animate={{ left: ['20%', '70%'] }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    >
                        <ShieldCheck className="w-6 h-6 text-obsidian-950" />
                    </motion.div>

                    {/* Buyer */}
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-obsidian-950 border-2 border-gold-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                            <Box className="w-6 h-6 text-gold-400" />
                        </div>
                        <span className="text-xs font-mono text-gold-500">Your Wallet</span>
                    </div>
                </div>

                <p className="text-slate-400 text-sm mt-8 animate-pulse text-center">Confirming physical vault reassignment...</p>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center py-4 text-center"
              >
                <div className="w-20 h-20 bg-green-900/20 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                    <CheckCircle className="w-10 h-10 text-green-500 relative z-10" />
                </div>
                
                <h3 className="text-2xl font-serif text-slate-50 mb-2">Acquisition Successful</h3>
                <p className="text-slate-400 text-sm mb-8">You are now the digital owner of <span className="text-gold-400">{asset.title}</span>. Vault custody arrangements remain secure.</p>
                
                <div className="w-full flex flex-col gap-3">
                    <button className="flex items-center justify-center gap-2 w-full py-3 bg-obsidian-950 border border-obsidian-800 text-slate-300 hover:text-gold-400 hover:border-gold-500/30 rounded transition-colors group">
                        <ExternalLink className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" /> 
                        View on Etherscan
                    </button>
                    <button className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold rounded shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-shadow">
                        <Download className="w-4 h-4" /> 
                        Download Ownership Certificate 
                        <span className="text-[10px] font-mono bg-obsidian-950/20 px-1.5 py-0.5 rounded ml-1">PDF</span>
                    </button>
                    <button 
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-300 text-sm mt-4 underline underline-offset-4"
                    >
                        Return to Asset
                    </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}
