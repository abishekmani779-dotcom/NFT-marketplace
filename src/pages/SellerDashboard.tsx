import React, { useState } from 'react';
import { PageTransition } from '../components/PageTransition';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Eye, Gavel, TrendingUp, Loader2, CheckCircle, BellRing, Coins, Sun, Moon, Vault, Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
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

/* ─────────────────────────────────────────
   Mini Theme Preview Card
   ───────────────────────────────────────── */
function MiniCard({ mode }: { mode: 'dark' | 'light' }) {
  const isDark = mode === 'dark';

  return (
    <div className={cn(
      'rounded-xl overflow-hidden border transition-all duration-300 flex-1',
      isDark
        ? 'bg-[#0A0A0A] border-[#1a1a1a] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
        : 'bg-[#F5F5F0] border-[#d8d5c8] shadow-[0_4px_24px_rgba(180,160,100,0.12)]'
    )}>
      {/* Mini Navbar */}
      <div className={cn(
        'flex items-center justify-between px-3 py-2 border-b',
        isDark ? 'bg-[#0f0f0f] border-[#1a1a1a]' : 'bg-[#eeede6] border-[#d8d5c8]'
      )}>
        <div className="flex items-center gap-1.5">
          <div className={cn('w-3 h-3 rounded-sm flex items-center justify-center',
            isDark ? 'bg-gradient-to-br from-yellow-400 to-yellow-700' : 'bg-gradient-to-br from-yellow-500 to-yellow-800'
          )}>
            <Vault className="w-1.5 h-1.5 text-white" />
          </div>
          <span className={cn('text-[7px] font-serif font-semibold', isDark ? 'text-white' : 'text-[#1E293B]')}>
            Aura
          </span>
        </div>
        <div className={cn('rounded-full w-3 h-3 flex items-center justify-center',
          isDark ? 'bg-[#1a1a1a]' : 'bg-white/80 border border-[#d8d5c8]'
        )}>
          {isDark
            ? <Moon className="w-1.5 h-1.5 text-yellow-400" />
            : <Sun className="w-1.5 h-1.5 text-yellow-600" />
          }
        </div>
      </div>

      {/* Mini Hero */}
      <div className="px-3 pt-3 pb-2">
        <div className={cn('text-[8px] font-serif font-semibold mb-1', isDark ? 'text-white' : 'text-[#1E293B]')}>
          Rare Antiquities
        </div>
        {/* NFT card row */}
        <div className="flex gap-1.5 mb-2">
          {[
            { gradient: 'from-indigo-500 to-purple-700', label: 'Ming Vase', price: '4.2 ETH' },
            { gradient: 'from-amber-500 to-orange-700',  label: 'Roman Coin', price: '1.8 ETH' },
          ].map(({ gradient, label, price }) => (
            <div key={label} className={cn(
              'flex-1 rounded-lg overflow-hidden border',
              isDark ? 'border-[#1a1a1a]' : 'border-[#d8d5c8]'
            )}>
              <div className={cn('h-8 bg-gradient-to-br', gradient)} />
              <div className={cn('px-1.5 py-1', isDark ? 'bg-[#0f0f0f]' : 'bg-white')}>
                <p className={cn('text-[5px] font-medium truncate', isDark ? 'text-[#94a3b8]' : 'text-[#475569]')}>{label}</p>
                <p className={cn('text-[6px] font-semibold', isDark ? 'text-yellow-400' : 'text-yellow-700')}>{price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verified badge */}
        <div className="flex items-center gap-1 mb-2">
          <div className={cn(
            'flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[5px] font-bold border',
            isDark
              ? 'bg-yellow-400/15 text-yellow-400 border-yellow-500/40 shadow-[0_0_6px_rgba(212,175,55,0.25)]'
              : 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-white border-yellow-700/60'
          )}>
            <Award className="w-1.5 h-1.5" />
            Verified
          </div>
          <div className={cn('flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[5px] font-semibold border',
            isDark ? 'bg-[#1a1a1a] text-[#64748b] border-[#1a1a1a]' : 'bg-white text-[#64748b] border-[#d8d5c8]'
          )}>
            Top Seller
          </div>
        </div>

        {/* Mini chart bars */}
        <div className={cn('rounded px-2 pt-1.5 pb-2', isDark ? 'bg-[#0f0f0f]' : 'bg-white border border-[#d8d5c8]')}>
          <div className={cn('text-[5px] mb-1', isDark ? 'text-[#64748b]' : 'text-[#94a3b8]')}>Price History</div>
          <div className="flex items-end gap-0.5 h-5">
            {[40, 55, 45, 70, 60, 80, 75].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={cn(
                  'flex-1 rounded-sm',
                  isDark ? 'bg-yellow-500/60' : 'bg-yellow-600/50'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mode Label */}
      <div className={cn(
        'text-center py-1.5 text-[7px] font-semibold tracking-wider uppercase border-t',
        isDark
          ? 'text-[#64748b] border-[#1a1a1a]'
          : 'text-[#94a3b8] border-[#d8d5c8]'
      )}>
        {isDark ? '🌙 Digital Vault' : '☀️ Museum Gallery'}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Theme Preview Card (full widget)
   ───────────────────────────────────────── */
function ThemePreviewCard() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="vault-glass rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={cn('text-lg font-serif', isDark ? 'text-slate-100' : 'text-slate2-900')}>
            Design System Preview
          </h3>
          <p className={cn('text-xs mt-0.5', isDark ? 'text-slate-500' : 'text-slate2-500')}>
            Light vs. Dark contrast — your current mode is highlighted
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-300',
            isDark
              ? 'bg-parchment-200 text-slate2-900 border-parchment-400 hover:bg-parchment-300 shadow-sm'
              : 'bg-obsidian-800 text-slate-100 border-obsidian-700 hover:bg-obsidian-700'
          )}
        >
          {isDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          Switch to {isDark ? 'Light' : 'Dark'}
        </button>
      </div>

      {/* Side-by-side previews */}
      <div className="flex gap-3">
        <div className="flex flex-col flex-1 gap-1.5">
          <div className={cn(
            'text-center text-[10px] font-semibold tracking-widest uppercase py-1 rounded-t-md',
            isDark
              ? 'bg-obsidian-800 text-gold-400 border border-gold-500/30'
              : 'bg-parchment-300 text-slate2-500 border border-parchment-500'
          )}>
            {isDark ? '★ Active' : 'Preview'}
          </div>
          <MiniCard mode="dark" />
        </div>
        <div className="flex flex-col flex-1 gap-1.5">
          <div className={cn(
            'text-center text-[10px] font-semibold tracking-widest uppercase py-1 rounded-t-md',
            !isDark
              ? 'bg-gold-100 text-gold-700 border border-gold-400/40'
              : 'bg-parchment-300/30 text-slate-500 border border-obsidian-700'
          )}>
            {!isDark ? '★ Active' : 'Preview'}
          </div>
          <MiniCard mode="light" />
        </div>
      </div>

      {/* Palette swatch row */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {/* Dark palette */}
        <div>
          <p className={cn('text-[9px] uppercase tracking-widest font-semibold mb-1.5', isDark ? 'text-gold-500' : 'text-slate2-500')}>
            Digital Vault
          </p>
          <div className="flex gap-1">
            {['#0A0A0A', '#1a1a1a', '#D4AF37', '#94a3b8', '#f8fafc'].map((c) => (
              <div key={c} title={c} className="flex-1 h-4 rounded-sm border border-black/10" style={{ background: c }} />
            ))}
          </div>
        </div>
        {/* Light palette */}
        <div>
          <p className={cn('text-[9px] uppercase tracking-widest font-semibold mb-1.5', !isDark ? 'text-gold-700' : 'text-slate-500')}>
            Museum Gallery
          </p>
          <div className="flex gap-1">
            {['#F5F5F0', '#EEEDE6', '#b8861b', '#475569', '#1E293B'].map((c) => (
              <div key={c} title={c} className="flex-1 h-4 rounded-sm border border-black/10" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>

      {/* Transition note */}
      <p className={cn('text-[10px] mt-3 italic', isDark ? 'text-slate-600' : 'text-slate2-400')}>
        ✦ All theme transitions use a 500ms ease-in-out curve for a soft, cinematic landing.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main Page
   ───────────────────────────────────────── */
export default function SellerDashboard() {
  const [valuationState, setValuationState] = useState<'idle' | 'requesting' | 'requested'>('idle');
  const { isDark } = useTheme();

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

        {/* ── Theme Preview Card ── */}
        <ThemePreviewCard />

      </div>
    </PageTransition>
  );
}
