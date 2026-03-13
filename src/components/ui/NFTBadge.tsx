import React from 'react';
import { ShieldCheck, Wifi } from 'lucide-react';

export default function NFTBadge({ nfcLinked = true }: { nfcLinked?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex bg-charcoal-800/80 backdrop-blur border border-green-500/20 px-3 py-1.5 rounded-full items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
        <ShieldCheck className="w-4 h-4 text-green-400" />
        <span className="text-xs font-medium text-green-300 tracking-wide">
          Verified Physical Asset
        </span>
      </div>
      
      {nfcLinked && (
        <div className="relative group cursor-pointer flex bg-charcoal-800/80 backdrop-blur border border-gold-500/20 px-3 py-1.5 rounded-full items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
          <Wifi className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-medium text-gold-300 tracking-wide">
            NFC-Linked
          </span>
          
          {/* Tooltip */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-charcoal-900 border border-charcoal-700 text-parchment-200 text-xs rounded-sm p-3 w-48 shadow-2xl pointer-events-none z-10 text-center">
            This digital twin is cryptographically bound to an NFC micro-tag embedded in the physical antique.
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-charcoal-700" />
          </div>
        </div>
      )}
    </div>
  );
}
