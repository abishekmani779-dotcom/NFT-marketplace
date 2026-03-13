import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PageTransition } from '../components/PageTransition';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Mail, Key, ShieldAlert, Hexagon, History, Eye, ArrowRight, ExternalLink } from 'lucide-react';
import { mockRegistry } from '../lib/mockRegistry';

export default function Profile() {
  const { user } = useAuth();
  
  // Fake data for the portfolio UI
  const ownedAssets = mockRegistry.slice(0, 3);
  const totalValue = ownedAssets.reduce((sum, item) => sum + item.priceETH, 0);

  return (
    <PageTransition>
      {/* Background Decorative */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
         <div className="absolute top-[10%] left-[50%] w-[60vw] h-[60vw] -translate-x-1/2 bg-blue-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif text-slate-50 mb-10 flex items-center gap-4">
            Collector Configuration
            <span className="text-sm font-sans font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 px-3 py-1 rounded-full">
                Level 3 Verified
            </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Identity Card */}
            <div className="space-y-8">
                <div className="vault-glass relative rounded-3xl p-8 border border-obsidian-800 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-[40px] pointer-events-none group-hover:bg-gold-500/20 transition-all duration-700" />
                    
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-obsidian-700 mb-6" />
                    
                    <h2 className="text-3xl font-serif text-slate-100">{user?.name}</h2>
                    <p className="font-mono text-sm text-slate-500 mt-1 mb-8">Role: {user?.role.toUpperCase()}</p>

                    <div className="space-y-4 font-mono text-sm">
                        <div className="flex justify-between items-center bg-obsidian-950/80 p-3 rounded-xl border border-obsidian-800/80">
                            <span className="text-slate-500 flex items-center gap-2"><Key className="w-4 h-4" /> Wallet</span>
                            <span className="text-slate-300">0x8A2345...c41F</span>
                        </div>
                        <div className="flex justify-between items-center bg-obsidian-950/80 p-3 rounded-xl border border-obsidian-800/80">
                            <span className="text-slate-500 flex items-center gap-2"><Mail className="w-4 h-4" /> Email</span>
                            <span className="text-slate-300">{user?.name.replace(' ', '.').toLowerCase()}@aura.link</span>
                        </div>
                    </div>
                </div>

                <div className="vault-glass rounded-3xl p-8 border border-obsidian-800 bg-obsidian-950/40">
                    <h3 className="font-serif text-xl text-slate-200 mb-6">Security & Privileges</h3>
                    
                    <div className="space-y-5">
                       <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                               <ShieldCheck className="w-5 h-5 text-emerald-400" />
                           </div>
                           <div>
                               <p className="text-slate-200 font-medium text-sm">Escrow Whitelisted</p>
                               <p className="text-xs text-slate-500 mt-1 leading-relaxed">Account is cleared for instant multi-sig escrow settlement for assets up to 500 ETH.</p>
                           </div>
                       </div>
                       <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                               <Award className="w-5 h-5 text-blue-400" />
                           </div>
                           <div>
                               <p className="text-slate-200 font-medium text-sm">Direct Vault Interfacing</p>
                               <p className="text-xs text-slate-500 mt-1 leading-relaxed">Authorized to request physical inspections of vaulted protocol assets.</p>
                           </div>
                       </div>
                       <div className="flex gap-4 items-start opacity-50">
                           <div className="w-10 h-10 rounded-full border border-obsidian-700 flex items-center justify-center shrink-0">
                               <ShieldAlert className="w-5 h-5 text-slate-500" />
                           </div>
                           <div>
                               <p className="text-slate-400 font-medium text-sm">Oracle Operator</p>
                               <p className="text-xs text-slate-600 mt-1">Requires DAO governance vote to unlock data feed permissions.</p>
                           </div>
                       </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Portfolio */}
            <div className="lg:col-span-2 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="vault-glass p-5 rounded-2xl border border-obsidian-800 bg-obsidian-900/30">
                        <span className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">Portfolio Value</span>
                        <span className="text-2xl font-serif text-gold-400">{totalValue.toFixed(1)} ETH</span>
                    </div>
                    <div className="vault-glass p-5 rounded-2xl border border-obsidian-800 bg-obsidian-900/30">
                        <span className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">Vaulted Assets</span>
                        <span className="text-2xl font-serif text-slate-200">{ownedAssets.length} Total</span>
                    </div>
                    <div className="vault-glass p-5 rounded-2xl border border-obsidian-800 bg-obsidian-900/30">
                        <span className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">Lifetime Volume</span>
                        <span className="text-2xl font-serif text-slate-200">142.5 ETH</span>
                    </div>
                    <div className="vault-glass p-5 rounded-2xl border border-obsidian-800 bg-obsidian-900/30">
                        <span className="block text-xs uppercase tracking-widest font-semibold text-slate-500 mb-1">Active Offers</span>
                        <span className="text-2xl font-serif text-blue-400">2 Pending</span>
                    </div>
                </div>

                <div className="vault-glass rounded-3xl border border-obsidian-800 shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-obsidian-800 flex justify-between items-center bg-obsidian-950/60">
                         <h2 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                            <Hexagon className="w-5 h-5 text-gold-500" /> My Physical Vault
                         </h2>
                         <button className="text-sm text-gold-500 hover:text-gold-400 font-medium transition-colors flex items-center gap-1">
                             Request Shipment <ArrowRight className="w-4 h-4 ml-1" />
                         </button>
                    </div>

                    <div className="w-full overflow-x-auto">
                       <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                          <thead className="bg-obsidian-950/40 text-[10px] uppercase tracking-widest text-slate-500 border-b border-obsidian-800/50">
                             <tr>
                               <th className="p-5 font-medium">Asset</th>
                               <th className="p-5 font-medium">Est. Value</th>
                               <th className="p-5 font-medium">Location</th>
                               <th className="p-5 font-medium text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-obsidian-800/30 bg-obsidian-900/10">
                             {ownedAssets.map((asset, i) => (
                               <tr key={i} className="hover:bg-obsidian-800/30 transition-colors">
                                 <td className="p-5 flex items-center gap-4">
                                     <img src={asset.image} alt="" className="w-12 h-12 object-cover rounded-md border border-obsidian-700" />
                                     <div>
                                         <p className="font-serif text-slate-200 text-base">{asset.title}</p>
                                         <p className="text-[10px] text-gold-500/80 font-mono tracking-widest mt-0.5">{asset.digitalOwnership.tokenId}</p>
                                     </div>
                                 </td>
                                 <td className="p-5 font-mono text-slate-300 font-medium">{asset.priceETH} ETH</td>
                                 <td className="p-5 font-mono text-slate-400 text-xs">{asset.physicalCustody.vaultLocation}</td>
                                 <td className="p-5 text-right">
                                    <button className="p-2 hover:bg-obsidian-800 rounded-lg transition-colors border border-transparent hover:border-obsidian-700 inline-flex items-center gap-2 group">
                                         <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest group-hover:text-slate-300">View</span> 
                                         <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-gold-400" />
                                    </button>
                                 </td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                </div>

                <div className="vault-glass rounded-3xl border border-obsidian-800 p-8">
                     <div className="flex items-center justify-between mb-8">
                         <h2 className="text-xl font-serif text-slate-100 flex items-center gap-3">
                            <History className="w-5 h-5 text-blue-400" /> Recent Escrow Signatures
                         </h2>
                     </div>
                     <div className="space-y-4">
                         {[1,2,3].map((_, i) => (
                             <div key={i} className="bg-obsidian-950/50 border border-obsidian-800/50 rounded-xl p-4 flex items-center justify-between">
                                 <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-full border border-blue-500/30 bg-blue-500/10 flex items-center justify-center">
                                         <Key className="w-4 h-4 text-blue-400" />
                                     </div>
                                     <div>
                                         <p className="text-sm font-medium text-slate-200">Authorized Formal Offer</p>
                                         <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">Tx: 0x82f...a91c</p>
                                     </div>
                                 </div>
                                 <div className="text-right">
                                     <span className="block text-sm font-mono text-slate-300">45.0 ETH</span>
                                     <span className="block text-xs text-slate-500 mt-0.5">2 days ago</span>
                                 </div>
                             </div>
                         ))}
                     </div>
                </div>
            </div>
        </div>
      </div>
    </PageTransition>
  );
}
