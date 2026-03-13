import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, Navigation } from 'lucide-react';

export function ProvenanceGraph({ custody, ownership }: { custody: any, ownership: any }) {
  // A simplified, stylized map SVG path (rough representation of world outline)
  const mapPath = "M100 150 Q150 120 200 130 T300 110 T400 140 T500 120 T600 150 Q650 180 600 200 T400 220 T200 210 T100 180 Z M250 180 Q280 150 320 160 T350 190 T300 200 Z";

  return (
    <div className="vault-glass p-6 rounded-lg relative overflow-hidden bg-obsidian-900 border border-obsidian-800">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px)] bg-[size:30px] opacity-30 pointer-events-none" />
      
      <div className="flex justify-between items-center mb-8 border-b border-obsidian-800 pb-4 relative z-10">
        <h3 className="text-xl font-serif text-slate-50 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-gold-500" /> Physical Provenance Route
        </h3>
        <span className="text-xs uppercase tracking-widest text-slate-400 font-mono">Real-time Location Tracker</span>
      </div>

      <div className="relative z-10 h-64 w-full flex items-center justify-center">
        {/* Stylized SVG Map */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <svg viewBox="0 0 800 400" className="w-full h-full text-slate-500 fill-current">
                <path d={mapPath} />
            </svg>
        </div>

        {/* The Animated Journey line */}
        <div className="relative w-full h-full flex items-center justify-between px-10 md:px-20">
            {/* Origin Point */}
            <div className="relative z-20 flex flex-col items-center">
                <motion.div 
                    className="w-4 h-4 rounded-full bg-slate-500 border-2 border-slate-400 shadow-[0_0_15px_rgba(148,163,184,0.5)]"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
                />
                <motion.div 
                    className="absolute top-6 flex flex-col items-center min-w-max"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <span className="text-xs font-bold text-slate-300">Origin Confirmed</span>
                    <span className="text-[10px] font-mono text-slate-500">Excavation Site / Estate</span>
                </motion.div>
                <MapPin className="absolute -top-6 w-5 h-5 text-slate-400" />
            </div>

            {/* Path connecting Origin to Vault */}
            <div className="flex-1 relative h-6 mx-4 flex items-center origin-left">
                {/* Dashed background path */}
                <div className="absolute w-full h-0 bordert-t-2 border-b-2 border-dashed border-obsidian-700 opacity-50" style={{borderTopWidth: '2px', top: '50%', transform: 'translateY(-50%)'}} />
                
                {/* Foreground animated path */}
                <motion.div 
                    className="absolute h-0.5 bg-gradient-to-r from-slate-500 to-gold-500 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                    style={{top: 'calc(50% - 1px)'}}
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
                />

                {/* Moving Indicator */}
                <motion.div 
                    className="absolute w-6 h-6 rounded-full bg-obsidian-950 border border-gold-400 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)] z-30"
                    style={{top: '50%', marginTop: '-12px'}}
                    initial={{ left: 0, opacity: 0 }}
                    animate={{ left: '100%', opacity: 1 }}
                    transition={{ delay: 0.8, duration: 2, ease: "easeInOut" }}
                >
                    <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                </motion.div>
            </div>

            {/* Vault Point */}
            <div className="relative z-20 flex flex-col items-center">
                <motion.div 
                    className="w-6 h-6 rounded-full bg-gold-900 border-2 border-gold-500 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.6)] z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 2.5, type: "spring", stiffness: 260, damping: 20 }}
                >
                    <div className="w-2 h-2 bg-gold-400 rounded-full" />
                </motion.div>
                <Building2 className="absolute -top-8 w-6 h-6 text-gold-500" />
                
                <motion.div 
                    className="absolute top-8 flex flex-col items-center min-w-max bg-obsidian-950/80 p-2 rounded border border-obsidian-800 glass-card backdrop-blur-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.8 }}
                >
                    <span className="text-xs font-bold text-gold-400 flex items-center gap-1">Secure Vault</span>
                    <span className="text-[10px] font-mono text-slate-300">{custody?.vaultLocation || 'Geneva Freeport'}</span>
                    <span className="text-[10px] font-mono text-green-500 mt-1 uppercase tracking-wider">Status: Sealed</span>
                </motion.div>
            </div>
        </div>
      </div>
    </div>
  );
}
