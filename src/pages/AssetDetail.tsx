import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockRegistry } from '../lib/mockRegistry';
import { ArrowLeft, ExternalLink, ShieldCheck, ShieldAlert, BadgeCheck, Scale, Info, LineChart } from 'lucide-react';
import { ProvenanceGraph } from '../components/ui/ProvenanceGraph';
import { PriceHistorySparkline } from '../components/ui/PriceHistorySparkline';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionEscrowFlow } from '../components/ui/TransactionEscrowFlow';

function VerificationBadge({ level }: { level: number }) {
  if (level === 3) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-gold-900/30 border border-gold-500/50 text-gold-400 px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-semibold">
        <ShieldCheck className="w-4 h-4" /> Protocol Insured (L3)
      </div>
    );
  } else if (level === 2) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-blue-900/30 border border-blue-500/50 text-blue-400 px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-semibold">
        <BadgeCheck className="w-4 h-4" /> Professional Appraised (L2)
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-1.5 bg-slate-900/50 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-sm text-xs uppercase tracking-widest font-semibold">
      <ShieldAlert className="w-4 h-4" /> Community Verified (L1)
    </div>
  );
}

export default function AssetDetail() {
  const { id } = useParams();
  const asset = mockRegistry.find(a => a.id === id) || mockRegistry[0];
  const [activeTab, setActiveTab] = useState<'provenance' | 'blockchain'>('provenance');
  const [currency, setCurrency] = useState<'ETH' | 'USDC'>('ETH');
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/browse" className="inline-flex items-center text-slate-muted hover:text-gold-400 font-sans text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Vault
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          
          {/* Left Column: Media Gallery */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-obsidian-900 border border-obsidian-800 rounded-lg overflow-hidden relative shadow-2xl shadow-obsidian-900/50 group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key="main-img"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={asset.image} 
                  alt={asset.title} 
                  className="w-full h-full object-cover transform transition-transform duration-[4s] group-hover:scale-105"
                />
              </AnimatePresence>
              
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <VerificationBadge level={asset.verificationLevel} />
              </div>

              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent pointer-events-none" />
            </div>
            
            <div className="flex gap-4 p-4 vault-glass">
                <div className="flex-1 text-center border-r border-obsidian-800">
                    <span className="block text-xs text-slate-muted uppercase">Weight</span>
                    <span className="text-slate-100 font-serif">{asset.metadata.weight}</span>
                </div>
                <div className="flex-1 text-center border-r border-obsidian-800">
                    <span className="block text-xs text-slate-muted uppercase">Era</span>
                    <span className="text-slate-100 font-serif">{asset.metadata.era}</span>
                </div>
                <div className="flex-1 text-center">
                    <span className="block text-xs text-slate-muted uppercase">Condition</span>
                    <span className="text-slate-100 font-serif">{asset.metadata.conditionGrade}/10</span>
                </div>
            </div>
          </div>

          {/* Right Column: Asset Info & Actions */}
          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs uppercase tracking-widest text-slate-300 bg-obsidian-800 border border-obsidian-700 px-3 py-1.5 rounded-sm">{asset.category}</span>
              <span className="text-xs uppercase tracking-widest text-slate-300 bg-obsidian-800 border border-obsidian-700 px-3 py-1.5 rounded-sm">{asset.metadata.material}</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-serif text-slate-50 leading-tight mb-8">
              {asset.title}
            </h1>

            <div className="vault-glass p-6 rounded-lg mb-8 border border-gold-500/20 bg-gradient-to-br from-obsidian-900 to-obsidian-950 shadow-[0_4px_30px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-gold-500/40 transition-colors">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <p className="text-sm uppercase tracking-widest text-slate-muted font-medium">Market Value</p>
                    <div className="flex bg-obsidian-950 p-1 rounded border border-obsidian-800">
                        <button 
                            className={`text-[10px] px-2 py-0.5 rounded ${currency === 'ETH' ? 'bg-obsidian-800 text-gold-400' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setCurrency('ETH')}
                        >ETH</button>
                        <button 
                            className={`text-[10px] px-2 py-0.5 rounded ${currency === 'USDC' ? 'bg-obsidian-800 text-gold-400' : 'text-slate-500 hover:text-slate-300'}`}
                            onClick={() => setCurrency('USDC')}
                        >USDC</button>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-serif text-gold-400 transition-all">
                        {currency === 'ETH' ? `${asset.priceETH} ETH` : `$${asset.priceUSDC.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex items-center justify-between text-xs text-slate-muted mb-[-10px]">
                  <span className="flex items-center gap-1"><LineChart className="w-3 h-3 text-gold-500" /> Price History</span>
                </div>
                <PriceHistorySparkline data={asset.priceHistory} />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 relative z-10 mt-6">
                <button onClick={() => setIsEscrowOpen(true)} className="primary-btn flex-1 text-lg py-4 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                  Acquire Asset
                </button>
                <button className="secondary-btn flex-1 text-lg py-4">
                  Make Offer <Scale className="w-5 h-5 ml-2 text-slate-400 group-hover:text-gold-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-obsidian-800 mb-8 flex gap-8">
              <button 
                onClick={() => setActiveTab('provenance')}
                className={`pb-4 text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${activeTab === 'provenance' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-slate-500 hover:text-slate-200'}`}
              >
                The Provenance
              </button>
              <button 
                onClick={() => setActiveTab('blockchain')}
                className={`pb-4 text-sm font-medium tracking-wider uppercase transition-all flex items-center gap-2 ${activeTab === 'blockchain' ? 'text-gold-400 border-b-2 border-gold-400' : 'text-slate-500 hover:text-slate-200'}`}
              >
                On-Chain Data
              </button>
            </div>

            <div className="flex-1">
              {activeTab === 'provenance' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ProvenanceGraph custody={asset.physicalCustody} ownership={asset.digitalOwnership} />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="vault-glass p-6 rounded-lg bg-obsidian-900 border border-obsidian-800 shadow-md">
                    <h3 className="text-lg font-serif text-slate-50 mb-6 flex items-center gap-2 border-b border-obsidian-800 pb-4">
                      <Info className="w-4 h-4 text-gold-500" /> Registry Parameters
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 border-b border-obsidian-800/50 pb-4">
                        <span className="text-slate-muted text-sm">Contract</span>
                        <span className="col-span-2 text-slate-100 font-mono text-sm text-right sm:text-left break-all">{asset.digitalOwnership.contractAddress}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 border-b border-obsidian-800/50 pb-4">
                        <span className="text-slate-muted text-sm">Token ID</span>
                        <span className="col-span-2 text-slate-100 font-mono text-sm text-right sm:text-left">{asset.digitalOwnership.tokenId}</span>
                      </div>
                      {asset.insurancePolicy && (
                        <div className="grid grid-cols-3 gap-4 border-b border-obsidian-800/50 pb-4">
                            <span className="text-slate-muted text-sm">Insurance NFT</span>
                            <span className="col-span-2 text-blue-400 font-mono text-sm text-right sm:text-left">{asset.insurancePolicy.policyId}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-3 gap-4 pb-2">
                        <span className="text-slate-muted text-sm">Appraiser Sig</span>
                        <span className="col-span-2 text-slate-100 font-mono text-sm text-right sm:text-left flex items-center gap-2">
                          {asset.metadata.appraiserSignature}
                        </span>
                      </div>
                    </div>

                    <a href="#" className="mt-8 inline-flex w-full items-center justify-center p-3 text-sm text-gold-400 border border-gold-500/30 hover:bg-gold-500/10 rounded-sm transition-all shadow-inner hover:shadow-[0_0_15px_rgba(212,175,55,0.1)]">
                      View on Etherscan <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </motion.div>
              )}
            </div>

          </div>
        </div>
        
        <TransactionEscrowFlow 
          isOpen={isEscrowOpen} 
          onClose={() => setIsEscrowOpen(false)} 
          asset={asset} 
        />
      </div>
    </PageTransition>
  );
}

