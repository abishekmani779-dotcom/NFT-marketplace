import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell, 
  PieChart, Pie 
} from 'recharts';
import { 
  Eye, Gavel, TrendingUp, Loader2, CheckCircle, BellRing, 
  Coins, Vault, Award, ArrowUpRight, ArrowDownRight, 
  Clock, ShieldCheck, Globe, Search, Filter, Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// ─── Mock Data ────────────────────────────────────────────────
const mockPerformanceData = [
  { name: 'Mon', viewCount: 120, bids: 2 },
  { name: 'Tue', viewCount: 230, bids: 5 },
  { name: 'Wed', viewCount: 340, bids: 8 },
  { name: 'Thu', viewCount: 290, bids: 6 },
  { name: 'Fri', viewCount: 450, bids: 12 },
  { name: 'Sat', viewCount: 600, bids: 18 },
  { name: 'Sun', viewCount: 850, bids: 25 },
];

const mockPriceData = [
  { name: 'Week 1', floorPrice: 1.2, myPrice: 1.5 },
  { name: 'Week 2', floorPrice: 1.3, myPrice: 1.5 },
  { name: 'Week 3', floorPrice: 1.35, myPrice: 1.5 },
  { name: 'Week 4', floorPrice: 1.6, myPrice: 1.5 },
];

const transactions = [
  { id: 'TX-9021', asset: 'Ming Dynasty Vase', type: 'Primary Sale', amount: '12.4 ETH', date: '2h ago', status: 'Completed', buyer: '0x71C...492' },
  { id: 'TX-8842', asset: 'Imperial Jade Seal', type: 'Bid Received', amount: '8.1 ETH', date: '5h ago', status: 'Pending', buyer: '0x3E2...108' },
  { id: 'TX-8710', asset: 'Louis XIV Desk', type: 'Secondary Royalty', amount: '0.45 ETH', date: '1d ago', status: 'Completed', buyer: '0x992...f0a' },
  { id: 'TX-8655', asset: 'Samurai Katana', type: 'Vault Transfer', amount: '--', date: '2d ago', status: 'In Transit', buyer: 'Self' },
];

const topAssets = [
  { name: 'Ming Dynasty Vase', roi: '+24.5%', price: '12.4 ETH', views: '1,240', status: 'Sold' },
  { name: 'Victorian Pocket Watch', roi: '+12.8%', price: '3.2 ETH', views: '840', status: 'Listed' },
  { name: 'Roman Coin (Gold)', roi: '+4.2%', price: '1.8 ETH', views: '320', status: 'Listed' },
];

const distributionData = [
  { name: 'Asian Antiques', value: 45, color: '#D4AF37' },
  { name: 'European Furniture', value: 25, color: '#94a3b8' },
  { name: 'Numismatics', value: 20, color: '#334155' },
  { name: 'Militaria', value: 10, color: '#6366f1' },
];

export default function SellerDashboard() {
  const [valuationState, setValuationState] = useState<'idle' | 'requesting' | 'requested'>('idle');
  const isDark = true;

  const handleNotifyAppraiser = () => {
    setValuationState('requesting');
    setTimeout(() => setValuationState('requested'), 2000);
  };

  const chartGridColor    = isDark ? '#1e293b' : '#e2e0d8';
  const chartTooltipBg    = isDark ? '#0f172a' : '#ffffff';
  const chartTooltipBorder = isDark ? '#334155' : '#d8d5c8';
  const chartTextColor    = '#64748b';
  const axisStroke        = '#64748b';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <PageTransition>
      <div className="max-w-[90rem] mx-auto px-6 lg:px-10 py-10">
        
        {/* ── Header ── */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 text- gold-500 font-mono text-[10px] uppercase tracking-[0.3em] mb-2">
              <TrendingUp className="w-3 h-3" />
              Real-time Portfolio Analytics
            </div>
            <h1 className="text-4xl font-serif text-slate-50 tracking-tight">Institutional <span className="text-gold-400 italic">Dashboard</span></h1>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <button className="secondary-btn px-4 py-2 text-xs border-obsidian-700 bg-obsidian-900/40">
              <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
            </button>
            <div className="h-10 w-[1px] bg-obsidian-800 hidden sm:block mx-1" />
            {valuationState === 'idle' && (
              <button
                onClick={handleNotifyAppraiser}
                className="primary-btn px-4 py-2 text-xs shadow-none hover:shadow-gold-500/20"
              >
                <BellRing className="w-4 h-4 mr-2" /> Request Valuation
              </button>
            )}
            {valuationState === 'requesting' && (
              <button disabled className="px-6 py-2 rounded-sm bg-obsidian-800 border border-obsidian-700 text-xs text-slate-400 cursor-not-allowed flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-gold-500" /> Connecting to Oracle...
              </button>
            )}
            {valuationState === 'requested' && (
              <button disabled className="px-6 py-2 rounded-sm bg-green-900/10 border border-green-500/30 text-xs text-green-400 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> Appraiser Syncing
              </button>
            )}
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: 'Total Portfolio Value', value: '42.8 ETH', sub: '≈ $104,240', change: '+8.4%', trend: 'up', icon: Coins },
            { label: 'Asset Under Custody', value: '14', sub: 'Across 4 Vaults', change: 'Stable', trend: 'neutral', icon: Vault },
            { label: 'Provenance Health', value: '98.2%', sub: 'Avg Audit Score', change: '+0.2%', trend: 'up', icon: ShieldCheck },
            { label: 'Global Rank', value: '#242', sub: 'Top 5% Collector', change: '↑ 12', trend: 'up', icon: Award },
          ].map((kpi, idx) => (
            <motion.div key={idx} variants={itemVariants} className="vault-glass p-5 rounded-xl border border-obsidian-800 group hover:border-gold-500/30 transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-obsidian-900 border border-obsidian-700 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-obsidian-950 transition-colors duration-300">
                  <kpi.icon className="w-5 h-5" />
                </div>
                {kpi.trend === 'up' ? (
                  <span className="text-[10px] font-mono text-green-400 flex items-center gap-1 bg-green-950/30 px-2 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3" /> {kpi.change}
                  </span>
                ) : kpi.trend === 'neutral' ? (
                  <span className="text-[10px] font-mono text-slate-400 bg-obsidian-800 px-2 py-0.5 rounded">
                    {kpi.change}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-red-400 flex items-center gap-1 bg-red-950/30 px-2 py-0.5 rounded">
                    <ArrowDownRight className="w-3 h-3" /> {kpi.change}
                  </span>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono mb-1">{kpi.label}</p>
              <h4 className="text-2xl font-serif text-slate-50 mb-0.5 tracking-tight">{kpi.value}</h4>
              <p className="text-xs text-slate-500">{kpi.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Analytics Bento ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Chart: Growth & Activity */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 vault-glass p-8 rounded-2xl border border-obsidian-800 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-8 flex gap-4 pointer-events-none opacity-20">
              <Globe className="w-32 h-32 text-gold-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-xl font-serif text-slate-100 mb-1">Exposure & Demand</h3>
                  <p className="text-xs text-slate-500 font-mono">Real-time view traffic vs acquisition bids</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Views</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gold-400" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase">Bids</span>
                  </div>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockPerformanceData}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#d4af37" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                    <XAxis dataKey="name" stroke={axisStroke} tick={{ fill: chartTextColor, fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis yAxisId="left" stroke={axisStroke} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#d4af37" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ stroke: chartGridColor, strokeWidth: 1 }}
                      contentStyle={{ 
                        backgroundColor: chartTooltipBg, 
                        borderColor: chartTooltipBorder, 
                        borderRadius: '12px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}
                      itemStyle={{ color: '#f8fafc', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    />
                    <Area yAxisId="left" type="monotone" dataKey="viewCount" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" name="VWS" />
                    <Area yAxisId="right" type="monotone" dataKey="bids" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorBids)" name="BID" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Asset Distribution */}
          <div className="flex flex-col gap-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="vault-glass p-6 rounded-2xl border border-obsidian-800 flex-1 flex flex-col">
              <h3 className="text-lg font-serif text-slate-100 mb-6 font-medium">Category Weighting</h3>
              <div className="flex-1 min-h-[180px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Content for Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-serif text-white">4</span>
                  <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Sectors</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {distributionData.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{cat.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-200">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="vault-glass p-6 rounded-2xl border border-obsidian-800 bg-gold-400/5 hover:bg-gold-400/[0.08] transition-colors group cursor-pointer">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-serif text-slate-100">Vault Security Audit</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Next Audit: 12 April</p>
                </div>
              </div>
              <div className="w-full h-1 bg-obsidian-800 rounded-full overflow-hidden mt-4">
                <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 1.5, delay: 0.5 }} className="h-full bg-gold-400" />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] font-mono text-slate-500">Security Index</span>
                <span className="text-[9px] font-mono text-gold-400 font-bold">EXCELLENT (92/100)</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* ── Transaction History & Top Assets ── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Recent Ledger */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 vault-glass rounded-2xl border border-obsidian-800 overflow-hidden">
            <div className="px-8 py-6 border-b border-obsidian-800 flex justify-between items-center bg-obsidian-900/30">
              <div>
                <h3 className="text-lg font-serif text-white">Recent Transactions</h3>
                <p className="text-xs text-slate-500">Physical custody and digital settlement activity</p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Search className="w-4 h-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Filter className="w-4 h-4" /></button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase font-mono tracking-widest text-slate-500 bg-obsidian-950/50">
                    <th className="px-8 py-4 font-semibold">Asset / ID</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Value</th>
                    <th className="px-6 py-4 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text- gold-500/50 group-hover:text-gold-500 transition-colors">
                            <Clock className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200">{tx.asset}</p>
                            <p className="text-[10px] font-mono text-slate-600 uppercase">{tx.id} • {tx.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs text-slate-400">{tx.type}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm font-serif text-slate-100">{tx.amount}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={cn(
                          'px-2.5 py-1 rounded-sm text-[9px] uppercase font-mono font-bold tracking-widest border',
                          tx.status === 'Completed' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                          tx.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                          'bg-blue-500/10 border-blue-500/30 text-blue-400'
                        )}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-obsidian-950/50 text-center border-t border-obsidian-800">
              <button className="text-[10px] uppercase font-mono tracking-widest text-slate-500 hover:text-gold-400 transition-colors">Load Full History Ledger ↓</button>
            </div>
          </motion.div>

          {/* Top Assets Sidebar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="vault-glass rounded-2xl border border-obsidian-800 flex flex-col">
            <div className="px-8 py-6 border-b border-obsidian-800 bg-obsidian-900/30">
              <h3 className="text-lg font-serif text-white">Top Performance</h3>
              <p className="text-xs text-slate-500 font-mono">Highest engagement & ROI</p>
            </div>
            <div className="p-4 space-y-4">
              {topAssets.map((asset, i) => (
                <div key={asset.name} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] transition-all group border border-transparent hover:border-obsidian-700">
                  <div className="w-12 h-12 rounded-lg bg-obsidian-900 border border-obsidian-800 flex items-center justify-center text-xl font-serif text-slate-700 group-hover:text-gold-500 transition-colors">
                    {i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate font-serif">{asset.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-green-400">{asset.roi}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ROI</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-serif text-gold-400">{asset.price}</p>
                    <p className="text-[9px] text-slate-600 font-mono uppercase">{asset.views} VWS</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto p-8 pt-0">
              <div className="rounded-xl bg-gradient-to-br from-gold-600/20 to-amber-900/10 border border-gold-500/20 p-5 mt-4">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="w-4 h-4 text-gold-400" />
                  <span className="text-[10px] uppercase font-mono text-gold-400 font-bold tracking-widest">Collector Alpha</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">Your portfolio ROI is outperforming the <span className="text-gold-400">Asian Antiques</span> floor average by 14.2% this quarter.</p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </PageTransition>
  );
}
