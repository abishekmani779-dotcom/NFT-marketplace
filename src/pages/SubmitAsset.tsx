import React, { useState } from 'react';
import { Camera, FileText, CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, DollarSign, Fingerprint, Box, MapPin, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';

export default function SubmitAsset() {
  const [step, setStep] = useState(1);
  const [fractionalize, setFractionalize] = useState(false);
  const [kycStatus, setKycStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  const steps = [
    { num: 1, title: 'Identity Verification', icon: Fingerprint },
    { num: 2, title: 'Physical Specifications', icon: Box },
    { num: 3, title: 'Vault Logistics', icon: MapPin },
    { num: 4, title: 'Financials & Mint', icon: DollarSign }
  ];

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleKycScan = () => {
    setKycStatus('scanning');
    setTimeout(() => {
        setKycStatus('verified');
    }, 2000);
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto px-4 py-16">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-slate-50 mb-4">Mint Artifact to Vault</h1>
          <p className="text-slate-400">Initialize a new RWA token by completing the secure onboarding Protocol.</p>
        </div>

        {/* Stepper Header */}
        <div className="relative mb-16 flex justify-between">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-obsidian-800 -translate-y-1/2 -z-10" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-gold-600 to-gold-400 -translate-y-1/2 -z-10 transition-all duration-500 shadow-[0_0_10px_#D4AF37]"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          
          {steps.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 bg-obsidian-950",
                step >= s.num ? "border-gold-500 text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "border-obsidian-700 text-slate-600"
              )}>
                {step > s.num ? <CheckCircle2 className="w-5 h-5 text-gold-400" /> : <s.icon className="w-5 h-5" />}
              </div>
              <span className={cn(
                "text-[10px] font-semibold tracking-widest uppercase hidden sm:block",
                step >= s.num ? "text-gold-400" : "text-slate-500"
              )}>
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <div className="vault-glass p-8 rounded-lg min-h-[400px] border border-obsidian-800 shadow-2xl shadow-obsidian-900 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* STEP 1: Identity */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-slate-100 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-gold-500" /> KYC / AML Verification
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">Aura Protocol requires strict identity verification for all artifact minters in compliance with international RWA standards.</p>
                  
                  <div className="p-8 border-2 border-dashed border-obsidian-700 bg-obsidian-900/50 rounded-lg flex flex-col items-center justify-center">
                    {kycStatus === 'idle' && (
                        <>
                            <Fingerprint className="w-16 h-16 text-slate-600 mb-4" />
                            <h3 className="text-slate-200 mb-2">Liveness & Document Check</h3>
                            <button onClick={handleKycScan} className="primary-btn mt-4">Initiate Secure Scan</button>
                        </>
                    )}
                    {kycStatus === 'scanning' && (
                        <div className="flex flex-col items-center animate-pulse">
                            <div className="w-16 h-16 rounded-full border-4 border-t-gold-500 border-obsidian-800 animate-spin mb-4" />
                            <h3 className="text-gold-400 mb-2 font-mono">Analyzing Biometrics...</h3>
                        </div>
                    )}
                    {kycStatus === 'verified' && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/50">
                                <CheckCircle2 className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-green-400 font-mono mb-2">Identity Verified</h3>
                            <p className="text-xs text-slate-500 font-mono">ID: DID:ETH:0X82...4B1A</p>
                        </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Physical Specs */}
              {step === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-slate-100 mb-6 flex items-center gap-2">
                    <Box className="w-6 h-6 text-gold-500" /> Physical Specifications
                  </h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Artifact Weight</label>
                      <input type="text" className="input-field font-mono" placeholder="e.g. 2.4 kg" />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Era/Period</label>
                      <input type="text" className="input-field font-mono" placeholder="e.g. 15th Century" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Primary Material</label>
                        <input type="text" className="input-field font-mono" placeholder="e.g. Porcelain, 18k Gold" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">Condition Grade (1-10)</label>
                        <select className="input-field font-mono appearance-none cursor-pointer">
                            <option value="">Select Grade</option>
                            <option value="10">10 - Mint (Flawless)</option>
                            <option value="9">9 - Near Mint</option>
                            <option value="8">8 - Excellent</option>
                            <option value="7">7 - Very Good</option>
                            <option value="6">6 - Good</option>
                            <option value="5">5 - Fair</option>
                        </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Logistics */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-slate-100 mb-2 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-gold-500" /> Logistics & Custody
                  </h2>
                  <p className="text-slate-400 text-sm mb-6">Select a certified Vault Partner to take custody of the physical artifact.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="border border-obsidian-700 bg-obsidian-900/50 rounded-lg p-4 cursor-pointer hover:border-gold-500/50 transition-colors relative">
                        <input type="radio" name="vault" className="absolute top-4 right-4 accent-gold-500" />
                        <h4 className="font-serif text-gold-400 mb-1">Geneva Free-port</h4>
                        <p className="text-xs text-slate-500 font-mono mb-2">Switzerland</p>
                        <p className="text-xs text-slate-300">Climate-controlled, Level 3 Security, Protocol Insured.</p>
                    </label>
                    <label className="border border-obsidian-700 bg-obsidian-900/50 rounded-lg p-4 cursor-pointer hover:border-gold-500/50 transition-colors relative">
                        <input type="radio" name="vault" className="absolute top-4 right-4 accent-gold-500" />
                        <h4 className="font-serif text-gold-400 mb-1">London Safe Deposit</h4>
                        <p className="text-xs text-slate-500 font-mono mb-2">United Kingdom</p>
                        <p className="text-xs text-slate-300">Armed guard, biometrics access, Lloyd's insured.</p>
                    </label>
                  </div>

                  <div className="mt-6 p-4 bg-obsidian-900/80 rounded border border-obsidian-800 text-left flex gap-4 items-start shadow-inner">
                    <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Once the item is shipped and received by the Vault Partner, an appraiser will verify the condition and seal the physical RFID/NFC tag before the smart contract unlocks the NFT.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: Financials */}
              {step === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-serif text-slate-100 mb-6 flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-gold-500" /> Financials & Royalties
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                         Floor Price (ETH)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">Ξ</span>
                        <input type="number" className="input-field pl-10 font-mono text-xl text-gold-400" placeholder="0.00" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                        Creator Royalty (%)
                      </label>
                      <div className="relative">
                        <input type="number" className="input-field pr-10 font-mono text-xl text-gold-400" placeholder="5" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 border-t border-obsidian-800 pt-6">
                    <div className="flex items-center justify-between p-4 border border-obsidian-700 bg-obsidian-900 rounded-lg">
                        <div>
                            <h4 className="text-slate-200 font-medium mb-1">Enable Fractionalization</h4>
                            <p className="text-xs text-slate-500 max-w-sm">Allow multiple collectors to own fractional ERC-20 tokens of this artifact.</p>
                        </div>
                        
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={fractionalize} 
                                onChange={() => setFractionalize(!fractionalize)} 
                            />
                            <div className="w-11 h-6 bg-obsidian-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
                        </label>
                    </div>
                    
                    <AnimatePresence>
                        {fractionalize && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: 'auto' }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 p-4 border border-gold-500/30 bg-gold-900/10 rounded-lg overflow-hidden"
                            >
                                <label className="block text-xs font-mono text-slate-400 mb-2 uppercase tracking-wide">
                                    Number of Fractions (Tokens)
                                </label>
                                <input type="number" className="input-field font-mono" placeholder="1000" />
                                <p className="text-xs text-gold-400/80 mt-2"><Scale className="w-3 h-3 inline pb-0.5" /> Generates an ERC-20 vault for shared ownership.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </div>

                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          <div className="mt-12 flex justify-between items-center border-t border-obsidian-800 pt-6">
            {step > 1 ? (
              <button 
                onClick={prevStep} 
                className="secondary-btn text-sm px-6 py-2.5"
                disabled={step === 1 && kycStatus === 'scanning'}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
            ) : <div />}
            
            {step < 4 ? (
              <button 
                onClick={nextStep} 
                className={cn("primary-btn text-sm px-8 py-2.5", step === 1 && kycStatus !== 'verified' && "opacity-50 cursor-not-allowed")}
                disabled={step === 1 && kycStatus !== 'verified'}
              >
                Next Step <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            ) : (
              <button className="primary-btn text-sm px-8 py-2.5 shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                Mint to Vault <CheckCircle2 className="w-4 h-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
