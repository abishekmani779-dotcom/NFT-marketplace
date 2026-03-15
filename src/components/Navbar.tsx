import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Wallet, Menu, X, Coins,
  Vault, Hexagon, BarChart2, LayoutDashboard, Gavel
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { CommandMenu } from './CommandMenu';
import { useAuth } from '../context/AuthContext';
import { WalletModal } from './WalletModal';

/* ── Animated Sun / Moon Toggle Button ── */

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isDark = true;
  const location = useLocation();
  const { wallet, isWalletConnected, disconnectWallet } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { name: 'Browse',    path: '/browse', icon: Hexagon },
    { name: 'Mint',      path: '/submit', icon: Gavel },
    { name: 'Admin',     path: '/admin',  icon: LayoutDashboard },
    { name: 'Analytics', path: '/seller', icon: BarChart2 },
  ];

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
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105',
                  isDark
                    ? 'bg-gradient-to-br from-gold-400 to-gold-700 shadow-[0_0_15px_rgba(212,175,55,0.35)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.65)] group-hover:ring-2 group-hover:ring-gold-500/50'
                    : 'bg-gradient-to-br from-gold-500 to-gold-800 shadow-[0_2px_12px_rgba(184,134,27,0.30)] group-hover:shadow-[0_4px_20px_rgba(184,134,27,0.45)]'
                )}>
                  <Vault className="text-obsidian-950 w-5 h-5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
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

              {/* Wallet pill — shows address/balance if connected, or Connect Wallet button */}
              {isWalletConnected && wallet ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWalletModalOpen(true)}
                    className={cn('flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all hover:border-gold-500/40', balancePillClass)}
                  >
                    <svg viewBox="0 0 12 12" className="w-3 h-3 shrink-0" fill="none">
                      <polygon points="6,0 9.5,5.5 6,7 2.5,5.5" fill="#627EEA" opacity="0.9"/>
                      <polygon points="6,8.5 9.5,6 6,12 2.5,6" fill="#627EEA" opacity="0.6"/>
                    </svg>
                    <span className="font-mono font-medium">
                      {wallet.balance} <span className="text-slate-400">ETH</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 hidden xl:block">{wallet.address}</span>
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="p-1.5 rounded-lg border border-obsidian-700 bg-obsidian-900/70 text-slate-400 hover:text-red-400 hover:border-red-900/50 transition-colors"
                    title="Disconnect wallet"
                  >
                    <Coins className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWalletModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-obsidian-700 bg-obsidian-900/70 text-slate-300 hover:border-gold-500/40 hover:text-gold-400 hover:bg-gold-500/5 font-semibold text-sm rounded-lg transition-colors shadow-inner"
                >
                  <Wallet className="w-4 h-4" />
                  Connect Wallet
                </motion.button>
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
                {isWalletConnected && wallet ? (
                  <div className={cn('flex items-center justify-between gap-3 px-4 py-3 rounded-lg border', mobileWalletCard)}>
                    <div className="flex items-center gap-2">
                      <svg viewBox="0 0 12 12" className="w-4 h-4 shrink-0" fill="none">
                        <polygon points="6,0 9.5,5.5 6,7 2.5,5.5" fill="#627EEA" opacity="0.9"/>
                        <polygon points="6,8.5 9.5,6 6,12 2.5,6" fill="#627EEA" opacity="0.6"/>
                      </svg>
                      <div>
                        <p className="text-xs font-mono font-semibold text-slate-100">{wallet.address}</p>
                        <p className="text-xs text-gold-500 font-semibold">{wallet.balance} ETH</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setIsOpen(false); disconnectWallet(); }}
                      className="text-xs text-red-400 border border-red-900/50 rounded-lg px-2 py-1 bg-red-950/20 hover:bg-red-950/40 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setIsOpen(false); setIsWalletModalOpen(true); }}
                    className="w-full py-3 border border-obsidian-700 bg-obsidian-900 text-slate-300 font-bold rounded-lg flex items-center justify-center gap-2 hover:border-gold-500/40 hover:text-gold-400 active:scale-95 transition-all"
                  >
                    <Wallet className="w-4 h-4" /> Connect Wallet
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Connect Wallet Modal ── */}
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </>
  );
}
