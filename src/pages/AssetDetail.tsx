import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useParams, Link } from 'react-router-dom';
import { mockRegistry } from '../lib/mockRegistry';
import { ArrowLeft, ExternalLink, ShieldCheck, ShieldAlert, BadgeCheck, Scale, Info, LineChart, Tag, Activity, Hexagon, Eye, Heart, History, ChevronDown, Share2, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { ProvenanceGraph } from '../components/ui/ProvenanceGraph';
import { PriceHistorySparkline } from '../components/ui/PriceHistorySparkline';
import { PageTransition } from '../components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import { TransactionEscrowFlow } from '../components/ui/TransactionEscrowFlow';
import '@google/model-viewer';

function VerificationBadge({ level }: { level: number }) {
  if (level === 3) {
    return (
      <div className="inline-flex items-center gap-2 bg-gold-900/60 border border-gold-500/50 text-gold-400 px-4 py-2 rounded-full justify-center shadow-[0_0_15px_rgba(212,175,55,0.2)] backdrop-blur-md">
        <ShieldCheck className="w-4 h-4 fill-gold-950" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Protocol Insured (L3)</span>
      </div>
    );
  } else if (level === 2) {
    return (
      <div className="inline-flex items-center gap-2 bg-blue-900/60 border border-blue-500/50 text-blue-400 px-4 py-2 rounded-full justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md">
        <BadgeCheck className="w-4 h-4 fill-blue-950" />
        <span className="text-[10px] uppercase tracking-widest font-bold">Appraiser Verified (L2)</span>
      </div>
    );
  }
  return (
    <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-700 text-slate-300 px-4 py-2 rounded-full justify-center backdrop-blur-md">
      <ShieldAlert className="w-4 h-4" />
      <span className="text-[10px] uppercase tracking-widest font-bold">Community Verified (L1)</span>
    </div>
  );
}

function Accordion({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-obsidian-800 last:border-0 vault-glass bg-obsidian-950/20">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 hover:bg-obsidian-900/50 transition-colors"
            >
                <span className="flex items-center gap-3 font-serif text-slate-100 text-lg">
                    {icon} {title}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-5 pt-0 border-t border-transparent">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const getMockDescription = (title: string, category: string, era: string) => `This highly sought-after ${title.toLowerCase()} is an exceptional artifact preserved perfectly from the ${era}. Originally belonging to exclusive private collections, it has now been secured implicitly under Aura Protocol's decentralized vault architecture. Fully digitized and legally tied to its cryptographic token, this piece of ${category.toLowerCase()} history guarantees immutable provenance and borderless transferability, bridging the divide between tangible world-class heritage and flawless blockchain escrow.`;

export default function AssetDetail() {
  const { id } = useParams();
  const asset = mockRegistry.find(a => a.id === id) || mockRegistry[0];
  const [isEscrowOpen, setIsEscrowOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [offerValue, setOfferValue] = useState('');
  const [selectedImage, setSelectedImage] = useState(asset.image);
  const [is3DActive, setIs3DActive] = useState(false);

  // Reset selected image when route changes
  useEffect(() => {
    setSelectedImage(asset.image);
  }, [asset.id]);

  // Lock body scroll when offer modal is open
  useEffect(() => {
    if (isOfferOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOfferOpen]);

  // Fallbacks for new mocks
  const era = asset.metadata.era || 'Antiquity';
  const mat = asset.metadata.material || 'Unknown Material';
  const cond = asset.metadata.conditionGrade || 'N/A';
  const cOwner = asset.digitalOwnership?.currentOwner || '0xMarket...';
  const cAddr = asset.digitalOwnership?.contractAddress || '0xVault...';
  const pVault = asset.physicalCustody?.vaultLocation || 'Secured Central Vault';
  const pLastInsp = asset.physicalCustody?.lastInspected || 'Recently Checked';
  const tID = asset.digitalOwnership?.tokenId || 'N/A';

  const mockActivity = [
    { id: 1, event: 'List', price: `${asset.priceETH} ETH`, from: cOwner, to: 'Marketplace', date: '2 days ago', Icon: Tag },
    { id: 2, event: 'Transfer', price: '-', from: '0x1A4...B42', to: cOwner, date: '1 month ago', Icon: Activity },
    { id: 3, event: 'Mint & Vault', price: '12 ETH', from: 'NullAddress', to: '0x1A4...B42', date: '6 months ago', Icon: Hexagon },
  ];

  return (
    <PageTransition>
      {/* Decorative Glow Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[10%] left-[50%] w-[50vw] h-[50vw] -translate-x-1/2 bg-gold-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-[90rem] mx-auto px-4 py-8">
        <Link to="/browse" className="inline-flex items-center text-slate-muted hover:text-gold-400 font-sans text-sm mb-8 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Registry
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 xl:gap-14">
          
          {/* Left Column: Media & Deep Details */}
          <div className="flex-1 space-y-12">
            
            {/* Immersive Image Display */}
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-obsidian-950 border border-obsidian-800 rounded-2xl overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] group isolation-auto">
                <AnimatePresence mode="wait">
                  {is3DActive && asset.model3d ? (
                    <motion.div
                      key="3d-viewer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full bg-obsidian-950"
                    >
                      <model-viewer
                        src={asset.model3d}
                        alt={`3D model of ${asset.title}`}
                        camera-controls
                        auto-rotate
                        shadow-intensity="1"
                        exposure="0.5"
                        environment-image="neutral"
                        style={{ width: '100%', height: '100%', '--poster-color': 'transparent' } as any}
                        className="w-full h-full"
                      />
                    </motion.div>
                  ) : (
                    <motion.img 
                      key={selectedImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      src={selectedImage} 
                      alt={asset.title} 
                      className="w-full h-full object-cover transform transition-transform duration-[6s] group-hover:scale-[1.03]"
                    />
                  )}
                </AnimatePresence>
                
                <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
                  <VerificationBadge level={asset.verificationLevel} />
                </div>

                {asset.model3d && (
                  <div className="absolute top-6 right-6 z-20">
                    <button
                      onClick={() => setIs3DActive(!is3DActive)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 font-sans text-xs uppercase tracking-widest font-bold shadow-lg ${
                        is3DActive 
                          ? 'bg-gold-500 text-obsidian-950 border-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                          : 'bg-obsidian-900/60 text-gold-400 border-gold-500/30 hover:bg-gold-500/10'
                      }`}
                    >
                      <Activity className={`w-3.5 h-3.5 ${is3DActive ? 'animate-pulse' : ''}`} />
                      {is3DActive ? 'Exit 3D View' : 'View in 3D'}
                    </button>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian-950 via-obsidian-950/40 to-transparent pointer-events-none" />
              </div>

              {/* Thumbnails Gallery */}
              {'gallery' in asset && Array.isArray((asset as any).gallery) && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 custom-scroll">
                    {(asset as any).gallery.map((imgUrl: string, idx: number) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(imgUrl)}
                            className={`relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                                selectedImage === imgUrl 
                                  ? 'border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.4)] opacity-100' 
                                  : 'border-transparent opacity-50 hover:opacity-100 hover:border-obsidian-600'
                            }`}
                        >
                            <img src={imgUrl} alt="gallery thumbnail" className="w-full h-full object-cover" />
                        </button>
                    ))}
                </div>
              )}
            </div>
            
            {/* About Artifact Section */}
            <div>
               <div className="flex items-center justify-between border-b border-obsidian-800 pb-4 mb-6">
                  <h2 className="text-2xl font-serif text-slate-50">About this Artifact</h2>
                  <div className="flex gap-4 text-slate-400">
                      <span className="flex items-center gap-1.5 hover:text-gold-400 cursor-pointer transition-colors text-sm"><Eye className="w-4 h-4" /> 1.2k</span>
                      <span className="flex items-center gap-1.5 hover:text-gold-400 cursor-pointer transition-colors text-sm"><Heart className="w-4 h-4" /> 342</span>
                  </div>
               </div>
               <p className="text-slate-300 leading-relaxed font-sans font-light text-lg">
                  {getMockDescription(asset.title, asset.category, era)}
               </p>
            </div>

            {/* Traits Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Era', value: era },
                    { label: 'Material', value: mat },
                    { label: 'Condition', value: `${cond}/10 CND` },
                    { label: 'Category', value: asset.category },
                ].map(trait => (
                    <div key={trait.label} className="vault-glass p-5 rounded-xl border border-obsidian-800 text-center hover:border-gold-500/30 transition-colors cursor-default bg-obsidian-900/30">
                        <span className="block text-[10px] uppercase tracking-widest text-gold-500/80 mb-2 font-semibold">{trait.label}</span>
                        <span className="text-slate-200 font-serif text-lg truncate block px-2" title={trait.value}>{trait.value}</span>
                    </div>
                ))}
            </div>

            {/* Price History Card */}
            {'priceHistory' in asset && Array.isArray((asset as any).priceHistory) && (asset as any).priceHistory.length > 0 && (
                <div className="vault-glass p-8 rounded-2xl border border-obsidian-800 bg-obsidian-950/50 shadow-lg">
                <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3 mb-8 border-b border-obsidian-800 pb-4">
                    <LineChart className="w-6 h-6 text-gold-500" /> Price History (All Time)
                </h3>
                <div className="h-64 w-full opacity-80 hover:opacity-100 transition-opacity">
                    <PriceHistorySparkline data={(asset as any).priceHistory} />
                </div>
                </div>
            )}

            {/* Item Activity */}
            <div className="vault-glass rounded-2xl border border-obsidian-800 overflow-hidden shadow-lg mb-16">
               <div className="p-6 border-b border-obsidian-800 bg-obsidian-900/40">
                 <h3 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                    <History className="w-6 h-6 text-gold-500" /> Ledger Activity
                 </h3>
               </div>
               <div className="w-full overflow-x-auto">
                   <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                      <thead className="bg-obsidian-950/80 text-[10px] uppercase tracking-widest text-slate-500 border-b border-obsidian-800">
                         <tr>
                           <th className="p-5 font-medium">Event</th>
                           <th className="p-5 font-medium">Price</th>
                           <th className="p-5 font-medium">From</th>
                           <th className="p-5 font-medium">To</th>
                           <th className="p-5 font-medium text-right">Date</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-obsidian-800/50 bg-obsidian-900/10">
                         {mockActivity.map(act => (
                           <tr key={act.id} className="hover:bg-obsidian-800/30 transition-colors">
                             <td className="p-5 flex items-center gap-2">
                                <act.Icon className="w-4 h-4 text-slate-400" /> {act.event}
                             </td>
                             <td className="p-5 font-mono text-gold-400 font-semibold">{act.price}</td>
                             <td className="p-5 font-mono text-slate-400">{act.from.substring(0,8)}...</td>
                             <td className="p-5 font-mono text-slate-400">{act.to.substring(0,8)}...</td>
                             <td className="p-5 text-right text-slate-500">{act.date} <ExternalLink className="w-3 h-3 inline ml-1 opacity-50 hover:opacity-100 cursor-pointer" /></td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
               </div>
            </div>

          </div>

          {/* Right Column: Order Panel & Data Accordions */}
          <aside className="w-full lg:w-[420px] xl:w-[460px] shrink-0 space-y-8">
            <div className="sticky top-24 space-y-6">
               
               {/* Header Info */}
               <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase tracking-widest text-gold-400 bg-gold-900/20 border border-gold-500/30 px-3 py-1.5 rounded-full font-semibold">
                       {asset.category}
                    </span>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-full border border-obsidian-800 flex items-center justify-center hover:bg-obsidian-800 transition-colors">
                            <Share2 className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="w-8 h-8 rounded-full border border-obsidian-800 flex items-center justify-center hover:bg-obsidian-800 transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </button>
                    </div>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-serif text-slate-50 leading-[1.1] mb-4 drop-shadow-md">
                    {asset.title}
                  </h1>
                  <p className="text-slate-400 font-sans text-sm flex items-center gap-2">
                    Secured by <span className="font-mono text-gold-500 hover:underline cursor-pointer">{cAddr.substring(0,8)}...</span>
                  </p>
               </div>

               {/* Advanced Order Panel */}
               <div className="vault-glass p-6 rounded-2xl border border-gold-500/30 shadow-[0_15px_40px_rgba(212,175,55,0.08)] relative overflow-hidden group hover:border-gold-500/60 transition-colors bg-obsidian-950/80">
                  <div className="absolute top-[-50%] right-[-20%] w-[250px] h-[250px] bg-gold-500/10 rounded-full blur-[80px] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:bg-gold-500/20" />
                  
                  <div className="mb-6 relative z-10">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                          Current Price <Info className="w-3 h-3 cursor-help hover:text-slate-200" />
                      </span>
                      <div className="flex items-baseline gap-3">
                          <span className="text-4xl lg:text-5xl font-serif text-gold-400 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                              {asset.priceETH} ETH
                          </span>
                          <span className="text-sm font-sans text-slate-500 font-medium tracking-wide">
                              ≈ ${(asset.priceETH * 2750).toLocaleString()}
                          </span>
                      </div>
                  </div>

                  <div className="flex gap-4 mb-6 relative z-10">
                      <div className="flex-1 bg-obsidian-950/50 border border-obsidian-800 rounded-xl p-3 text-center shadow-inner">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Sale Ends</span>
                          <span className="text-sm font-mono text-slate-200 flex items-center justify-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" /> 2d 14h 45m
                          </span>
                      </div>
                      <div className="flex-1 bg-obsidian-950/50 border border-obsidian-800 rounded-xl p-3 text-center shadow-inner">
                          <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Highest Offer</span>
                          <span className="text-sm font-mono text-slate-200">{(asset.priceETH * 0.9).toFixed(2)} ETH</span>
                      </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                      <button 
                        onClick={() => setIsEscrowOpen(true)} 
                        className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 text-lg uppercase tracking-wide cursor-pointer"
                      >
                          Buy Asset Now
                      </button>
                      <button 
                         onClick={() => setIsOfferOpen(true)}
                         className="w-full bg-obsidian-900 border border-obsidian-700 text-slate-300 font-bold py-4 rounded-xl hover:bg-obsidian-800 hover:border-gold-500/50 hover:text-white transition-all flex justify-center items-center gap-2 tracking-wide cursor-pointer"
                      >
                          <Scale className="w-5 h-5" /> Make Offer
                      </button>
                  </div>
               </div>

               {/* Collapsible Meta Accordions */}
               <div className="border border-obsidian-800 rounded-2xl overflow-hidden shadow-lg vault-glass backdrop-blur-xl">
                   <Accordion title="Location & Vaulting" icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} defaultOpen={true}>
                       <div className="space-y-5">
                          <div className="flex justify-between items-center pb-3 border-b border-obsidian-800/50">
                              <span className="text-slate-400 text-sm">Physical Vault</span>
                              <span className="text-slate-100 text-sm font-medium text-right">{pVault}</span>
                          </div>
                          <div className="flex justify-between items-center pb-3 border-b border-obsidian-800/50">
                              <span className="text-slate-400 text-sm">Last Inspection</span>
                              <span className="text-slate-100 text-sm font-mono">{pLastInsp}</span>
                          </div>
                          {'insurancePolicy' in asset && (asset as any).insurancePolicy && (
                              <div className="flex justify-between flex-col gap-2">
                                  <span className="text-slate-400 text-sm">Escrow Underwriter</span>
                                  <div className="bg-obsidian-950 p-3 rounded-lg border border-obsidian-800 flex justify-between items-center">
                                      <span className="text-gold-400 text-xs uppercase tracking-widest">{(asset as any).insurancePolicy.provider}</span>
                                      <span className="font-mono text-xs text-slate-500">{(asset as any).insurancePolicy.policyId}</span>
                                  </div>
                              </div>
                          )}
                       </div>
                   </Accordion>

                   {asset.physicalCustody && asset.digitalOwnership && (
                     <Accordion title="The Provenance Network" icon={<ShieldCheck className="w-5 h-5 text-gold-500" />}>
                        <div className="py-2">
                        <ProvenanceGraph custody={asset.physicalCustody} ownership={asset.digitalOwnership} />
                        </div>
                     </Accordion>
                   )}
                   
                   <Accordion title="On-Chain Registry" icon={<Hexagon className="w-5 h-5 text-blue-400" />}>
                      <div className="space-y-3">
                          <div className="flex justify-between items-center bg-obsidian-950 p-4 rounded-xl border border-obsidian-800">
                              <span className="text-slate-400 text-sm">Contract Addr.</span>
                              <a href="#" className="font-mono text-sm text-gold-400 hover:text-gold-300 transition-colors">
                                  {cAddr}
                              </a>
                          </div>
                          <div className="flex justify-between items-center bg-obsidian-950 p-4 rounded-xl border border-obsidian-800">
                              <span className="text-slate-400 text-sm">Token ID</span>
                              <span className="font-mono text-sm text-slate-200">{tID}</span>
                          </div>
                          <div className="flex justify-between items-center bg-obsidian-950 p-4 rounded-xl border border-obsidian-800">
                              <span className="text-slate-400 text-sm">Blockchain</span>
                              <span className="font-sans text-sm text-slate-200 flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span> Mainnet
                              </span>
                          </div>
                      </div>
                   </Accordion>
               </div>
               
            </div>
          </aside>

        </div>
        
        <TransactionEscrowFlow 
          isOpen={isEscrowOpen} 
          onClose={() => setIsEscrowOpen(false)} 
          asset={asset} 
        />

        {/* Custom Make Offer Modal */}
        {createPortal(
          <AnimatePresence>
              {isOfferOpen && (
                  <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                      <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-obsidian-950/80 backdrop-blur-sm"
                          onClick={() => setIsOfferOpen(false)}
                      />
                      <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-obsidian-900 border border-obsidian-700 rounded-2xl shadow-2xl overflow-hidden vault-glass m-auto"
                      >
                          <div className="p-4 sm:p-6 border-b border-obsidian-800 flex justify-between items-center bg-obsidian-950/50 shrink-0">
                              <h2 className="text-xl font-serif text-slate-50 flex items-center gap-2">
                                  <Scale className="w-5 h-5 text-gold-500" /> Submit Formal Offer
                              </h2>
                          </div>
                          <div className="p-4 sm:p-8 overflow-y-auto custom-scroll">
                            <div className="mb-6 flex justify-between items-end border-b border-obsidian-800/50 pb-4">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Asset</span>
                                    <span className="text-slate-200 font-serif line-clamp-1">{asset.title}</span>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold block mb-1">Asking Price</span>
                                    <span className="text-slate-400 font-mono text-sm">{asset.priceETH} ETH</span>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <label className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest mb-3 block">Your Proposed Offer</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 border-r border-obsidian-700 pr-3 flex items-center gap-1.5 pointer-events-none">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#627EEA]" />
                                        <span className="text-slate-300 font-bold text-sm">ETH</span>
                                    </div>
                                    <input 
                                        type="number"
                                        placeholder="0.00"
                                        value={offerValue}
                                        onChange={(e) => setOfferValue(e.target.value)}
                                        className="w-full bg-obsidian-950 border border-obsidian-700 focus:border-gold-500/80 rounded-xl py-4 pl-[80px] pr-4 text-2xl font-serif text-slate-100 placeholder:text-slate-700 outline-none transition-colors shadow-inner appearance-none"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 mt-2 text-right">
                                    ≈ ${(Number(offerValue || 0) * 2750).toLocaleString()} USD
                                </p>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={() => {
                                        alert(`Signature Requested for Offer of ${offerValue} ETH`);
                                        setIsOfferOpen(false);
                                    }}
                                    disabled={!offerValue || Number(offerValue) <= 0}
                                    className="w-full py-4 bg-obsidian-800 hover:bg-obsidian-700 text-slate-100 font-bold rounded-xl transition-all uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-obsidian-600 focus:ring-2 focus:ring-gold-500/20"
                                >
                                    Sign & Submit Offer
                                </button>
                                <button 
                                    onClick={() => setIsOfferOpen(false)}
                                    className="w-full py-4 text-slate-500 hover:text-slate-300 font-semibold uppercase tracking-widest text-xs transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </PageTransition>
  );
}
