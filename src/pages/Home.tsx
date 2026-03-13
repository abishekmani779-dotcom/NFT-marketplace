import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  ArrowRight, Shield, Anchor, Lock, Hexagon, ShieldCheck,
  Vault, Globe, TrendingUp, Star, Users, ChevronDown, Check,
  Landmark, Zap, Clock, Award, ChevronLeft, ChevronRight, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockRegistry } from '../lib/mockRegistry';
import { PageTransition } from '../components/PageTransition';
import TrustStack from '../components/TrustStack';

// ─── Animated Counter ─────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

// ─── FadeSection ──────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

function FadeSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ─── MagneticWrapper ──────────────────────────────────────────
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// ─── Hero slides ──────────────────────────────────────────────
const heroSlides = mockRegistry.slice(0, 4).map(item => ({
  ...item,
  tag: item.verificationLevel === 3 ? 'Protocol Insured' : item.verificationLevel === 2 ? 'Expert Appraised' : 'Community Listed',
}));

export default function Home() {
  const [heroIndex, setHeroIndex] = useState(0);
  const heroItem = heroSlides[heroIndex];
  const featuredItems = mockRegistry.slice(0, 6);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Stepper state
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const stepperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stepperRef,
    offset: ["start center", "end center"]
  });
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Auto-advance
  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const goTo = (idx: number) => setHeroIndex(idx);
  const prev = () => setHeroIndex(i => (i - 1 + heroSlides.length) % heroSlides.length);
  const next = () => setHeroIndex(i => (i + 1) % heroSlides.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    const y = -((e.clientX - rect.left) / rect.width - 0.5) * 16;
    setTilt({ x, y });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Static data
  const stats = [
    { label: 'Artifacts Vaulted', value: 2840, suffix: '+', icon: Vault },
    { label: 'TVL (ETH)', value: 18420, suffix: '', icon: TrendingUp },
    { label: 'Active Collectors', value: 4200, suffix: '+', icon: Users },
    { label: 'Countries Covered', value: 47, suffix: '', icon: Globe },
  ];

  const features = [
    { icon: ShieldCheck, title: 'Protocol-Insured Custody', desc: "Physical assets are stored in climate-controlled, globally distributed vaults with Lloyd's of London insurance backed at the protocol layer.", badge: 'L3 Standard', color: 'gold' },
    { icon: Anchor, title: 'Immutable Provenance Chain', desc: 'Every ownership transfer and appraisal event is cryptographically recorded as an ERC-721 event on Ethereum, creating a permanent, tamper-proof history.', badge: 'On-Chain', color: 'cyan' },
    { icon: Globe, title: 'AI Oracle Verification', desc: 'Our multi-model AI Vision Oracle cross-references submitted artifacts against 14 million known auction records, eliminating counterfeits before listing.', badge: '98.7% Accuracy', color: 'blue' },
    { icon: Zap, title: 'Instant Liquidity Pools', desc: 'Fractionalize ownership across hundreds of co-owners, enabling price discovery and exit liquidity for even the rarest of assets.', badge: 'ERC-1155', color: 'purple' },
    { icon: Lock, title: 'NFC Twin Binding', desc: 'Military-grade NFC microchips are embedded into every registered artifact, permanently binding the digital twin to its physical counterpart.', badge: 'Tamper-Proof', color: 'green' },
    { icon: Clock, title: 'Escrow Settlement', desc: 'All purchases are routed through a time-locked smart contract escrow — funds are only released after vault confirmation of physical custody transfer.', badge: '<48hr Settlement', color: 'amber' },
  ];

  const steps = [
    { number: '01', title: 'Submit Your Artifact', desc: 'Upload documentation, provenance records, and high-resolution imagery through our Seller Portal.', icon: Landmark, time: '10 Min Upload' },
    { number: '02', title: 'Oracle Appraisal', desc: 'Our AI Oracle and global network of expert appraisers verify authenticity, condition, and market value.', icon: Shield, time: '24h Review' },
    { number: '03', title: 'Physical Vaulting', desc: 'The artifact is collected from you and secured in a partner vault. An NFC chip is embedded and linked.', icon: Vault, time: '3-5 Days' },
    { number: '04', title: 'Mint & List', desc: 'An ERC-721 NFT is minted representing full ownership. You set the floor price and listing terms.', icon: Zap, time: 'Instant Mint' },
  ];

  const testimonials = [
    { name: 'Dr. Eliane Morel', role: 'Senior Curator, Musée des Arts Décoratifs', quote: 'Aura Protocol has fundamentally changed how I think about provenance. The on-chain record is more thorough than anything I have seen in 30 years of academic work.', avatar: 'EM' },
    { name: 'Kenji Watanabe', role: 'Collector & RWA Investor, Tokyo', quote: 'I acquired a Meiji-era tanto through Aura. The entire flow — from the vault confirmation to the certificate — instilled a level of confidence I never had with traditional auction houses.', avatar: 'KW' },
    { name: 'Isabella Fontaine', role: 'Estate Director, Geneva', quote: "We liquidated a portion of our family's antique collection through Aura at 22% above the reserve we would have set at Christie's. The fractional model unlocked demand we didn't know existed.", avatar: 'IF' },
  ];

  const faqs = [
    { q: 'Who physically holds the artifact after purchase?', a: "The artifact remains in one of our network of partner custodial vaults (Brinks, Malca-Amit, or equivalent). You hold legal title via the NFT, but can arrange for physical delivery through our redemption portal at any time." },
    { q: 'What happens if my artifact is damaged or lost?', a: 'Every vault-secured asset carries protocol-level insurance coverage. In the event of loss, the smart contract automatically triggers an insurance claim and distributes proceeds to the token holder.' },
    { q: 'How does the AI Oracle detect counterfeits?', a: "Our Oracle cross-references AI Vision similarity scores against 14M+ auction records, material spectroscopy reports, and a proprietary metadata graph of known provenance chains. Assets scoring below 80% are automatically flagged for manual review." },
    { q: 'Can I fractionalize ownership of an asset?', a: 'Yes. After minting, you can convert your ERC-721 to an ERC-1155 pool, splitting it into up to 10,000 fractional shares. This enables co-ownership and on-chain price discovery.' },
    { q: 'What are the platform fees?', a: 'Aura charges a 2.5% transaction fee on primary sales and 1% on secondary royalties, automatically distributed to the original minter via smart contract.' },
  ];

  const partners = [
    { name: 'Brinks', desc: 'Global Vault Partner' },
    { name: 'Malca-Amit', desc: 'Secure Transport' },
    { name: "Christie's", desc: 'Appraisal Network' },
    { name: 'Chainlink', desc: 'Price Oracle' },
    { name: 'Fireblocks', desc: 'Custody Infrastructure' },
    { name: "Lloyd's", desc: 'Insurance Provider' },
  ];

  return (
    <PageTransition>
      <div className="w-full overflow-x-hidden">

        {/* ══════════════════════ LIVE TICKER (fixed strip) ══════════════════════ */}
        <div className="sticky top-0 z-30 border-b border-obsidian-800/60 bg-obsidian-950/90 backdrop-blur-lg overflow-hidden shrink-0">
          <div className="flex items-center h-9">
            <div className="flex items-center gap-2 shrink-0 px-4 border-r border-obsidian-700 h-full">
              <Activity className="w-3 h-3 text-gold-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500 font-mono font-semibold hidden sm:block">Live</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                className="flex items-center gap-8 whitespace-nowrap pl-4"
              >
                {[...mockRegistry, ...mockRegistry].map((item, i) => (
                  <span key={i} className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="text-slate-400">{item.title}</span>
                    <span className="text-gold-400 font-semibold">{item.priceETH} Ξ</span>
                    <span className="text-green-400">↑ {(3 + (i * 2.3 % 15)).toFixed(1)}%</span>
                    <span className="text-obsidian-800 mx-1">|</span>
                  </span>
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ══════════════════════ HERO ══════════════════════ */}
        <section className="relative w-full h-[calc(100vh-80px-36px)] flex flex-col overflow-hidden">

          {/* ── Crossfading full-bleed background ── */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="sync">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6 }}
                className="absolute inset-0"
              >
                <img src={heroItem.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/75 to-obsidian-950/30" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/60 to-transparent" />
              </motion.div>
            </AnimatePresence>
            {/* Dot grid */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          </div>

          {/* ── Main hero grid ── */}
          <div className="relative z-10 flex-1 flex items-center overflow-hidden">
            <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] w-full grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 xl:gap-16 py-8 lg:py-6">

              {/* ── Left: Copy ── */}
              <div className="flex flex-col justify-center gap-8">
                {/* Protocol status */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex w-max items-center gap-2 border border-gold-500/30 bg-gold-900/15 px-4 py-2 rounded-full backdrop-blur-md"
                >
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs uppercase tracking-[0.18em] text-gold-400 font-mono">Protocol Live · Ethereum Mainnet</span>
                </motion.div>

                {/* Headline — animates per slide */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.55 }}
                    className="flex flex-col gap-4"
                  >
                    <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif text-slate-50 leading-[1.1] tracking-tight">
                      The Digital Vault <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-amber-300 to-yellow-200 italic">
                        For Tokenized Antiques
                      </span>
                    </h1>
                    <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                      Authentic, historically significant artifacts bound to their digital twins. Physical custody meets on-chain provenance — a new standard for alternative asset liquidity.
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* CTA row */}
                <div className="flex flex-wrap gap-4">
                  <Link to={`/asset/${heroItem.id}`} className="primary-btn px-8 py-4 text-base shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:shadow-[0_0_40px_rgba(212,175,55,0.45)] rounded-xl">
                    Enter the Vault <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/browse" className="secondary-btn px-8 py-4 text-base rounded-xl group">
                    <Hexagon className="w-5 h-5 text-gold-500 group-hover:rotate-[30deg] transition-transform duration-300" />
                    Browse Registry
                  </Link>
                </div>

                {/* Trust signals — hidden on small screens to save space */}
                <div className="hidden sm:flex flex-wrap gap-4 pt-2 border-t border-obsidian-800/60">
                  {[
                    { icon: ShieldCheck, label: 'Protocol Insured' },
                    { icon: Anchor, label: 'On-Chain Provenance' },
                    { icon: Award, label: 'Expert Appraised' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 text-sm text-slate-400">
                      <Icon className="w-4 h-4 text-gold-500" /> {label}
                    </div>
                  ))}
                </div>

                {/* Slide navigation dots */}
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={prev} className="w-8 h-8 rounded-full border border-obsidian-700 hover:border-gold-500/50 flex items-center justify-center text-slate-400 hover:text-gold-400 transition-all bg-obsidian-900/50">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {heroSlides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`transition-all duration-300 rounded-full ${i === heroIndex ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-obsidian-700 hover:bg-obsidian-500'}`}
                    />
                  ))}
                  <button onClick={next} className="w-8 h-8 rounded-full border border-obsidian-700 hover:border-gold-500/50 flex items-center justify-center text-slate-400 hover:text-gold-400 transition-all bg-obsidian-900/50">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-slate-500 font-mono ml-2">{heroIndex + 1} / {heroSlides.length}</span>
                </div>
              </div>

              {/* ── Right: Interactive 3D asset card ── */}
              <div className="hidden lg:flex flex-col items-center justify-center">
                <motion.div
                  ref={cardRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={resetTilt}
                  animate={{ rotateX: tilt.x, rotateY: tilt.y }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                  className="relative w-full cursor-pointer"
                >
                  {/* Glow behind card */}
                  <div className="absolute -inset-6 bg-gold-500/10 rounded-3xl blur-[50px] pointer-events-none transition-all duration-700" style={{ opacity: 0.6 + tilt.x / 30 }} />

                  <div className="relative rounded-2xl overflow-hidden border border-obsidian-700/80 shadow-[0_40px_80px_rgba(0,0,0,0.7)]"
                    style={{ transform: 'translateZ(0)' }}>

                    {/* Card image — crossfades */}
                    <div className="relative overflow-hidden" style={{ height: 'min(340px, 42vh)' }}>
                      <AnimatePresence mode="sync">
                        <motion.img
                          key={heroIndex}
                          src={heroItem.image}
                          alt={heroItem.title}
                          initial={{ opacity: 0, scale: 1.06 }}
                          animate={{ opacity: 1, scale: 1.0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </AnimatePresence>

                      {/* Top badge */}
                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                        <span className={`text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg font-semibold border backdrop-blur-md flex items-center gap-1.5 ${
                          heroItem.verificationLevel === 3
                            ? 'bg-gold-900/70 border-gold-500/50 text-gold-400'
                            : 'bg-blue-900/70 border-blue-500/50 text-blue-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${heroItem.verificationLevel === 3 ? 'bg-gold-400' : 'bg-blue-400'}`} />
                          {heroItem.tag}
                        </span>
                      </div>

                      {/* Live bid in top right */}
                      <div className="absolute top-4 right-4 z-10 bg-obsidian-950/80 backdrop-blur border border-obsidian-700 rounded-xl px-3 py-2">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Highest Bid</p>
                        <p className="text-sm font-serif text-gold-400 font-semibold">{heroItem.priceETH} ETH</p>
                      </div>

                      {/* Bottom gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
                    </div>

                    {/* Card info panel */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={heroIndex}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4 }}
                        className="bg-obsidian-950 px-5 py-5 border-t border-obsidian-800"
                      >
                        <h3 className="font-serif text-xl text-slate-50 mb-1 truncate">{heroItem.title}</h3>
                        <p className="text-xs text-slate-500 font-mono mb-4">{heroItem.metadata.era} · {heroItem.metadata.material}</p>

                        {/* Metadata row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: 'Condition', value: `${heroItem.metadata.conditionGrade}/10` },
                            { label: 'Category', value: heroItem.category },
                            { label: 'Token ID', value: `#${heroItem.digitalOwnership.tokenId}` },
                          ].map(({ label, value }) => (
                            <div key={label} className="bg-obsidian-900 border border-obsidian-800 rounded-lg p-2.5 text-center">
                              <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1 font-mono">{label}</p>
                              <p className="text-xs font-semibold text-slate-200 truncate">{value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Buy button row */}
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mb-0.5">Floor Price</p>
                            <p className="font-serif text-2xl text-gold-400 leading-none">{heroItem.priceETH} <span className="text-sm font-sans text-slate-400">ETH</span></p>
                          </div>
                          <Link to={`/asset/${heroItem.id}`} className="primary-btn px-5 py-2.5 text-sm rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)]">
                            Acquire Asset <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Floating stat: return */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-4 -right-4 bg-obsidian-900 border border-obsidian-700 rounded-xl p-3 shadow-2xl z-10"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-green-900/30 border border-green-500/30 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">30d Return</p>
                        <p className="text-sm font-bold text-green-400">+24.8%</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating stat: rank */}
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
                    className="absolute -bottom-4 -left-4 bg-obsidian-900 border border-obsidian-700 rounded-xl p-3 shadow-2xl z-10"
                    style={{ transform: 'translateZ(40px)' }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center">
                        <Award className="w-4 h-4 text-obsidian-950" />
                      </div>
                      <div>
                        <p className="text-[9px] text-slate-500 font-mono uppercase">Collector Rank</p>
                        <p className="text-sm font-bold text-gold-400">Sovereign Elite</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>
          </div>

          {/* ── Scroll cue ── */}
          <div className="relative z-10 flex flex-col items-center pb-8 gap-1 text-slate-500">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono">Scroll</span>
            <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════ STATS ══════════════════════ */}
        <section className="border-y border-obsidian-800 bg-obsidian-950/90 backdrop-blur-lg relative z-10">
          <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ label, value, suffix, icon: Icon }) => (
              <FadeSection key={label} className="flex flex-col items-center text-center gap-3">
                <motion.div variants={fadeUp}>
                  <div className="w-12 h-12 rounded-xl bg-gold-900/20 border border-gold-500/20 flex items-center justify-center mb-3 mx-auto">
                    <Icon className="w-6 h-6 text-gold-500" />
                  </div>
                  <p className="font-serif text-3xl md:text-4xl text-gold-400 font-semibold">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase tracking-widest font-mono">{label}</p>
                </motion.div>
              </FadeSection>
            ))}
          </div>
        </section>

        {/* ══════════════════════ FEATURED LISTINGS ══════════════════════ */}
        <section className="py-28 bg-obsidian-950 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gold-500/3 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] relative z-10">
            <FadeSection>
              <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                <div>
                  <p className="text-xs text-gold-500 uppercase tracking-widest font-mono mb-3">Featured Assets</p>
                  <h2 className="text-4xl md:text-5xl font-serif text-slate-50">Masterpieces in the Vault</h2>
                  <p className="text-slate-400 mt-3 max-w-xl">Highly sought-after, protocol-verified artifacts currently available for acquisition or fractional ownership.</p>
                </div>
                <Link to="/browse" className="shrink-0 text-gold-400 hover:text-gold-300 text-sm font-mono uppercase tracking-widest flex items-center gap-2 border border-gold-500/20 hover:border-gold-500/50 px-5 py-2.5 rounded-lg transition-all hover:bg-gold-500/5">
                  Full Registry <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </FadeSection>

            <FadeSection className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredItems.map((item) => (
                <motion.div key={item.id} variants={fadeUp}>
                  <Link to={`/asset/${item.id}`} className="group block bg-obsidian-900 rounded-xl overflow-hidden border border-obsidian-800 hover:border-gold-500/40 shadow-2xl hover:shadow-[0_20px_40px_rgba(212,175,55,0.1)] transition-all duration-500 hover:-translate-y-2">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[3s]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/20 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg font-semibold border flex items-center gap-1.5 backdrop-blur-sm ${item.verificationLevel === 3 ? 'bg-gold-900/60 border-gold-500/50 text-gold-400' : 'bg-blue-900/60 border-blue-500/50 text-blue-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.verificationLevel === 3 ? 'bg-gold-400 animate-pulse' : 'bg-slate-500'}`} />
                          L{item.verificationLevel}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-serif text-slate-50 text-xl leading-tight line-clamp-1 group-hover:text-gold-300 transition-colors">{item.title}</h3>
                        <p className="text-slate-400 text-xs font-mono mt-1">{item.metadata.era}</p>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-obsidian-800/50">
                          <span className="font-serif text-gold-400 text-lg">{item.priceETH} ETH</span>
                          <span className="text-[10px] text-gold-400 border border-gold-500/30 px-2 py-0.5 rounded uppercase tracking-wider font-mono group-hover:bg-gold-500/10 transition-colors">View →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </FadeSection>
          </div>
        </section>

        {/* ══════════════════════ HOW IT WORKS ══════════════════════ */}
        <section ref={stepperRef} className="py-28 bg-obsidian-900 border-t border-obsidian-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-[100px] relative z-10">
            <FadeSection>
              <motion.div variants={fadeUp} className="text-center mb-28">
                <p className="text-xs text-gold-500 uppercase tracking-widest font-mono mb-3">The Process</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-50 mb-4">From Estate to Blockchain</h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">A rigorous, four-step pipeline that transforms physical antiques into fully verifiable, liquid digital assets.</p>
              </motion.div>
            </FadeSection>

            <div className="relative mt-12 mb-20 max-md:flex max-md:flex-col max-md:gap-16">
              {/* Glowing Data Conduit (Track) - Desktop Only */}
              <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-2 bg-obsidian-800/80 rounded-full overflow-hidden backdrop-blur-sm border border-obsidian-700/50" />
              
              {/* Animated Progress Line */}
              <motion.div 
                className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-2 rounded-full origin-left bg-gradient-to-r from-gold-600 via-gold-400 to-amber-200 shadow-[0_0_20px_rgba(212,175,55,0.8)]"
                style={{ scaleX: lineWidth }}
              />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10 w-full justify-between">
                {steps.map((step, idx) => {
                  const isHovered = hoveredStep === idx;
                  const isAnyHovered = hoveredStep !== null;
                  const isDimmed = isAnyHovered && !isHovered;

                  return (
                    <motion.div 
                      key={step.number} 
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: idx * 0.15, type: 'spring', bounce: 0.4 }}
                      onMouseEnter={() => setHoveredStep(idx)}
                      onMouseLeave={() => setHoveredStep(null)}
                      className="relative flex flex-col items-center text-center group cursor-default"
                      style={{ opacity: isDimmed ? 0.3 : 1, scale: isHovered ? 1.05 : 1, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    >
                      {/* Outline Background Number */}
                      <span className="absolute -top-12 md:-top-16 text-8xl md:text-9xl font-bold text-transparent font-serif select-none pointer-events-none transition-all duration-500"
                            style={{ WebkitTextStroke: '2px rgba(255, 255, 255, 0.03)', zIndex: -1 }}>
                        {step.number}
                      </span>

                      {/* Glassmorphism Icon Pod */}
                      <div className="w-28 h-28 md:w-[120px] md:h-[120px] rounded-full bg-obsidian-900/60 backdrop-blur-xl border border-obsidian-700 group-hover:border-gold-500 flex items-center justify-center mb-6 relative transition-all duration-500 z-10
                        group-hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
                      >
                        {/* Inner glowing circle */}
                        <div className={`absolute inset-2 rounded-full border border-gold-500/0 group-hover:border-gold-500/30 bg-gradient-to-b from-obsidian-800 to-obsidian-950 transition-all duration-500 ${isHovered ? 'shadow-[inset_0_0_20px_rgba(212,175,55,0.2)]' : ''}`} />

                        {idx === 2 && isHovered && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <motion.div animate={{ scale: [1, 1.8], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }} className="absolute w-12 h-12 rounded-full border border-cyan-500/60" />
                            <motion.div animate={{ scale: [1, 2.2], opacity: [0.4, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3, ease: 'easeOut' }} className="absolute w-12 h-12 rounded-full border border-cyan-500/40" />
                          </div>
                        )}

                        <step.icon className={`w-8 h-8 md:w-10 md:h-10 relative z-10 transition-colors duration-500 ${isHovered ? 'text-gold-300 drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]' : 'text-gold-500'}`} />

                        {idx === 3 && isHovered && (
                          <motion.div 
                            initial={{ x: '-150%', opacity: 0 }}
                            animate={{ x: '150%', opacity: [0, 1, 0] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                            style={{ clipPath: 'circle(50% at 50% 50%)' }}
                          />
                        )}
                      </div>
                      
                      {/* Estimate Time Badge */}
                      <div className="inline-flex items-center justify-center mb-4">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-green-400 bg-green-900/20 border border-green-500/30 px-3 py-1 rounded-full">{step.time}</span>
                      </div>

                      <h3 className="font-serif text-xl text-slate-100 mb-2 group-hover:text-gold-300 transition-colors">{step.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed max-w-[260px]">{step.desc}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <FadeSection className="mt-20 text-center">
              <motion.div variants={fadeUp} className="relative inline-block group">
                <div className="absolute -inset-2 bg-gradient-to-r from-gold-600 to-amber-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                
                <MagneticWrapper>
                  <Link to="/submit" className="relative primary-btn inline-flex px-10 py-5 text-base rounded-xl bg-obsidian-950 hover:bg-obsidian-900 border border-gold-500/50 shadow-xl">
                    Submit Your Artifact <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </MagneticWrapper>
              </motion.div>
            </FadeSection>
          </div>
        </section>

        {/* ══════════════════════ TRUST STACK ══════════════════════ */}
        <TrustStack />

        {/* ── (old static section removed) ── */}
        <section className="hidden">
          {/* Ambient blobs */}
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-indigo-600/6 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] relative z-10">
            {/* Header */}
            <FadeSection>
              <motion.div variants={fadeUp} className="flex flex-col md:flex-row md:items-end gap-6 mb-16">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span className="text-xs uppercase tracking-widest text-indigo-400 font-mono">Why Aura</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif text-slate-50 leading-tight">
                    Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">Institutional</span> Trust
                  </h2>
                </div>
                <p className="text-slate-400 text-base leading-relaxed max-w-sm md:text-right">
                  Every architectural decision at Aura is designed for collectors, estate managers, and institutional investors who demand provenance certainty.
                </p>
              </motion.div>
            </FadeSection>

            {/* Bento grid */}
            <FadeSection className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

              {/* ── Hero card (spans 2 cols) ── */}
              <motion.div
                variants={fadeUp}
                className="md:col-span-2 group relative rounded-2xl overflow-hidden border border-obsidian-700 hover:border-gold-500/40 transition-all duration-500 bg-gradient-to-br from-obsidian-900 to-obsidian-950 p-8 md:p-10 min-h-[260px] flex flex-col justify-between cursor-default"
              >
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />
                {/* bg icon */}
                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <ShieldCheck className="w-56 h-56 text-gold-400" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)]">
                      <ShieldCheck className="w-7 h-7 text-obsidian-950" />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest font-mono text-gold-400 border border-gold-500/30 bg-gold-900/20 px-3 py-1 rounded-full">L3 Standard</span>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl text-slate-50 mb-3 group-hover:text-gold-200 transition-colors">Protocol-Insured Custody</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-md">Physical assets are stored in climate-controlled, globally distributed vaults with Lloyd's of London insurance — backed at the protocol layer with on-chain claim settlement.</p>
                </div>
                <div className="relative z-10 mt-8 flex items-center gap-3">
                  {['Geneva', 'London', 'Tokyo', 'Zurich', 'HK'].map(city => (
                    <span key={city} className="text-[10px] font-mono text-slate-500 border border-obsidian-700 rounded px-2 py-0.5">{city}</span>
                  ))}
                  <span className="text-[10px] font-mono text-slate-600">+18 vaults</span>
                </div>
              </motion.div>

              {/* ── Right stacked: cards 2 & 3 ── */}
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Anchor, color: 'cyan', gradient: 'from-cyan-500/10', border: 'group-hover:border-cyan-500/40',
                    glow: 'bg-cyan-500/6', badge: 'On-Chain', iconBg: 'from-cyan-600 to-cyan-400',
                    title: 'Provenance Chain', desc: 'Every transfer and appraisal event is cryptographically recorded as an ERC-721 event on Ethereum — permanent and tamper-proof.',
                    iconText: 'text-obsidian-950',
                  },
                  {
                    icon: Globe, color: 'blue', gradient: 'from-blue-500/10', border: 'group-hover:border-blue-500/40',
                    glow: 'bg-blue-500/6', badge: '98.7% Accuracy', iconBg: 'from-blue-600 to-blue-400',
                    title: 'AI Oracle Verification', desc: 'Our Vision Oracle cross-references artifacts against 14M auction records to eliminate counterfeits before listing.',
                    iconText: 'text-white',
                  },
                ].map(f => (
                  <motion.div key={f.title} variants={fadeUp} className={`group relative flex-1 rounded-2xl overflow-hidden border border-obsidian-700 ${f.border} transition-all duration-500 bg-gradient-to-br from-obsidian-900 to-obsidian-950 p-6`}>
                    <div className={`absolute inset-0 ${f.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
                    <div className="relative z-10 flex gap-4 items-start">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.iconBg} flex items-center justify-center shrink-0 shadow-lg`}>
                        <f.icon className={`w-5 h-5 ${f.iconText}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-serif text-base text-slate-100 group-hover:text-white transition-colors">{f.title}</h3>
                          <span className={`text-[9px] uppercase tracking-wider font-mono text-${f.color}-400 border border-${f.color}-500/30 px-1.5 py-0.5 rounded`}>{f.badge}</span>
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* ── Bottom row: features 4, 5, 6 with numbered accent style ── */}
              {[
                {
                  num: '04', icon: Zap, badge: 'ERC-1155', title: 'Instant Liquidity Pools',
                  desc: 'Fractionalize ownership across hundreds of co-owners, enabling price discovery and exit liquidity for even the rarest assets.',
                  accentColor: 'border-l-purple-500', numColor: 'text-purple-500/20', glow: 'group-hover:shadow-[0_0_40px_rgba(168,85,247,0.08)]',
                  iconColor: 'text-purple-400', bgIcon: 'bg-purple-900/20 border-purple-500/20',
                },
                {
                  num: '05', icon: Lock, badge: 'Tamper-Proof', title: 'NFC Twin Binding',
                  desc: 'Military-grade NFC microchips are embedded into every artifact, permanently binding the digital twin to its physical counterpart.',
                  accentColor: 'border-l-green-500', numColor: 'text-green-500/20', glow: 'group-hover:shadow-[0_0_40px_rgba(34,197,94,0.08)]',
                  iconColor: 'text-green-400', bgIcon: 'bg-green-900/20 border-green-500/20',
                },
                {
                  num: '06', icon: Clock, badge: '<48hr', title: 'Escrow Settlement',
                  desc: 'All purchases route through a time-locked smart contract escrow — funds release only after vault confirmation of physical custody transfer.',
                  accentColor: 'border-l-amber-500', numColor: 'text-amber-500/20', glow: 'group-hover:shadow-[0_0_40px_rgba(245,158,11,0.08)]',
                  iconColor: 'text-amber-400', bgIcon: 'bg-amber-900/20 border-amber-500/20',
                },
              ].map(f => (
                <motion.div
                  key={f.num}
                  variants={fadeUp}
                  className={`group relative rounded-2xl border border-obsidian-700 border-l-4 ${f.accentColor} bg-obsidian-900 hover:bg-obsidian-800/80 transition-all duration-500 p-7 ${f.glow} overflow-hidden`}
                >
                  {/* Big number bg */}
                  <span className={`absolute top-2 right-4 font-serif text-8xl font-bold leading-none ${f.numColor} select-none pointer-events-none transition-all duration-500 group-hover:opacity-90`}>{f.num}</span>
                  <div className="relative z-10">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bgIcon}`}>
                      <f.icon className={`w-5 h-5 ${f.iconColor}`} />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-serif text-lg text-slate-100 group-hover:text-white transition-colors">{f.title}</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                    <div className="mt-4 inline-flex">
                      <span className={`text-[9px] uppercase tracking-widest font-mono ${f.iconColor} border border-current/30 px-2 py-0.5 rounded-full opacity-70`}>{f.badge}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </FadeSection>
          </div>
        </section>


        {/* ══════════════════════ TESTIMONIALS ══════════════════════ */}
        <section className="py-28 bg-obsidian-900 border-t border-obsidian-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[120px] pointer-events-none" />
          <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px] relative z-10">
            <FadeSection>
              <motion.div variants={fadeUp} className="text-center mb-16">
                <p className="text-xs text-gold-500 uppercase tracking-widest font-mono mb-3">Trusted By Experts</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-50">Voices from the Vault</h2>
              </motion.div>
            </FadeSection>
            <FadeSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <motion.div key={t.name} variants={fadeUp} className="vault-glass p-8 rounded-xl border border-obsidian-700 hover:border-gold-500/30 transition-all duration-500 hover:-translate-y-1 flex flex-col gap-6">
                  <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />)}</div>
                  <p className="text-slate-300 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                  <div className="flex items-center gap-4 border-t border-obsidian-800 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-600 to-gold-400 flex items-center justify-center font-bold text-obsidian-950 text-sm shrink-0">{t.avatar}</div>
                    <div>
                      <p className="font-semibold text-slate-100 text-sm">{t.name}</p>
                      <p className="text-slate-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </FadeSection>
          </div>
        </section>

        {/* ══════════════════════ PARTNERS ══════════════════════ */}
        <section className="py-20 border-t border-obsidian-800 bg-obsidian-950">
          <div className="max-w-[90rem] mx-auto px-6 md:px-10 lg:px-[100px]">
            <FadeSection>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">Institutional Partners & Infrastructure</p>
              </motion.div>
            </FadeSection>
            <FadeSection className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {partners.map((p) => (
                <motion.div key={p.name} variants={fadeUp} className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border border-obsidian-800 hover:border-gold-500/20 bg-obsidian-900/40 hover:bg-obsidian-900 transition-all group">
                  <span className="font-serif text-lg text-slate-300 group-hover:text-gold-400 transition-colors font-semibold">{p.name}</span>
                  <span className="text-[10px] text-slate-600 uppercase tracking-wider font-mono text-center">{p.desc}</span>
                </motion.div>
              ))}
            </FadeSection>
          </div>
        </section>

        {/* ══════════════════════ FAQ ══════════════════════ */}
        <section className="py-28 bg-obsidian-900 border-t border-obsidian-800">
          <div className="max-w-3xl mx-auto px-6 md:px-10 lg:px-24">
            <FadeSection>
              <motion.div variants={fadeUp} className="text-center mb-16">
                <p className="text-xs text-gold-500 uppercase tracking-widest font-mono mb-3">Frequently Asked</p>
                <h2 className="text-4xl md:text-5xl font-serif text-slate-50">Your Questions, Answered</h2>
              </motion.div>
            </FadeSection>
            <FadeSection className="space-y-3">
              {faqs.map((faq, i) => (
                <motion.div key={i} variants={fadeUp}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left p-6 vault-glass rounded-xl border border-obsidian-700 hover:border-gold-500/30 transition-all duration-300 group flex items-center justify-between gap-4">
                    <span className="font-serif text-slate-100 text-lg group-hover:text-gold-300 transition-colors">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gold-500 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === i && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 pt-2 text-slate-400 leading-relaxed text-sm bg-obsidian-950/40 rounded-b-xl border-x border-b border-obsidian-700/50">{faq.a}</div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </FadeSection>
          </div>
        </section>

        {/* ══════════════════════ CTA ══════════════════════ */}
        <section className="py-32 bg-obsidian-950 border-t border-obsidian-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian-950 via-gold-900/5 to-obsidian-950 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-6 md:px-10 lg:px-24 text-center relative z-10">
            <FadeSection>
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 border border-gold-500/30 bg-gold-900/20 px-4 py-2 rounded-full mb-8">
                <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-gold-400 font-mono">Join 4,200+ Collectors</span>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-serif text-slate-50 mb-6 leading-tight">
                Begin Your Legacy.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-300">Own History.</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
                Whether you are an estate looking to liquidate, a collector seeking exposure to tangible assets, or an institution building an alternative portfolio — Aura Protocol provides the infrastructure.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center">
                <Link to="/browse" className="primary-btn px-10 py-5 text-lg rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.5)]">
                  Explore the Vault <Hexagon className="w-5 h-5" />
                </Link>
                <Link to="/submit" className="secondary-btn px-10 py-5 text-lg rounded-xl">
                  Submit an Artifact <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                {['No upfront fees to list', 'Protocol-level insurance', 'Instant global liquidity'].map((item) => (
                  <div key={item} className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-500" /> {item}</div>
                ))}
              </motion.div>
            </FadeSection>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
