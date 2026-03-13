import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Eye, Gavel, TrendingUp, Loader2, CheckCircle, BellRing, Coins, Vault, Award } from 'lucide-react';
import { cn } from '../lib/utils';

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

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className={cn('text-4xl font-serif mb-2 flex items-center gap-3', isDark ? 'text-slate-50' : 'text-slate2-900')}>
              <TrendingUp className="w-8 h-8 text-gold-500" />
              Live Performance
            </h1>
            <p className={cn(isDark ? 'text-slate-400' : 'text-slate2-600')}>
              Monitoring asset metrics, market trends, and active bid activity.
            </p>
          </div>

          <div className="flex gap-4">
            {valuationState === 'idle' && (
              <button
                onClick={handleNotifyAppraiser}
                className="flex items-center gap-2 primary-btn bg-blue-900/40 text-blue-400 border border-blue-500/50 hover:bg-blue-900/60 transition-colors shadow-none hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <BellRing className="w-4 h-4" /> Notify Appraiser
              </button>
            )}
            {valuationState === 'requesting' && (
              <button disabled className={cn('flex items-center gap-2 px-6 py-2 rounded-sm border cursor-not-allowed', isDark ? 'bg-obsidian-800 text-slate-300 border-obsidian-700' : 'bg-parchment-400 text-slate2-600 border-parchment-500')}>
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Requesting Valuation...
              </button>
            )}
            {valuationState === 'requested' && (
              <button disabled className="flex items-center gap-2 px-6 py-2 rounded-sm bg-green-900/20 text-green-400 border border-green-500/50 cursor-not-allowed">
                <CheckCircle className="w-4 h-4" /> Appraiser Notified
              </button>
            )}
          </div>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: Eye,    color: 'text-slate-400',  label: 'Total View Count', value: '2,880', change: '+14% ↑', changeColor: 'text-green-500' },
            { icon: Gavel,  color: 'text-gold-500',   label: 'Active Bids',      value: '25',    change: 'Last 24h',  changeColor: isDark ? 'text-slate-400' : 'text-slate2-500' },
            { icon: Coins,  color: 'text-cyan-500',   label: 'Avg Offer Price',  value: '1.45 ETH', change: null, changeColor: '' },
          ].map(({ icon: Icon, color, label, value, change, changeColor }) => (
            <div key={label} className={cn('vault-glass p-6 rounded-lg border', isDark ? 'border-obsidian-800' : 'border-parchment-500')}>
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded border flex items-center justify-center',
                  isDark ? 'bg-obsidian-950 border-obsidian-700' : 'bg-white border-parchment-400 shadow-sm'
                )}>
                  <Icon className={cn('w-5 h-5', color)} />
                </div>
                <div>
                  <p className={cn('text-xs uppercase tracking-widest font-mono mb-1', isDark ? 'text-slate-500' : 'text-slate2-500')}>{label}</p>
                  <p className={cn('text-2xl font-serif', isDark ? 'text-slate-100' : 'text-slate2-900')}>
                    {value}
                    {change && <span className={cn('text-sm font-sans ml-2', changeColor)}>{change}</span>}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* View & Bid Activity */}
          <div className={cn('vault-glass p-6 rounded-lg border', isDark ? 'border-obsidian-800' : 'border-parchment-500')}>
            <h3 className={cn('text-lg font-serif mb-6', isDark ? 'text-slate-100' : 'text-slate2-900')}>Audience & Bid Volume</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockPerformanceData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#94a3b8" stopOpacity={isDark ? 0.3 : 0.15} />
                      <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBids" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#d4af37" stopOpacity={isDark ? 0.5 : 0.35} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={{ fill: chartTextColor, fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left"  stroke={axisStroke} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" stroke="#d4af37" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: chartTooltipBg, borderColor: chartTooltipBorder, borderRadius: '8px' }}
                    itemStyle={{ color: isDark ? '#f8fafc' : '#1E293B' }}
                  />
                  <Area yAxisId="left"  type="monotone" dataKey="viewCount" stroke="#94a3b8" fillOpacity={1} fill="url(#colorViews)" name="Views" />
                  <Area yAxisId="right" type="monotone" dataKey="bids"      stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorBids)" name="Bids" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Price Comparison */}
          <div className={cn('vault-glass p-6 rounded-lg border', isDark ? 'border-obsidian-800' : 'border-parchment-500')}>
            <h3 className={cn('text-lg font-serif mb-6', isDark ? 'text-slate-100' : 'text-slate2-900')}>Floor Price vs. My Price (ETH)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockPriceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} vertical={false} />
                  <XAxis dataKey="name" stroke={axisStroke} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis stroke={axisStroke} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: chartTooltipBg, borderColor: chartTooltipBorder, borderRadius: '8px' }}
                    itemStyle={{ color: isDark ? '#f8fafc' : '#1E293B' }}
                  />
                  <Line type="stepAfter"  dataKey="myPrice"    stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} name="My Listed Price" />
                  <Line type="monotone" dataKey="floorPrice" stroke="#d4af37" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: isDark ? '#0f172a' : '#ffffff', stroke: '#d4af37' }} name="Market Floor Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
