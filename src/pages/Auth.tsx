import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Vault, Mail, Lock, User, Eye, EyeOff, ArrowRight,
  CheckCircle, ShieldCheck, Fingerprint, Upload,
  Sparkles, ChevronRight, AlertTriangle, Loader2,
  Globe, Phone, Calendar, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Types ─────────────────────────────────────────────────────── */
type Screen = 'landing' | 'signin' | 'signup' | 'onboard-identity' | 'onboard-kyc' | 'onboard-agreement' | 'success';

/* ─── Shared input ───────────────────────────────────────────────── */
function Field({ label, type = 'text', placeholder, icon: Icon, value, onChange, error }: {
  label: string; type?: string; placeholder: string;
  icon: React.ElementType; value: string;
  onChange: (v: string) => void; error?: string;
}) {
  const [show, setShow] = useState(false);
  const isPass = type === 'password';
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono uppercase tracking-widest text-slate-500">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
        <input
          type={isPass && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full bg-obsidian-900 border rounded-xl pl-10 pr-${isPass ? '10' : '4'} py-3 text-sm text-slate-100 placeholder-slate-600
            focus:outline-none transition-all
            ${error
              ? 'border-red-500/60 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-obsidian-700 focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20'}`}
        />
        {isPass && (
          <button type="button" onClick={() => setShow(p => !p)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

/* ─── Progress bar ───────────────────────────────────────────────── */
function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((label, i) => (
        <React.Fragment key={label}>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: i === current ? 1.1 : 1 }}
              className={`w-7 h-7 rounded-full flex items-center justify-center border text-xs font-bold transition-colors ${
                i < current  ? 'bg-gold-500 border-gold-400 text-obsidian-950'
                : i === current ? 'border-gold-500 text-gold-400 bg-gold-500/10'
                : 'border-obsidian-700 text-slate-600'
              }`}
            >
              {i < current ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </motion.div>
            <span className={`text-[10px] font-mono uppercase tracking-widest hidden sm:block ${
              i === current ? 'text-gold-400' : i < current ? 'text-slate-400' : 'text-slate-600'
            }`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px transition-colors ${i < current ? 'bg-gold-500/40' : 'bg-obsidian-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Slide animation wrapper ────────────────────────────────────── */
const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -40 },
  transition: { duration: 0.22 },
};

/* ─── UnicornStudio Embed ────────────────────────────────────────── */
function UnicornEmbed() {
  React.useEffect(() => {
    // Inject the script only once
    if (!document.getElementById('unicorn-studio-script')) {
      const s = document.createElement('script');
      s.id  = 'unicorn-studio-script';
      s.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';
      s.type = 'text/javascript';
      s.onload = () => {
        const us = (window as any).UnicornStudio;
        if (us && us.init) us.init();
      };
      (document.head || document.body).appendChild(s);
    } else {
      const us = (window as any).UnicornStudio;
      if (us && us.init) us.init();
    }
  }, []);

  return (
    <div
      data-us-project="WGMUtS1uEqfsXhemzHaJ"
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/* ─── Main Auth Page ─────────────────────────────────────────────── */
export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, completeOnboarding } = useAuth();
  // Where to send after auth — fall back to /admin (not /) for new + returning users
  const from = (location.state as any)?.from?.pathname;
  const destination = (from && from !== '/') ? from : '/admin';

  const [screen, setScreen] = useState<Screen>('landing');
  const [loading, setLoading] = useState(false);

  /* Sign In form */
  const [siEmail, setSiEmail] = useState('');
  const [siPass,  setSiPass]  = useState('');
  const [siError, setSiError] = useState('');

  /* Sign Up form */
  const [suName,  setSuName]  = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPass,  setSuPass]  = useState('');
  const [suError, setSuError] = useState('');

  /* Onboard — identity */
  const [phone,   setPhone]   = useState('');
  const [country, setCountry] = useState('');
  const [dob,     setDob]     = useState('');

  /* Onboard — KYC */
  const [docType, setDocType] = useState<'passport' | 'license' | 'id'>('passport');
  const [docUploaded, setDocUploaded] = useState(false);

  /* Onboard — agreement */
  const [agreed, setAgreed] = useState(false);

  /* ── Handlers ── */
  const handleSignIn = async () => {
    if (!siEmail || !siPass) { setSiError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    setLoading(false);
    login({
      id: 'u-001', name: siEmail.split('@')[0], email: siEmail,
      role: 'admin',
      kycVerified: true, isOnboarded: true,
    });
    navigate(destination, { replace: true });
  };

  const handleSignUp = async () => {
    if (!suName || !suEmail || !suPass) { setSuError('Please fill in all fields.'); return; }
    if (suPass.length < 8) { setSuError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    // Store partial user, move to onboarding
    login({
      id: 'u-new', name: suName, email: suEmail,
      role: 'admin', kycVerified: false, isOnboarded: false,
    });
    setScreen('onboard-identity');
  };

  const handleIdentityNext = () => {
    if (!phone || !country || !dob) return;
    setScreen('onboard-kyc');
  };

  const handleKycNext = () => {
    if (!docUploaded) return;
    setScreen('onboard-agreement');
  };

  const handleFinalSubmit = async () => {
    if (!agreed) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    completeOnboarding();
    setScreen('success');
    setTimeout(() => navigate(destination, { replace: true }), 2500);
  };

  /* ── Background decoration ── */
  const Bg = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute top-[-15%] left-[-5%]  w-[50vw] h-[50vw] bg-gold-600/5   rounded-full blur-[140px]" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-blue-800/5  rounded-full blur-[120px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_60%,_rgba(0,0,0,0.4)_100%)]" />
    </div>
  );

  /* ── Logo ── */
  const Logo = () => (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)]">
        <Vault className="w-5 h-5 text-obsidian-950" />
      </div>
      <div>
        <span className="font-serif text-xl text-slate-50 font-semibold">Aura</span>
        <span className="block text-[9px] font-mono tracking-[0.2em] uppercase text-gold-500/70 -mt-0.5">Protocol</span>
      </div>
    </div>
  );

  /* ── Right-side video panel (always visible on landing/signin/signup) ── */
  const isFormScreen = ['landing', 'signin', 'signup'].includes(screen);

  return (
    <div className="h-screen overflow-hidden flex p-[100px] gap-10">
      <Bg />

      {/* ══ LEFT column — video box ══ */}
      <AnimatePresence>
        {isFormScreen && (
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="hidden lg:flex w-1/2 items-center justify-center p-10"
          >
            {/* UnicornStudio embed box */}
            <div className="w-full h-full max-h-[85vh] rounded-2xl overflow-hidden border border-obsidian-700/60 shadow-[0_0_60px_rgba(0,0,0,0.5)] relative">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500/70 to-transparent z-10" />
              <div className="absolute inset-0">
                <UnicornEmbed />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ RIGHT column — form ══ */}
      <div className={`flex items-center justify-center px-8 py-12 transition-all duration-500 ${isFormScreen ? 'w-full lg:w-1/2' : 'w-full'}`}>
        <div className="w-full max-w-md">
      <AnimatePresence mode="wait">

        {/* ══════════════════════════════════════════
            LANDING — Choose Sign In or Sign Up
        ══════════════════════════════════════════ */}
        {screen === 'landing' && (
          <motion.div key="landing" {...slide} className="w-full max-w-md">
            <Logo />
            <h1 className="text-4xl font-serif text-slate-50 mb-2 leading-tight">
              Welcome to the<br />
              <span className="text-gold-400">Digital Vault</span>
            </h1>
            <p className="text-slate-500 text-sm mb-10">
              Access institutional-grade RWA tokenization and provenance authentication.
            </p>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setScreen('signin')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-3 shadow-[0_0_24px_rgba(212,175,55,0.25)] hover:shadow-[0_0_36px_rgba(212,175,55,0.4)] transition-shadow"
              >
                <Lock className="w-4 h-4" />
                Sign In to your Vault
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setScreen('signup')}
                className="w-full py-4 rounded-xl bg-obsidian-900 border border-obsidian-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-3 hover:border-gold-500/40 hover:bg-obsidian-800 transition-all"
              >
                <Sparkles className="w-4 h-4 text-gold-400" />
                Create a new account
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </motion.button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: 'KYC Verified', sub: 'Identity confirmed' },
                { icon: Fingerprint, label: 'Biometric 2FA', sub: 'Hardware-secured' },
                { icon: Globe, label: 'Global Vaults', sub: '12 locations' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl border border-obsidian-800 bg-obsidian-950/60">
                  <Icon className="w-4 h-4 text-gold-500/70 mx-auto mb-1.5" />
                  <p className="text-[10px] font-semibold text-slate-300">{label}</p>
                  <p className="text-[9px] text-slate-600">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            SIGN IN
        ══════════════════════════════════════════ */}
        {screen === 'signin' && (
          <motion.div key="signin" {...slide} className="w-full max-w-md">
            <Logo />
            <h2 className="text-3xl font-serif text-slate-50 mb-1">Sign In</h2>
            <p className="text-slate-500 text-sm mb-8">Access your institutional vault account.</p>

            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 space-y-5">
              <Field label="Email Address"   type="email"    placeholder="you@aura.link"   icon={Mail}  value={siEmail} onChange={setSiEmail} />
              <Field label="Password"        type="password" placeholder="••••••••••••"    icon={Lock}  value={siPass}  onChange={setSiPass} />

              {siError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />{siError}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignIn}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Lock className="w-4 h-4" />Access Vault<ArrowRight className="w-4 h-4" /></>}
              </motion.button>

              <p className="text-center text-xs text-slate-600">
                Don't have an account?{' '}
                <button onClick={() => setScreen('signup')} className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                  Create one
                </button>
              </p>
            </div>

            <button onClick={() => setScreen('landing')} className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto">
              ← Back
            </button>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            SIGN UP
        ══════════════════════════════════════════ */}
        {screen === 'signup' && (
          <motion.div key="signup" {...slide} className="w-full max-w-md">
            <Logo />
            <h2 className="text-3xl font-serif text-slate-50 mb-1">Create Account</h2>
            <p className="text-slate-500 text-sm mb-8">Begin your verified collector journey.</p>

            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 space-y-5">
              <Field label="Full Name"      placeholder="Alexandra Chen"   icon={User} value={suName}  onChange={setSuName} />
              <Field label="Email Address"  type="email" placeholder="you@aura.link" icon={Mail} value={suEmail} onChange={setSuEmail} />
              <Field label="Password"       type="password" placeholder="Min. 8 characters" icon={Lock} value={suPass} onChange={setSuPass} />

              {suError && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5" />{suError}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignUp}
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.35)] transition-all disabled:opacity-60"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" />Continue to Verification<ArrowRight className="w-4 h-4" /></>}
              </motion.button>

              <p className="text-center text-xs text-slate-600">
                Already have an account?{' '}
                <button onClick={() => setScreen('signin')} className="text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                  Sign in
                </button>
              </p>
            </div>

            <button onClick={() => setScreen('landing')} className="mt-4 text-xs text-slate-600 hover:text-slate-400 transition-colors flex items-center gap-1 mx-auto">
              ← Back
            </button>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            ONBOARDING — Identity
        ══════════════════════════════════════════ */}
        {screen === 'onboard-identity' && (
          <motion.div key="onboard-identity" {...slide} className="w-full max-w-lg">
            <Logo />
            <div className="mb-8">
              <Stepper steps={['Identity', 'KYC Docs', 'Agreement']} current={0} />
            </div>

            <h2 className="text-3xl font-serif text-slate-50 mb-1">Identity Setup</h2>
            <p className="text-slate-500 text-sm mb-8">Required for institutional compliance and vault access.</p>

            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 space-y-5">
              <Field label="Phone Number" placeholder="+1 (555) 000-0000" icon={Phone} value={phone} onChange={setPhone} />
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-widest text-slate-500">Country of Residence</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                  <input
                    type="text" placeholder="United States" value={country} onChange={e => setCountry(e.target.value)}
                    className="w-full bg-obsidian-900 border border-obsidian-700 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition-all"
                  />
                </div>
              </div>
              <Field label="Date of Birth" type="date" placeholder="YYYY-MM-DD" icon={Calendar} value={dob} onChange={setDob} />

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleIdentityNext}
                disabled={!phone || !country || !dob}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-40"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            ONBOARDING — KYC Documents
        ══════════════════════════════════════════ */}
        {screen === 'onboard-kyc' && (
          <motion.div key="onboard-kyc" {...slide} className="w-full max-w-lg">
            <Logo />
            <div className="mb-8">
              <Stepper steps={['Identity', 'KYC Docs', 'Agreement']} current={1} />
            </div>

            <h2 className="text-3xl font-serif text-slate-50 mb-1">Document Verification</h2>
            <p className="text-slate-500 text-sm mb-8">Upload a government-issued ID for KYC compliance.</p>

            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 space-y-6">
              {/* Doc type selector */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-widest text-slate-500">Document Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['passport', 'license', 'id'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setDocType(d)}
                      className={`py-3 px-2 rounded-xl border text-xs font-semibold capitalize transition-all ${
                        docType === d
                          ? 'border-gold-500/50 bg-gold-500/10 text-gold-400'
                          : 'border-obsidian-700 text-slate-500 hover:border-obsidian-600 hover:text-slate-300'
                      }`}
                    >
                      {d === 'license' ? "Driver's Lic." : d === 'id' ? 'National ID' : 'Passport'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload area */}
              <motion.div
                onClick={() => setDocUploaded(true)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-4 transition-all ${
                  docUploaded
                    ? 'border-emerald-500/50 bg-emerald-500/5'
                    : 'border-obsidian-700 hover:border-gold-500/40 hover:bg-obsidian-900/40'
                }`}
              >
                {docUploaded ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
                    <CheckCircle className="w-12 h-12 text-emerald-400" />
                  </motion.div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-slate-500" />
                  </div>
                )}
                <div className="text-center">
                  <p className={`font-semibold text-sm ${docUploaded ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {docUploaded ? 'Document uploaded successfully' : 'Click to upload document'}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {docUploaded ? 'Processing with Oracle Vision AI…' : 'JPG, PNG or PDF · Max 10MB'}
                  </p>
                </div>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleKycNext}
                disabled={!docUploaded}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-40"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            ONBOARDING — Agreement
        ══════════════════════════════════════════ */}
        {screen === 'onboard-agreement' && (
          <motion.div key="onboard-agreement" {...slide} className="w-full max-w-lg">
            <Logo />
            <div className="mb-8">
              <Stepper steps={['Identity', 'KYC Docs', 'Agreement']} current={2} />
            </div>

            <h2 className="text-3xl font-serif text-slate-50 mb-1">Platform Agreement</h2>
            <p className="text-slate-500 text-sm mb-8">Review and accept the Aura Protocol terms before accessing the vault.</p>

            <div className="vault-glass border border-obsidian-800 rounded-2xl p-8 space-y-6">
              {/* Terms scroll box */}
              <div className="h-52 overflow-y-auto rounded-xl border border-obsidian-700 bg-obsidian-950 p-5 text-xs text-slate-500 space-y-3 leading-relaxed scrollbar-thin">
                <p className="font-semibold text-slate-300 text-sm">Aura Protocol — Collector Service Agreement</p>
                <p>By creating an account, you agree to comply with all applicable laws governing digital asset ownership and real-world asset tokenization in your jurisdiction.</p>
                <p>You acknowledge that all physical assets submitted for tokenization must be authentic, legally owned, and free of any encumbrances or liens. Submission of fraudulent documentation is a criminal offence subject to prosecution.</p>
                <p>Aura Protocol employs Oracle AI vision scanning and metadata cross-referencing to validate all submitted assets. Trust scores are computed autonomously and may affect listing eligibility.</p>
                <p>All transactions are processed on-chain via smart contracts. Aura Protocol does not hold custody of digital assets or ETH on behalf of users.</p>
                <p>Aura Protocol reserves the right to suspend or terminate accounts found to be in violation of these terms without prior notice.</p>
                <p>For questions, contact our compliance team at compliance@aura.link.</p>
              </div>

              {/* Checkbox */}
              <button
                onClick={() => setAgreed(p => !p)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-all ${
                  agreed ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-obsidian-700 hover:border-obsidian-600'
                }`}
              >
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                  agreed ? 'border-emerald-500 bg-emerald-500' : 'border-obsidian-600'
                }`}>
                  <AnimatePresence>
                    {agreed && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle className="w-3 h-3 text-obsidian-950" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <p className="text-xs text-slate-400 text-left leading-relaxed">
                  I have read and agree to the Aura Protocol Collector Service Agreement and acknowledge the KYC verification requirements.
                </p>
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleFinalSubmit}
                disabled={!agreed || loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 text-obsidian-950 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all disabled:opacity-40"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                  : <><ShieldCheck className="w-4 h-4" /> Activate Vault Access <ArrowRight className="w-4 h-4" /></>
                }
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════════════════
            SUCCESS
        ══════════════════════════════════════════ */}
        {screen === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(212,175,55,0.5)]"
            >
              <Award className="w-12 h-12 text-obsidian-950" />
            </motion.div>

            <div>
              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-3xl font-serif text-gold-400 mb-2">Vault Access Granted</motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
                className="text-slate-500 text-sm">Identity verified · Redirecting you now…</motion.p>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="flex justify-center gap-6 text-xs text-slate-600 font-mono">
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" />KYC Passed</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" />Agreement Signed</span>
              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" />Onboarded</span>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
        </div>{/* end inner max-w */}
      </div>{/* end right col */}

    </div>
  );
}
