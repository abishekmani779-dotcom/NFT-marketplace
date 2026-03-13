import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Wallet, ShieldCheck, UserCircle, Menu, X, Coins,
  Vault, ChevronDown, LogOut, Loader2, Award, Hexagon, BarChart2, LayoutDashboard, Gavel
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandMenu } from './CommandMenu';
import { useAuth } from '../context/AuthContext';

type WalletType = 'MetaMask' | 'Coinbase Wallet' | 'Phantom' | null;

const WALLET_ICONS: Record<string, string> = {
  MetaMask: '🦊',
  'Coinbase Wallet': '🔵',
  Phantom: '👻',
};

/* ── Animated Sun / Moon Toggle Button ── */

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [selectedWallet, setSelectedWallet] = useState<WalletType>(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDark = true;
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const close = () => setIsProfileDropdownOpen(false);
    if (isProfileDropdownOpen) {
      document.addEventListener('click', close);
      return () => document.removeEventListener('click', close);
    }
  }, [isProfileDropdownOpen]);

  const navLinks = [
    { name: 'Browse',    path: '/browse', icon: Hexagon },
    { name: 'Mint',      path: '/submit', icon: Gavel },
    { name: 'Admin',     path: '/admin',  icon: LayoutDashboard },
    { name: 'Analytics', path: '/seller', icon: BarChart2 },
  ];

  const handleConnectWallet = (wallet: WalletType) => {
    setSelectedWallet(wallet);
    setWalletStatus('connecting');
    setTimeout(() => {
      setWalletStatus('connected');
      setIsWalletModalOpen(false);
    }, 1800);
  };

  const handleDisconnect = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  /* ── Derived theme classes ── */
  const navBg = scrolled
    ? isDark
      ? 'bg-obsidian-950/90 backdrop-blur-xl border-b border-obsidian-800/60 shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
      : 'bg-parchment-200/92 backdrop-blur-xl border-b border-parchment-500/60 shadow-[0_4px_30px_rgba(180,160,100,0.10)]'
    : isDark
      ? 'bg-obsidian-950/40 backdrop-blur-md border-b border-obsidian-800/20'
      : 'bg-parchment-200/50 backdrop-blur-md border-b border-parchment-500/30';

  const logoTextClass = isDark
    ? 'text-slate-50 group-hover:text-gold-100'
    : 'text-slate2-900 group-hover:text-gold-700';

  const logoSubClass = isDark ? 'text-gold-500/70' : 'text-gold-600/80';

  const navLinkActive = isDark
    ? 'text-gold-400 bg-gold-500/10'
    : 'text-gold-700 bg-gold-500/15';

  const navLinkInactive = isDark
    ? 'text-slate-400 hover:text-slate-100 hover:bg-obsidian-800/60'
    : 'text-slate2-700 hover:text-slate2-900 hover:bg-parchment-400/60';

  const navActiveIndicator = isDark
    ? 'bg-gold-500/10 border border-gold-500/20'
    : 'bg-gold-400/15 border border-gold-500/25';

  const dividerClass = isDark ? 'bg-obsidian-700' : 'bg-parchment-500';

  const balancePillClass = isDark
    ? 'bg-obsidian-900 border-obsidian-700 text-slate-100'
    : 'bg-white/70 border-parchment-500 text-slate2-900 shadow-sm';

  const profileBtnBase = isDark
    ? 'bg-obsidian-900 border-obsidian-700 hover:bg-obsidian-800 hover:border-obsidian-600'
    : 'bg-white/70 border-parchment-500 hover:bg-white hover:border-parchment-600 shadow-sm';

  const profileBtnActive = isDark
    ? 'bg-obsidian-800 border-gold-500/40 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
    : 'bg-white border-gold-500/50 shadow-[0_0_15px_rgba(184,134,27,0.08)]';

  const dropdownClass = isDark
    ? 'bg-obsidian-950 border-obsidian-700 shadow-[0_20px_60px_rgba(0,0,0,0.6)]'
    : 'bg-white border-parchment-500 shadow-[0_20px_60px_rgba(180,160,100,0.20)]';

  const dropdownHeaderClass = isDark
    ? 'bg-gradient-to-r from-obsidian-900 to-obsidian-950 border-b border-obsidian-800'
    : 'bg-gradient-to-r from-parchment-200 to-parchment-100 border-b border-parchment-400';

  const dropdownInnerCard = isDark
    ? 'bg-obsidian-900/60 border-obsidian-800'
    : 'bg-parchment-100/60 border-parchment-400';

  const dropdownMenuItemHover = isDark ? 'hover:bg-obsidian-900' : 'hover:bg-parchment-200';
  const dropdownTextMuted = isDark ? 'text-slate-400' : 'text-slate2-600';
  const dropdownTextMain = isDark ? 'text-slate-200' : 'text-slate2-800';
  const dropdownSubText = isDark ? 'text-slate-500' : 'text-slate2-500';
  const walletModalBg = isDark
    ? 'bg-obsidian-950 border-obsidian-700 shadow-[0_40px_80px_rgba(0,0,0,0.7)]'
    : 'bg-white border-parchment-500 shadow-[0_40px_80px_rgba(180,160,100,0.25)]';
  const walletOptionBorder = isDark
    ? 'border-obsidian-700 bg-obsidian-900/50 hover:bg-obsidian-800 hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.08)]'
    : 'border-parchment-500 bg-parchment-100/50 hover:bg-parchment-300 hover:border-gold-500/40 hover:shadow-[0_0_20px_rgba(184,134,27,0.10)]';
  const walletOptionArrow = isDark
    ? 'bg-obsidian-800 border-obsidian-700 group-hover:border-gold-500/40'
    : 'bg-parchment-200 border-parchment-500 group-hover:border-gold-500/40';
  const mobileMenuBg = isDark
    ? 'bg-obsidian-950/95 backdrop-blur-xl border-t border-obsidian-800'
    : 'bg-parchment-200/95 backdrop-blur-xl border-t border-parchment-500';
  const mobileLinkActive = isDark
    ? 'bg-gold-500/10 text-gold-400 border border-gold-500/20'
    : 'bg-gold-400/15 text-gold-700 border border-gold-500/25';
  const mobileLinkInactive = isDark
    ? 'text-slate-300 hover:bg-obsidian-800 hover:text-slate-100'
    : 'text-slate2-700 hover:bg-parchment-400 hover:text-slate2-900';
  const mobileFooterBorder = isDark ? 'border-obsidian-800' : 'border-parchment-500';
  const mobileWalletCard = isDark
    ? 'bg-obsidian-900 border-obsidian-700'
    : 'bg-white/70 border-parchment-500 shadow-sm';

  return (
    <>
      <nav className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-500', navBg)}>
        <div className="max-w-[90rem] mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-shadow',
                  isDark
                    ? 'bg-gradient-to-br from-gold-400 to-gold-700 shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.55)]'
                    : 'bg-gradient-to-br from-gold-500 to-gold-800 shadow-[0_2px_12px_rgba(184,134,27,0.30)] group-hover:shadow-[0_4px_20px_rgba(184,134,27,0.45)]'
                )}>
                  <Vault className="text-white w-5 h-5" />
                </div>
              </div>
              <div className="leading-none">
                <span className={cn('font-serif text-xl font-semibold tracking-wide transition-colors', logoTextClass)}>
                  Aura
                </span>
                <span className={cn('block text-[10px] font-mono tracking-[0.2em] uppercase mt-0.5', logoSubClass)}>
                  Protocol
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2 group',
                      isActive ? navLinkActive : navLinkInactive
                    )}
                  >
                    <link.icon className={cn(
                      'w-3.5 h-3.5 transition-colors',
                      isActive
                        ? isDark ? 'text-gold-400' : 'text-gold-700'
                        : isDark ? 'text-slate-500 group-hover:text-slate-300'
                                 : 'text-slate2-500 group-hover:text-slate2-700'
                    )} />
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className={cn('absolute inset-0 rounded-lg', navActiveIndicator)}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Right Side ── */}
            <div className="hidden lg:flex items-center gap-3">
              <CommandMenu />

              {/* Vertical divider */}
              <div className={cn('w-px h-6', dividerClass)} />

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {/* Balance pill */}
                  <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm', balancePillClass)}>
                    <Coins className="w-3.5 h-3.5 text-gold-500" />
                    <span className="font-mono font-medium">
                      14.2 <span className={isDark ? 'text-slate-400' : 'text-slate2-500'}>ETH</span>
                    </span>
                  </div>

                  {/* Profile button */}
                  <div className="relative" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-1.5 rounded-lg border transition-all duration-200',
                        isProfileDropdownOpen ? profileBtnActive : profileBtnBase
                      )}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm shrink-0" />
                      <div className="flex flex-col items-start leading-none">
                        <span className={cn('text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]', isDark ? 'text-slate-500' : 'text-slate2-500')}>
                          {user?.name || '0x8A2…c41F'}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Award className="w-2.5 h-2.5 text-gold-500" />
                          <span className="text-[10px] font-semibold text-gold-500 capitalize">{user?.role || 'Elite'} Collector</span>
                        </div>
                      </div>
                      <ChevronDown className={cn(
                        'w-3.5 h-3.5 transition-transform duration-200 ml-1',
                        isDark ? 'text-slate-400' : 'text-slate2-500',
                        isProfileDropdownOpen && 'rotate-180'
                      )} />
                    </button>

                    <AnimatePresence>
                      {isProfileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className={cn(
                            'absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden border',
                            dropdownClass
                          )}
                        >
                          {/* Wallet info header */}
                          <div className={cn('px-4 py-4', dropdownHeaderClass)}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md" />
                              <div>
                                <p className={cn('text-xs font-mono font-semibold', dropdownTextMain)}>{user?.name || '0x8A2345…c41F'}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  <span className={cn('text-[10px]', dropdownSubText)}>Role:</span>
                                  <span className={cn('text-xs font-semibold capitalize', dropdownTextMain)}>{user?.role || 'User'}</span>
                                </div>
                              </div>
                            </div>
                            <div className={cn('mt-3 flex items-center justify-between rounded-lg px-3 py-2 border', dropdownInnerCard)}>
                              <div className="flex items-center gap-1.5">
                                <Award className="w-3.5 h-3.5 text-gold-500" />
                                <span className="text-xs text-gold-500 font-semibold">Elite Collector</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Coins className="w-3 h-3 text-gold-500" />
                                <span className={cn('text-xs font-mono', dropdownTextMain)}>14.2 ETH</span>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-1.5">
                            {[
                              { icon: UserCircle, label: 'Profile Details',  desc: 'View your collector profile', path: '/profile' },
                              { icon: ShieldCheck, label: 'KYC Verified',    desc: 'Identity confirmed ✓', color: 'text-green-500', path: '/auth' },
                            ].map(({ icon: Icon, label, desc, color, path }) => (
                              <Link to={path} key={label} onClick={() => setIsProfileDropdownOpen(false)} className={cn('w-full text-left px-4 py-2.5 transition-colors flex items-start gap-3 group', dropdownMenuItemHover)}>
                                <Icon className={cn('w-4 h-4 mt-0.5 transition-colors shrink-0 group-hover:text-gold-500', color ?? (isDark ? 'text-slate-500' : 'text-slate2-500'))} />
                                <div>
                                  <p className={cn('text-sm group-hover:text-gold-600', dropdownTextMain)}>{label}</p>
                                  <p className={cn('text-[10px]', dropdownSubText)}>{desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>

                          <div className={cn('border-t py-1.5', isDark ? 'border-obsidian-800' : 'border-parchment-400')}>
                            <button
                              onClick={handleDisconnect}
                              className="w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/30 flex items-center gap-3 group"
                            >
                              <LogOut className="w-4 h-4 text-red-500/60 group-hover:text-red-400 transition-colors" />
                              <span className="text-red-400/80 group-hover:text-red-400">Secure Logout</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-semibold text-sm rounded-lg transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] active:scale-95"
                >
                  <UserCircle className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </div>

            {/* ── Mobile Row: Hamburger ── */}
            <div className="lg:hidden flex items-center gap-2">
              <button
                className={cn('transition-colors p-2', isDark ? 'text-slate-300 hover:text-gold-400' : 'text-slate2-700 hover:text-gold-600')}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn('lg:hidden overflow-hidden', mobileMenuBg)}
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      location.pathname === link.path ? mobileLinkActive : mobileLinkInactive
                    )}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className={cn('px-4 pb-4 border-t pt-4', mobileFooterBorder)}>
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className={cn('flex items-center gap-3 px-4 py-3 rounded-lg border', mobileWalletCard)}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0" />
                      <div>
                        <p className={cn('text-xs font-mono font-semibold', isDark ? 'text-slate-100' : 'text-slate2-800')}>{user?.name || '0x8A2…c41F'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Award className="w-3 h-3 text-gold-500" />
                          <span className="text-xs text-gold-500 font-semibold capitalize">{user?.role || 'Elite'} · 14.2 ETH</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleDisconnect}
                      className="w-full py-2.5 text-sm text-red-400 border border-red-900/50 rounded-lg bg-red-950/20 flex items-center justify-center gap-2 hover:bg-red-950/40 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); navigate('/auth'); }}
                    className="w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 hover:from-gold-500 hover:to-gold-400 active:scale-95 transition-all"
                  >
                    <UserCircle className="w-4 h-4" /> Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Connect Wallet Modal ── */}
      <AnimatePresence>
        {isWalletModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'absolute inset-0 backdrop-blur-md',
                isDark ? 'bg-obsidian-950/70' : 'bg-parchment-300/60'
              )}
              onClick={() => walletStatus !== 'connecting' && setIsWalletModalOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={cn('relative w-full max-w-sm rounded-2xl overflow-hidden border', walletModalBg)}
            >
              {/* Gold accent top bar */}
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className={cn('text-xl font-serif', isDark ? 'text-slate-50' : 'text-slate2-900')}>
                      Connect a Wallet
                    </h2>
                    <p className={cn('text-sm mt-0.5', isDark ? 'text-slate-500' : 'text-slate2-500')}>
                      Unlock the full Aura Protocol experience
                    </p>
                  </div>
                  {walletStatus !== 'connecting' && (
                    <button
                      onClick={() => setIsWalletModalOpen(false)}
                      className={cn(
                        'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                        isDark
                          ? 'bg-obsidian-800 hover:bg-obsidian-700 text-slate-400 hover:text-slate-200'
                          : 'bg-parchment-300 hover:bg-parchment-400 text-slate2-500 hover:text-slate2-700'
                      )}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {walletStatus === 'connecting' ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-5">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full border-2 border-gold-500/20 flex items-center justify-center text-3xl">
                        {WALLET_ICONS[selectedWallet!] ?? '💼'}
                      </div>
                      <div className="absolute inset-0 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
                    </div>
                    <div className="text-center">
                      <p className={cn('font-medium', isDark ? 'text-slate-200' : 'text-slate2-800')}>
                        Connecting to {selectedWallet}
                      </p>
                      <p className={cn('text-sm mt-1', isDark ? 'text-slate-500' : 'text-slate2-500')}>
                        Approve the request in your wallet
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {(['MetaMask', 'Coinbase Wallet', 'Phantom'] as WalletType[]).map((wallet) => (
                      <button
                        key={wallet!}
                        onClick={() => handleConnectWallet(wallet)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200 group',
                          walletOptionBorder
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{WALLET_ICONS[wallet!]}</span>
                          <span className={cn(
                            'text-sm font-semibold group-hover:text-gold-500 transition-colors',
                            isDark ? 'text-slate-200' : 'text-slate2-800'
                          )}>{wallet}</span>
                        </div>
                        <div className={cn('w-7 h-7 rounded-lg border flex items-center justify-center transition-colors', walletOptionArrow)}>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-500 -rotate-90" />
                        </div>
                      </button>
                    ))}

                    <p className={cn('text-center text-xs pt-3 px-2 leading-relaxed', isDark ? 'text-slate-600' : 'text-slate2-500')}>
                      By connecting, you agree to Aura Protocol's{' '}
                      <span className="text-gold-600 hover:text-gold-500 cursor-pointer transition-colors">Terms of Service</span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
