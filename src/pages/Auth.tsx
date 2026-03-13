import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../components/PageTransition';
import { Hexagon, Lock, ShieldCheck, ArrowRight, CheckCircle2, User, Mail, ShieldAlert, Fingerprint } from 'lucide-react';

export default function Auth() {
  const { login, completeOnboarding, isAuthenticated, isOnboarded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin'; // Redirect here after completion
  
  // States: 'login' | 'signup' | 'onboarding'
  const [view, setView] = useState<'login' | 'signup' | 'onboarding'>(
    isAuthenticated && !isOnboarded ? 'onboarding' : 'login'
  );

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Onboarding Steps
  const [onboardingStep, setOnboardingStep] = useState(1);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Mock login as admin/user
      login({ id: '1', name: 'Aura Collector', role: 'admin' }, false);
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 1500);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      // Mock signup, sets them to NOT onboarded
      login({ id: '2', name: 'New Collector', role: 'admin' }, true);
      setIsLoading(false);
      setView('onboarding');
    }, 1500);
  };

  const finishOnboarding = () => {
    setIsLoading(true);
    setTimeout(() => {
      completeOnboarding();
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 2000);
  };

  return (
    <PageTransition>
      {/* Background Decorative */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] bg-gold-600/5 rounded-full blur-[150px]" />
         <div className="absolute bottom-[-20%] right-[10%] w-[50vw] h-[50vw] bg-obsidian-700/10 rounded-full blur-[120px]" />
      </div>

      <div className="min-h-[85vh] flex items-center justify-center p-4">
        
        <AnimatePresence mode="wait">
          
          {/* LOGIN VIEW */}
          {view === 'login' && (
            <motion.div 
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full max-w-md vault-glass p-10 rounded-3xl border border-obsidian-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-gold-500/20 transition-colors duration-700" />
              
              <div className="text-center mb-10 relative z-10">
                 <div className="inline-flex w-16 h-16 rounded-2xl bg-obsidian-900 border border-obsidian-700 items-center justify-center mb-6 shadow-inner">
                    <Lock className="w-8 h-8 text-gold-500" />
                 </div>
                 <h1 className="text-3xl font-serif text-slate-50 mb-2">Vault Access</h1>
                 <p className="text-slate-400 text-sm">Authenticate your identity to continue.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                  <div>
                      <label className="text-[10px] font-semibold text-gold-500 uppercase tracking-widest mb-2 block">Secure Identifier</label>
                      <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                              type="text" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Alias or Email" 
                              className="w-full bg-obsidian-950/80 border border-obsidian-700 focus:border-gold-500/70 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 outline-none transition-colors shadow-inner"
                          />
                      </div>
                  </div>
                  <div>
                      <label className="text-[10px] font-semibold text-gold-500 uppercase tracking-widest mb-2 block">Passphrase Encryption</label>
                      <div className="relative">
                          <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input 
                              type="password" 
                              required
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="••••••••" 
                              className="w-full bg-obsidian-950/80 border border-obsidian-700 focus:border-gold-500/70 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 outline-none transition-colors shadow-inner font-mono tracking-widest"
                          />
                      </div>
                  </div>
                  
                  <button 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 tracking-wide mt-8 disabled:opacity-50"
                  >
                     {isLoading ? <span className="animate-pulse">Authenticating...</span> : 'Access Protocol'}
                  </button>
              </form>

              <div className="mt-8 text-center relative z-10">
                  <span className="text-slate-500 text-sm">New to Aura Vaults? </span>
                  <button onClick={() => setView('signup')} className="text-gold-400 hover:text-gold-300 transition-colors font-medium">Verify Identity</button>
              </div>
            </motion.div>
          )}

          {/* SIGNUP VIEW */}
          {view === 'signup' && (
             <motion.div 
               key="signup"
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -50 }}
               className="w-full max-w-md vault-glass p-10 rounded-3xl border border-obsidian-800 shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative overflow-hidden group"
             >
                <div className="text-center mb-10 relative z-10">
                   <div className="inline-flex w-16 h-16 rounded-2xl bg-obsidian-900 border border-obsidian-700 items-center justify-center mb-6 shadow-inner">
                      <Hexagon className="w-8 h-8 text-blue-500" />
                   </div>
                   <h1 className="text-3xl font-serif text-slate-50 mb-2">Establish Identity</h1>
                   <p className="text-slate-400 text-sm">Initialize a new secure vault persona.</p>
                </div>
  
                <form onSubmit={handleSignup} className="space-y-6 relative z-10">
                    <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Direct Comm Link</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                                type="email" 
                                required
                                placeholder="name@domain.com" 
                                className="w-full bg-obsidian-950/80 border border-obsidian-700 focus:border-blue-500/70 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 outline-none transition-colors shadow-inner"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2 block">Master Password</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input 
                                type="password" 
                                required
                                placeholder="••••••••" 
                                className="w-full bg-obsidian-950/80 border border-obsidian-700 focus:border-blue-500/70 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 outline-none transition-colors shadow-inner tracking-widest"
                            />
                        </div>
                    </div>
                    
                    <button 
                      disabled={isLoading}
                      className="w-full bg-slate-100 text-obsidian-950 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:bg-white active:scale-[0.98] transition-all flex justify-center items-center gap-2 tracking-wide mt-8"
                    >
                       {isLoading ? <span className="animate-pulse">Generating Proofs...</span> : 'Initialize Status'}
                    </button>
                </form>
  
                <div className="mt-8 text-center relative z-10">
                    <span className="text-slate-500 text-sm">Already established? </span>
                    <button onClick={() => setView('login')} className="text-blue-400 hover:text-blue-300 transition-colors font-medium">Return to Login</button>
                </div>
             </motion.div>
          )}

          {/* ONBOARDING VIEW */}
          {view === 'onboarding' && (
              <motion.div 
               key="onboarding"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               className="w-full max-w-2xl vault-glass rounded-3xl border border-gold-500/30 shadow-[0_30px_80px_rgba(212,175,55,0.1)] overflow-hidden flex flex-col md:flex-row relative"
             >
                {/* Left Progress Sidebar */}
                <div className="md:w-1/3 bg-obsidian-950 p-8 border-r border-obsidian-800">
                    <h3 className="font-serif text-gold-400 text-xl mb-8 border-b border-obsidian-800/50 pb-4">Verification Layer</h3>
                    
                    <div className="space-y-6">
                        {[
                            { step: 1, name: 'Wallet Integration' },
                            { step: 2, name: 'KYC Escrow Checks' },
                            { step: 3, name: 'Vault Guidelines' }
                        ].map((item) => {
                            const isActive = onboardingStep === item.step;
                            const isPast = onboardingStep > item.step;
                            return (
                                <div key={item.step} className="flex gap-4">
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shadow-lg z-10 ${isActive ? 'bg-gold-500 border-gold-400 border-solid animate-pulse' : isPast ? 'bg-obsidian-800 border-gold-500/30' : 'bg-obsidian-950 border-obsidian-800'}`}>
                                            {isPast ? <CheckCircle2 className="w-4 h-4 text-gold-500" /> : <span className={`text-xs font-mono font-bold ${isActive ? 'text-obsidian-950' : 'text-slate-600'}`}>{item.step}</span>}
                                        </div>
                                        {item.step !== 3 && <div className={`absolute top-8 w-[2px] h-12 ${isPast ? 'bg-gold-500/30' : 'bg-obsidian-800'} -z-0`} />}
                                    </div>
                                    <div className={`pt-1.5 transition-colors ${isActive ? 'text-slate-100' : isPast ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-1">{isActive ? 'Current Phase' : isPast ? 'Verified' : 'Pending'}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="md:w-2/3 p-10 bg-gradient-to-br from-obsidian-900 to-obsidian-950 relative overflow-hidden">
                    <div className="absolute top-[-50%] right-[-50%] w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="h-full flex flex-col relative z-10">
                        {onboardingStep === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center py-6">
                                <div className="w-20 h-20 bg-obsidian-950 border border-obsidian-700/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <Hexagon className="w-10 h-10 text-slate-400" />
                                </div>
                                <h2 className="text-2xl font-serif text-slate-50 mb-3">Initialize Web3 Link</h2>
                                <p className="text-slate-400 text-sm mb-8 px-4 leading-relaxed">Connect a recognized digital wallet. This cryptographic signature will be used to hold digital ownership tokens for your physical vaults.</p>
                                <button className="mx-auto w-3/4 bg-obsidian-800 hover:bg-obsidian-700 border border-obsidian-600 text-slate-200 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-3">
                                   Connect MetaMask
                                </button>
                                <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-6">Hardware Wallets Recommended</p>
                            </motion.div>
                        )}

                        {onboardingStep === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 py-4">
                                <h2 className="text-2xl font-serif text-slate-50 mb-3">Decentralized KYC</h2>
                                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Due to the high-value nature of the Physical Vaults, partial identification verification is mandated by Protocol Underwriters.</p>
                                
                                <div className="space-y-4">
                                   <div className="bg-obsidian-950 border border-obsidian-800 p-4 rounded-xl flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-lg bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20">
                                              <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                          </div>
                                          <div>
                                              <p className="text-slate-200 text-sm font-medium">Clearance Level 1</p>
                                              <p className="text-slate-500 text-xs font-mono">Anonymous Address Approved</p>
                                          </div>
                                      </div>
                                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                   </div>
                                   <div className="bg-gold-900/10 border border-gold-500/30 p-4 rounded-xl flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-lg bg-obsidian-900 flex items-center justify-center border border-obsidian-700">
                                              <ShieldAlert className="w-5 h-5 text-gold-400 animate-pulse" />
                                          </div>
                                          <div>
                                              <p className="text-gold-400 text-sm font-medium">Verify Identity</p>
                                              <p className="text-slate-500 text-xs font-mono px-0">Required for assets &gt; $50k</p>
                                          </div>
                                      </div>
                                      <button className="bg-gold-500/20 text-gold-400 hover:bg-gold-500/30 text-xs px-3 py-1.5 rounded uppercase tracking-wider font-bold transition-colors">Start Scan</button>
                                   </div>
                                </div>
                            </motion.div>
                        )}

                        {onboardingStep === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 text-center py-6">
                                <div className="w-20 h-20 bg-gold-900/20 shadow-[0_0_30px_rgba(212,175,55,0.2)] border border-gold-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-10 h-10 text-gold-400" />
                                </div>
                                <h2 className="text-2xl font-serif text-slate-50 mb-3">Protocol Synchronized</h2>
                                <p className="text-slate-400 text-sm mb-8 px-4 leading-relaxed">Your identity parameters are set and your digital signature is cleared. You can now securely interact with physical artifacts seamlessly through the blockchain.</p>
                                
                                <button 
                                  onClick={finishOnboarding}
                                  disabled={isLoading}
                                  className="w-full bg-gradient-to-r from-gold-600 to-gold-400 text-obsidian-950 font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center gap-2 uppercase tracking-wide disabled:opacity-50 disabled:cursor-wait"
                                >
                                   {isLoading ? 'Finalizing...' : 'Enter Main Vault'} <ArrowRight className="w-5 h-5" />
                                </button>
                            </motion.div>
                        )}

                        {onboardingStep < 3 && (
                            <div className="mt-8 border-t border-obsidian-800 pt-6 flex justify-between">
                                <button 
                                    onClick={() => setOnboardingStep(Math.max(1, onboardingStep - 1))}
                                    className={`text-slate-500 font-medium text-sm transition-colors hover:text-slate-300 ${onboardingStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => setOnboardingStep(Math.min(3, onboardingStep + 1))}
                                    className="bg-obsidian-800 hover:bg-obsidian-700 text-slate-100 border border-obsidian-600 px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                                >
                                    Proceed <ArrowRight className="w-4 h-4 text-gold-500" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
              </motion.div>
          )}

        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
