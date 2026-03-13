import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, XCircle, Search, FileText, AlertTriangle, Activity, Vault, Scan, X, Award } from 'lucide-react';
import { systemHealth } from '../lib/mockRegistry';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';

const pendingApprovals = [
  {
    id: 'sub-089',
    sellerId: '0x4f...9c21',
    title: 'Edo Period Katana',
    era: 'Edo Period',
    trustScore: 88,
    submittedAt: '2026-03-12',
    status: 'pending',
    riskFlags: [],
    metadata: {
        submitted: { material: 'Tamahagane Steel', weight: '1.2 kg', era: 'Edo Period (1603-1867)' },
        oracleDB: { material: 'Tamahagane Steel', weight: '1.2 kg', era: 'Edo Period (1603-1867)' }
    },
    similarityScore: 98
  },
  {
    id: 'sub-090',
    sellerId: '0x7a...11b2',
    title: 'Victorian Emerald Brooch',
    era: 'Victorian',
    trustScore: 45,
    submittedAt: '2026-03-11',
    status: 'review_required',
    riskFlags: ['AI Vision: Cut inconsistency', 'Metadata: Weight mismatch'],
    metadata: {
        submitted: { material: 'Gold & Emerald', weight: '24g', era: 'Victorian' },
        oracleDB: { material: 'Gold & Emerald', weight: '32g (Expected)', era: 'Victorian' }
    },
    similarityScore: 62
  },
  {
    id: 'sub-091',
    sellerId: '0x1b...99f0',
    title: 'Hellenistic Silver Coin',
    era: 'Hellenistic',
    trustScore: 95,
    submittedAt: '2026-03-10',
    status: 'pending',
    riskFlags: [],
    metadata: {
        submitted: { material: 'Silver', weight: '4g', era: 'Hellenistic' },
        oracleDB: { material: 'Silver', weight: '4g', era: 'Hellenistic' }
    },
    similarityScore: 99
  }
];

export default function AdminDashboard() {
  const [selectedAsset, setSelectedAsset] = useState<typeof pendingApprovals[0] | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const handleAssetClick = (asset: typeof pendingApprovals[0]) => {
    setSelectedAsset(asset);
    setIsApproved(false);
  };

  const handleApprove = () => {
    setIsApproved(true);
    setTimeout(() => {
        setIsApproved(false);
        setSelectedAsset(null);
    }, 3000);
  }

  return (
    <PageTransition>
      <div className="max-w-[90rem] mx-auto px-4 py-8 flex">
        
        <div className={`flex-1 transition-all duration-300 ${selectedAsset ? 'pr-[400px]' : ''}`}>
            <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
                <h1 className="text-4xl font-serif text-slate-50 mb-2 flex items-center gap-3">
                <Activity className="w-8 h-8 text-gold-500" />
                Oracle Command Center
                </h1>
                <p className="text-slate-400">Manage RWA asset pipeline, review AI risk flags, and monitor protocol health.</p>
            </div>
            
            <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                type="text" 
                placeholder="Search oracle requests..."
                className="w-full bg-obsidian-900 border border-obsidian-700/50 rounded py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 text-slate-100 placeholder-slate-500 font-mono"
                />
            </div>
            </div>

            {/* System Health Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="vault-glass p-6 rounded-lg border border-obsidian-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-obsidian-900 flex items-center justify-center border border-obsidian-700">
                        <Vault className="w-6 h-6 text-gold-500" />
                    </div>
                    <div>
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-mono mb-1">Total Vaulted Items</h3>
                        <p className="text-2xl font-serif text-slate-100">{systemHealth.tvlItems}</p>
                    </div>
                </div>
                <div className="vault-glass p-6 rounded-lg border border-obsidian-800 flex items-center gap-4 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-gold-500/10 rounded-full blur-[20px] group-hover:bg-gold-500/20 transition-colors pointer-events-none" />
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <span className="text-obsidian-950 font-bold text-xl">Ξ</span>
                    </div>
                    <div>
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-mono mb-1">Total Value Locked</h3>
                        <p className="text-2xl font-serif text-gold-400">{systemHealth.tvlETH} ETH</p>
                    </div>
                </div>
                <div className="vault-glass p-6 rounded-lg border border-obsidian-800 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-900/20 flex items-center justify-center border border-red-900/50">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-slate-400 text-xs uppercase tracking-widest font-mono mb-1">Active Anomalies</h3>
                        <p className="text-2xl font-serif text-red-400">{systemHealth.anomaliesDetected}</p>
                    </div>
                </div>
            </div>

            {/* Pipeline Table */}
            <div className="vault-glass rounded-lg border border-obsidian-800 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-12 gap-4 border-b border-obsidian-800 bg-obsidian-950/80 p-6 text-xs font-semibold uppercase tracking-widest text-slate-500 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-obsidian-900 to-transparent">
                <div className="col-span-3">Artifact & Submitter</div>
                <div className="col-span-2 text-center">AI Trust Score</div>
                <div className="col-span-5">Risk Flags (Vision & Metadata)</div>
                <div className="col-span-2 text-right">Oracle Action</div>
            </div>

            <div className="divide-y divide-obsidian-800/50">
                {pendingApprovals.map((item) => (
                <div 
                    key={item.id} 
                    onClick={() => handleAssetClick(item)}
                    className="grid grid-cols-12 gap-4 p-6 items-center hover:bg-obsidian-900/50 transition-colors cursor-pointer group"
                >
                    
                    <div className="col-span-3">
                    <p className="font-serif text-lg text-slate-100 mb-1 group-hover:text-gold-400 transition-colors">{item.title}</p>
                    <div className="flex flex-col gap-1 text-xs text-slate-400">
                        <span className="font-mono text-[10px] text-slate-500">Seller: {item.sellerId}</span>
                        <span className="flex items-center gap-1 font-mono text-[10px]">Doc Hash: <FileText className="w-3 h-3 text-gold-500/80 cursor-pointer hover:text-gold-400 transition-colors inline" /></span>
                    </div>
                    </div>
                    
                    <div className="col-span-2 flex justify-center items-center">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-serif text-lg ${
                        item.trustScore >= 80 ? 'border-green-500/40 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] bg-green-900/20' : 
                        item.trustScore >= 50 ? 'border-gold-500/40 text-gold-400 shadow-[0_0_15px_rgba(212,175,55,0.15)] bg-gold-900/20' : 
                        'border-red-500/40 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-900/20'
                    }`}>
                        {item.trustScore}
                    </div>
                    </div>

                    <div className="col-span-5 flex flex-col justify-center">
                    {item.riskFlags.length > 0 ? (
                        <div className="flex flex-col gap-2">
                            {item.riskFlags.map((flag, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">
                                    <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
                                    <span className="font-mono">{flag}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-xs text-green-400/80 font-mono">
                            <CheckCircle className="w-3 h-3" /> No discrepancies detected by Engine
                        </div>
                    )}
                    </div>
                    
                    <div className="col-span-2 flex justify-end gap-3 items-center">
                        <span className="text-sm font-sans text-gold-500 group-hover:underline pr-2">Deep Dive →</span>
                    </div>

                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Oracle Deep Dive Side Panel */}
        <AnimatePresence>
            {selectedAsset && (
                <motion.div 
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="fixed right-0 top-20 bottom-0 w-[400px] bg-obsidian-950 border-l border-obsidian-800 shadow-2xl z-40 overflow-y-auto"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-serif text-slate-50 flex items-center gap-2">
                                <Scan className="w-5 h-5 text-gold-500" /> Deep-Dive Review
                            </h2>
                            <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-200">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Similarity Score */}
                            <div>
                                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-4 font-mono">AI Image Similarity</h3>
                                <div className="flex items-center gap-6 p-4 rounded-lg bg-obsidian-900 border border-obsidian-700">
                                    <div className="relative">
                                        <svg className="w-20 h-20 -rotate-90">
                                            <circle cx="40" cy="40" r="36" className="text-obsidian-800 stroke-current" strokeWidth="8" fill="transparent" />
                                            <motion.circle 
                                                cx="40" 
                                                cy="40" 
                                                r="36" 
                                                className={`${selectedAsset.similarityScore > 80 ? 'text-green-500' : 'text-gold-500'} stroke-current`}
                                                strokeWidth="8" 
                                                fill="transparent" 
                                                strokeDasharray="226"
                                                initial={{ strokeDashoffset: 226 }}
                                                animate={{ strokeDashoffset: 226 - (226 * selectedAsset.similarityScore) / 100 }}
                                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl font-bold text-slate-100">{selectedAsset.similarityScore}%</span>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-300">Match with known registry artifacts.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Metadata Comparison */}
                            <div>
                                <h3 className="text-sm uppercase tracking-widest text-slate-400 mb-4 font-mono">Metadata Comparison</h3>
                                <div className="bg-obsidian-900 border border-obsidian-700 rounded-lg overflow-hidden">
                                    <div className="grid grid-cols-3 bg-obsidian-950 p-3 text-xs uppercase text-slate-500 font-bold border-b border-obsidian-800">
                                        <div>Field</div>
                                        <div>Submitted</div>
                                        <div>Oracle DB</div>
                                    </div>
                                    <div className="divide-y divide-obsidian-800">
                                        {Object.keys(selectedAsset.metadata.submitted).map(key => {
                                            const subVal = selectedAsset.metadata.submitted[key as keyof typeof selectedAsset.metadata.submitted];
                                            const oracVal = selectedAsset.metadata.oracleDB[key as keyof typeof selectedAsset.metadata.oracleDB];
                                            const isMismatch = subVal !== oracVal;
                                            
                                            return (
                                                <div key={key} className={`grid grid-cols-3 p-3 text-sm ${isMismatch ? 'bg-red-950/20' : ''}`}>
                                                    <div className="capitalize text-slate-400 font-mono">{key}</div>
                                                    <div className={isMismatch ? 'text-red-400' : 'text-slate-200'}>{subVal}</div>
                                                    <div className="text-slate-200">{oracVal}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 border-t border-obsidian-800 relative">
                                {isApproved ? (
                                    <motion.div 
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-obsidian-950/90 backdrop-blur-sm"
                                    >
                                        <motion.div
                                            initial={{ rotate: -180, scale: 0 }}
                                            animate={{ rotate: 0, scale: 1 }}
                                            transition={{ type: "spring", bounce: 0.5 }}
                                            className="w-24 h-24 mb-4 rounded-full bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                                        >
                                            <Award className="w-12 h-12 text-obsidian-950" />
                                        </motion.div>
                                        <p className="text-xl font-serif text-gold-400">Authenticity Sealed</p>
                                    </motion.div>
                                ) : null}

                                <div className="flex gap-4">
                                    <button onClick={() => setSelectedAsset(null)} className="flex-1 py-3 bg-transparent border border-red-900/50 hover:bg-red-950/30 text-red-500 hover:text-red-400 rounded transition-colors flex items-center justify-center gap-2">
                                        <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                    <button onClick={handleApprove} className="flex-[2] py-3 bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold rounded shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2">
                                        <Award className="w-5 h-5" /> Seal & Vault
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
