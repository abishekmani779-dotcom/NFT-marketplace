import React, { useState, useEffect, useMemo } from 'react';
import { mockRegistry, floorPriceData } from '../lib/mockRegistry';
import { Filter, Search, ShieldCheck, BarChart3, QrCode, Hexagon, ShieldAlert, BadgeCheck, Zap, SlidersHorizontal, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Browse() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters state
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [verLevels, setVerLevels] = useState<number[]>([]);
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{min: string, max: string}>({min: '', max: ''});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [categoryFilter, searchTerm, verLevels, selectedEras, priceRange, currentPage]);

  // Derived filter options
  const categories = useMemo(() => Array.from(new Set(mockRegistry.map(a => a.category))), []);
  const eras = useMemo(() => Array.from(new Set(mockRegistry.map(a => a.metadata.era))), []);

  // Handlers
  const toggleVerLevel = (level: number) => {
    setVerLevels(prev => prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]);
  };
  
  const toggleEra = (era: string) => {
    setSelectedEras(prev => prev.includes(era) ? prev.filter(e => e !== era) : [...prev, era]);
  };

  const filtered = useMemo(() => mockRegistry.filter(item => {
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (searchTerm && !item.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (verLevels.length > 0 && !verLevels.includes(item.verificationLevel)) return false;
    if (selectedEras.length > 0 && !selectedEras.includes(item.metadata.era)) return false;
    if (priceRange.min && item.priceETH < parseFloat(priceRange.min)) return false;
    if (priceRange.max && item.priceETH > parseFloat(priceRange.max)) return false;
    return true;
  }), [categoryFilter, searchTerm, verLevels, selectedEras, priceRange]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // Reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, searchTerm, verLevels, selectedEras, priceRange]);

  return (
    <PageTransition>
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(10, 10, 10, 0.5);
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.2);
          border-radius: 4px;
        }
        .custom-scroll:hover::-webkit-scrollbar-thumb {
          background: rgba(212, 175, 55, 0.5);
        }
      `}</style>
      <div className="max-w-[90rem] mx-auto px-4 py-8 flex flex-col xl:flex-row gap-8 min-h-[80vh]">
        
        {/* Sidebar Analytics & Filters */}
        <aside className="custom-scroll w-full xl:w-80 shrink-0 space-y-6 vault-glass p-6 rounded-xl border border-obsidian-800 hover:border-gold-500/20 transition-colors h-[calc(100vh-8rem)] sticky top-24 self-start overflow-y-auto hidden xl:block shadow-[0_8px_30px_rgb(0,0,0,0.5)] z-20">
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-obsidian-800 pb-4">
              <h2 className="text-xl font-serif text-slate-100 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-gold-500" /> Vault Filters
              </h2>
              <button 
                onClick={() => { setCategoryFilter(''); setVerLevels([]); setSelectedEras([]); setPriceRange({min: '', max: ''}); }}
                className="text-[10px] text-slate-500 uppercase tracking-widest hover:text-gold-400 transition-colors"
              >
                Reset All
              </button>
            </div>
            
            {/* Market analytics micro-chart */}
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-medium flex items-center gap-2">
                 Market Floors <BarChart3 className="w-3 h-3 text-gold-500" />
              </p>
              <div className="h-28 w-full bg-obsidian-950/80 rounded-lg border border-obsidian-800/80 p-2 shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={floorPriceData}>
                    <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#141414' }} contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '4px', fontSize: '10px' }} />
                    <Bar dataKey="floor" fill="#D4AF37" radius={[2, 2, 0, 0]} opacity={0.6} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-8">
              {/* Category Filter */}
              <div>
                <label className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest mb-3 block">Asset Category</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setCategoryFilter('')}
                    className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg border transition-all ${categoryFilter === '' ? 'bg-gold-500/10 border-gold-500/50 text-gold-400' : 'bg-obsidian-900/50 border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-800'}`}
                  >
                    View All Vaults
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setCategoryFilter(cat)}
                      className={`w-full flex items-center justify-between text-sm px-3 py-2 rounded-lg border transition-all ${categoryFilter === cat ? 'bg-gold-500/10 border-gold-500/50 text-gold-400' : 'bg-obsidian-900/50 border-transparent text-slate-400 hover:text-slate-200 hover:bg-obsidian-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-obsidian-800/60 pt-6">
                <label className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest mb-3 block">Price Range (ETH)</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">Ξ</span>
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(p => ({...p, min: e.target.value}))}
                      className="w-full bg-obsidian-950 border border-obsidian-800 rounded-md py-2 pl-7 pr-3 text-sm text-slate-200 placeholder-slate-600 focus:border-gold-500 outline-none font-mono" 
                    />
                  </div>
                  <span className="text-slate-600">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">Ξ</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(p => ({...p, max: e.target.value}))}
                      className="w-full bg-obsidian-950 border border-obsidian-800 rounded-md py-2 pl-7 pr-3 text-sm text-slate-200 placeholder-slate-600 focus:border-gold-500 outline-none font-mono" 
                    />
                  </div>
                </div>
              </div>

              {/* Verification Level */}
              <div className="border-t border-obsidian-800/60 pt-6">
                <label className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest mb-3 block">Oracle Verification</label>
                <div className="space-y-2">
                  {[
                    { level: 3, label: 'L3 Standard (Insured)', icon: ShieldCheck, color: 'text-gold-400' },
                    { level: 2, label: 'L2 Verified', icon: BadgeCheck, color: 'text-blue-400' },
                  ].map((lvl) => {
                    const isActive = verLevels.includes(lvl.level);
                    return (
                      <button 
                        key={lvl.level}
                        onClick={() => toggleVerLevel(lvl.level)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-sm transition-all ${isActive ? 'bg-gold-500/5 border-gold-500/30' : 'bg-transparent border-transparent hover:bg-obsidian-800'}`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-gold-500 border-gold-500' : 'border-slate-600'}`}>
                          {isActive && <Check className="w-3 h-3 text-obsidian-950" />}
                        </div>
                        <lvl.icon className={`w-4 h-4 ${lvl.color}`} />
                        <span className={isActive ? 'text-slate-200' : 'text-slate-400'}>{lvl.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Historical Era */}
              <div className="border-t border-obsidian-800/60 pt-6">
                <label className="text-[11px] font-semibold text-gold-500 uppercase tracking-widest mb-3 block">Historical Era</label>
                <div className="flex flex-wrap gap-2">
                  {eras.map(era => {
                    const isActive = selectedEras.includes(era);
                    return (
                      <button 
                        key={era}
                        onClick={() => toggleEra(era)}
                        className={`text-[10px] px-3 py-1.5 rounded-full border transition-all uppercase tracking-wider ${isActive ? 'bg-gold-500/10 border-gold-500/50 text-gold-400' : 'bg-obsidian-900 border-obsidian-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'}`}
                      >
                        {era}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </aside>

        {/* Main Vault Content */}
        <main className="flex-1 w-full max-w-full">
          {/* Header & Search */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-obsidian-900/40 p-5 rounded-xl border border-obsidian-800 backdrop-blur-md shadow-lg">
            <div>
              <h1 className="text-2xl font-serif text-slate-50 mb-1">Global Registry</h1>
              <p className="text-slate-400 text-sm flex items-center gap-2">
                <Hexagon className="w-4 h-4 text-gold-500" /> 
                {isLoading ? <span className="animate-pulse">Syncing to chain...</span> : <span>{filtered.length} Verifiable Assets</span>}
              </p>
            </div>
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-obsidian-950 border border-obsidian-700/60 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-gold-500/70 focus:ring-1 focus:ring-gold-500/30 text-slate-100 placeholder-slate-500 transition-all font-mono shadow-inner"
              />
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((skel) => (
                <div key={skel} className="bg-obsidian-900 overflow-hidden shadow-2xl rounded-xl border border-obsidian-800 animate-pulse h-[400px]">
                  <div className="aspect-[4/3] bg-obsidian-800/50 w-full" />
                  <div className="p-5">
                    <div className="h-6 bg-obsidian-800 rounded w-3/4 mb-4" />
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 bg-obsidian-800 rounded w-16" />
                      <div className="h-5 bg-obsidian-800 rounded w-16" />
                    </div>
                    <div className="flex justify-between items-end mt-8">
                        <div className="h-10 bg-obsidian-800 rounded w-24" />
                        <div className="h-5 bg-obsidian-800 rounded w-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {currentItems.map((item) => (
                  <motion.div
                    variants={itemVariants}
                    key={item.id}
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="relative group/card block h-full isolation-auto"
                  >
                    <div 
                      onClick={() => navigate(`/asset/${item.id}`)}
                      className="relative bg-[#0d0d0d] overflow-hidden transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group-hover/card:shadow-[0_20px_40px_rgba(212,175,55,0.15)] rounded-xl border border-obsidian-800 hover:border-gold-500/40 hover:-translate-y-1 flex flex-col h-full cursor-pointer z-10 block"
                    >
                      {/* Glowing background */}
                      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gold-500/0 to-gold-500/5 z-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                      {/* Image Section */}
                      <div className="relative aspect-[4/3] bg-obsidian-950 overflow-hidden border-b border-obsidian-800/80 shrink-0">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-110 transition-transform duration-[3s]" />
                        
                        {/* Subdued 'Quick Buy' Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-obsidian-950/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-[10] flex items-center justify-center backdrop-blur-[2px]">
                          <button 
                              onClick={(e) => { e.stopPropagation(); navigate(`/asset/${item.id}`); }}
                              className="bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold px-6 py-2.5 rounded-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] transform translate-y-4 group-hover/card:translate-y-0 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
                          >
                              <Zap className="w-4 h-4 fill-obsidian-950 text-obsidian-950" /> Secure Asset
                          </button>
                        </div>

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 z-[15] flex gap-2">
                          <span className={`text-[9px] uppercase tracking-widest px-2 py-1 rounded border flex items-center gap-1.5 backdrop-blur-md shadow-lg font-semibold ${item.verificationLevel === 3 ? 'bg-gold-900/80 border-gold-500/50 text-gold-400' : 'bg-blue-900/80 border-blue-500/50 text-blue-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${item.verificationLevel === 3 ? 'bg-gold-400 animate-pulse' : 'bg-blue-400'}`} />
                            L{item.verificationLevel}
                          </span>
                        </div>

                        {/* Top Right Icons */}
                        <div className="absolute top-4 right-4 z-[15] flex flex-col gap-2">
                            <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-obsidian-950/90 border border-obsidian-700 backdrop-blur-sm shadow-xl items-center flex justify-center">
                              {item.verificationLevel === 3 && <div className="absolute inset-0 rounded-lg shadow-[0_0_12px_#D4AF37] opacity-60 animate-pulse pointer-events-none" />}
                              <VerificationIcon level={item.verificationLevel} />
                            </div>
                        </div>

                        {/* Floating QR on hover */}
                        <div className="absolute bottom-4 right-4 z-[20] opacity-0 group-hover/card:opacity-100 translate-y-2 group-hover/card:translate-y-0 transition-all duration-300">
                            <div 
                              onClick={(e) => e.stopPropagation()} 
                              className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-obsidian-950/90 border border-obsidian-700/50 shadow-2xl backdrop-blur-md cursor-help group/qr"
                            >
                                <QrCode className="w-4 h-4 text-slate-300 group-hover/qr:text-gold-400 transition-colors" />
                                <div className="absolute right-0 bottom-10 bg-obsidian-950 border border-obsidian-700 p-2.5 rounded-lg shadow-[0_20px_40px_rgba(0,0,0,0.8)] opacity-0 invisible group-hover/qr:opacity-100 group-hover/qr:visible transition-all pointer-events-none">
                                    <QRCodeSVG value={`https://etherscan.io/token/${item.digitalOwnership.contractAddress}?a=${item.digitalOwnership.tokenId}`} size={80} bgColor="#0a0a0a" fgColor="#D4AF37" />
                                </div>
                            </div>
                        </div>
                      </div>
                      
                      {/* Details Section */}
                      <div className="flex-1 flex flex-col relative z-20">
                          <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className="font-serif text-xl text-slate-100 group-hover/card:text-gold-400 transition-colors line-clamp-1 mb-3 drop-shadow-md">
                                    {item.title}
                                </h3>
                                
                                <div className="flex flex-wrap gap-2 mb-5">
                                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 bg-obsidian-900 border border-obsidian-800 px-2 py-1 rounded shadow-inner">{item.category}</span>
                                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 bg-obsidian-900 border border-obsidian-800 px-2 py-1 rounded shadow-inner truncate max-w-[124px]" title={item.metadata.era}>{item.metadata.era}</span>
                                    <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 bg-obsidian-900 border border-obsidian-800 px-2 py-1 rounded shadow-inner block shrink-0">{item.metadata.conditionGrade}/10 CND</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-end pt-4 border-t border-obsidian-800/80 mt-auto">
                                  <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Market Price</span>
                                    <span className="font-serif text-xl text-gold-400 transition-transform drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                                        {item.priceETH.toFixed(2)} <span className="text-sm font-sans text-slate-500">ETH</span>
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-500 font-mono mb-1 rounded flex items-center gap-1 group-hover/card:text-gold-500 transition-colors">
                                      #{item.digitalOwnership.tokenId}
                                  </span>
                              </div>
                          </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2 border-t border-obsidian-800/50 pt-8">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg border border-obsidian-800 bg-obsidian-900/50 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center gap-2 mx-4">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const page = i + 1;
                      const isActive = currentPage === page;
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-mono transition-colors ${isActive ? 'bg-gold-500/10 border-gold-500/50 text-gold-400 shadow-[inset_0_0_15px_rgba(212,175,55,0.2)]' : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300 hover:bg-obsidian-800'}`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg border border-obsidian-800 bg-obsidian-900/50 flex items-center justify-center text-slate-400 hover:text-gold-400 hover:border-gold-500/30 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}

          {!isLoading && filtered.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
              className="col-span-full py-28 text-center border border-dashed border-obsidian-700/50 rounded-xl bg-obsidian-900/20 mt-8"
            >
              <div className="w-20 h-20 bg-obsidian-900 border border-obsidian-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Search className="w-8 h-8 text-slate-600 opacity-80" />
              </div>
              <h3 className="text-2xl font-serif text-slate-200 mb-2">No Artifacts Found</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">Try adjusting your filters or expanding your search parameters to explore more vaulted artifacts.</p>
              
              <button 
                onClick={() => { setCategoryFilter(''); setVerLevels([]); setSelectedEras([]); setPriceRange({min: '', max: ''}); setSearchTerm(''); }}
                className="mt-6 text-sm text-gold-500 hover:text-gold-400 border border-gold-500/30 px-5 py-2 rounded-lg bg-gold-500/5 hover:bg-gold-500/10 transition-colors"
                >
                Clear all filters
              </button>
            </motion.div>
          )}

        </main>
      </div>
    </PageTransition>
  );
}
