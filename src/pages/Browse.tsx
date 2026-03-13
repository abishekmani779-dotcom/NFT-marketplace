import React, { useState, useEffect } from 'react';
import { mockRegistry, floorPriceData } from '../lib/mockRegistry';
import { Filter, Search, ShieldCheck, BarChart3, QrCode, Hexagon, ShieldAlert, BadgeCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { QRCodeSVG } from 'qrcode.react';

function VerificationIcon({ level }: { level: number }) {
  if (level === 3) return <ShieldCheck className="w-4 h-4 text-gold-400" />;
  if (level === 2) return <BadgeCheck className="w-4 h-4 text-blue-400" />;
  return <ShieldAlert className="w-4 h-4 text-slate-400" />;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Browse() {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [categoryFilter, searchTerm]);

  const categories = Array.from(new Set(mockRegistry.map(a => a.category)));

  const filtered = mockRegistry.filter(item => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <PageTransition>
      <div className="max-w-[90rem] mx-auto px-4 py-8 flex flex-col xl:flex-row gap-8 min-h-[80vh]">
        
        {/* Sidebar Analytics & Filters */}
        <aside className="w-full xl:w-80 shrink-0 space-y-6 vault-glass p-6 rounded-lg sticky top-24 self-start border border-obsidian-800 hover:border-gold-500/20 transition-colors h-fit max-h-[calc(100vh-8rem)] overflow-y-auto hidden xl:block shadow-2xl">
          <div>
            <h2 className="text-xl font-serif text-slate-100 flex items-center gap-2 mb-6 border-b border-obsidian-800 pb-4">
              <BarChart3 className="w-5 h-5 text-gold-500" /> Market Analytics
            </h2>
            
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-slate-muted mb-4 font-medium">Category Floor Price (ETH)</p>
              <div className="h-40 w-full bg-obsidian-950/50 rounded-sm border border-obsidian-800 p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floorPriceData}>
                    <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                      cursor={{ fill: '#141414' }} 
                      contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', fontSize: '12px' }} 
                    />
                    <Bar dataKey="floor" fill="#D4AF37" radius={[2, 2, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3 block">Filter Category</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:text-gold-400 transition-colors bg-obsidian-900/50 p-2 rounded border border-obsidian-800 hover:border-gold-500/30">
                    <input type="radio" name="category" className="accent-gold-500" checked={categoryFilter === ''} onChange={() => { setCategoryFilter(''); setIsLoading(true); }} />
                    View All Vaults
                  </label>
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 text-sm text-slate-300 cursor-pointer hover:text-gold-400 transition-colors bg-obsidian-900/50 p-2 rounded border border-obsidian-800 hover:border-gold-500/30">
                      <input type="radio" name="category" className="accent-gold-500" checked={categoryFilter === cat} onChange={() => { setCategoryFilter(cat); setIsLoading(true); }} />
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-obsidian-800 pt-6">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-3 block">Price Range (ETH)</label>
                <input type="range" className="w-full accent-gold-500 h-1 bg-obsidian-800 rounded-full appearance-none outline-none" min="0" max="100" />
                <div className="flex justify-between text-xs text-slate-muted mt-2 font-mono">
                  <span>0 ETH</span>
                  <span>100+ ETH</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Vault Content */}
        <main className="flex-1">
          <div className="mb-8 flex justify-between items-center bg-obsidian-900/80 p-3 rounded-lg border border-obsidian-800 shadow-lg backdrop-blur-md">
            <p className="text-slate-muted text-sm ml-2 font-medium flex items-center gap-2 lg:min-w-max">
              <Hexagon className="w-4 h-4 text-gold-500" /> {isLoading ? 'Fetching...' : `${filtered.length} Indexed Assets`}
            </p>
            <div className="relative w-full ml-4 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search registry by Title..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setIsLoading(true); }}
                className="w-full bg-obsidian-950 border border-obsidian-700/50 rounded py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50 text-slate-100 placeholder-slate-500 transition-all font-mono"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((skel) => (
                <div key={skel} className="relative bg-obsidian-900 overflow-hidden shadow-2xl rounded-sm border border-obsidian-800 animate-pulse h-[380px]">
                  <div className="aspect-[4/3] bg-obsidian-800/50 w-full" />
                  <div className="p-5">
                    <div className="h-6 bg-obsidian-800 rounded w-3/4 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 bg-obsidian-800 rounded w-16" />
                      <div className="h-5 bg-obsidian-800 rounded w-16" />
                    </div>
                    <div className="flex justify-between items-end mt-6">
                        <div className="h-10 bg-obsidian-800 rounded w-24" />
                        <div className="h-5 bg-obsidian-800 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map((item) => (
                <motion.div
                  variants={itemVariants}
                  key={item.id}
                  onMouseEnter={() => setHoveredCard(item.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative perspective-1000 group/card block h-full preserve-3d"
                >
                  <div className="relative bg-[#111111] overflow-hidden transition-all duration-500 shadow-2xl group-hover/card:shadow-[0_15px_30px_rgba(212,175,55,0.15)] rounded-sm plaque-border">
                    {/* Glowing background */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent to-obsidian-950 z-10 pointer-events-none" />

                    {/* Image Section */}
                    <div className="relative aspect-[4/3] bg-obsidian-950 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-transform duration-[3s]" />
                      
                      {/* Subdued 'Quick Buy' Group Hover Effect Overlay */}
                      <div className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center backdrop-blur-sm pointer-events-none">
                        <button 
                            onClick={(e) => { e.preventDefault(); /* Would trigger Quick Buy flow here */ }}
                            className="bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold px-6 py-2 rounded shadow-[0_0_20px_rgba(212,175,55,0.4)] pointer-events-auto transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)]"
                        >
                            <Zap className="w-4 h-4" /> Quick Buy
                        </button>
                      </div>

                      {/* Top Right Icons */}
                      <div className="absolute top-3 right-3 z-[15] flex flex-col gap-2">
                          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-obsidian-900 border border-obsidian-700 shadow-lg">
                            {item.verificationLevel === 3 && <div className="absolute inset-0 rounded-full shadow-[0_0_10px_#D4AF37] animate-pulse" />}
                            <VerificationIcon level={item.verificationLevel} />
                          </div>
                          
                          {/* Info Button for revealing QR Code */}
                          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-obsidian-900/80 border border-obsidian-700/50 shadow-lg backdrop-blur-sm opacity-50 hover:opacity-100 transition-opacity cursor-help group/qr">
                              <QrCode className="w-3 h-3 text-slate-300" />
                              <div className="absolute right-0 top-8 bg-obsidian-900 border border-obsidian-700 p-2 rounded shadow-2xl opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all">
                                  <QRCodeSVG value={`https://etherscan.io/address/${item.digitalOwnership.contractAddress}`} size={60} />
                              </div>
                          </div>
                      </div>
                    </div>
                    
                    {/* Details Section */}
                    <Link to={`/asset/${item.id}`} className="block relative z-10">
                        <div className="p-5 border-t border-obsidian-900/50 bg-[#111111] hover:bg-obsidian-950 transition-colors">
                            <h3 className="font-serif text-xl text-slate-100 group-hover/card:text-gold-400 transition-colors line-clamp-1 mb-2 drop-shadow-md">
                                {item.title}
                            </h3>
                            
                            <div className="flex gap-2 mb-4">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-obsidian-900 border border-obsidian-800 px-2 py-0.5 rounded-sm shadow-inner">{item.metadata.conditionGrade}/10 Cond.</span>
                                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-obsidian-900 border border-obsidian-800 px-2 py-0.5 rounded-sm shadow-inner">{item.category}</span>
                            </div>

                            <div className="flex justify-between items-end pt-4 border-t border-obsidian-800/80">
                                <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Market Price</span>
                                <span className="font-serif text-lg text-gold-400 drop-shadow-[0_0_5px_rgba(212,175,55,0.3)]">
                                    {item.priceETH} ETH
                                </span>
                                </div>
                                <span className="text-[10px] bg-obsidian-900 border border-obsidian-800 px-2 py-1 text-slate-500 font-mono mb-1 rounded flex items-center gap-1 shadow-inner">
                                    ID: {item.digitalOwnership.tokenId}
                                </span>
                            </div>
                        </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="col-span-full py-24 text-center border border-dashed border-obsidian-700/50 rounded-lg vault-glass mt-8">
              <Hexagon className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-serif text-slate-200 mb-2">No Verified Assets Found</h3>
              <p className="text-slate-500 text-sm">Adjust filters or search query to explore the Vault.</p>
            </div>
          )}

        </main>
      </div>
    </PageTransition>
  );
}
