import React from 'react';
import { Check, CheckCircle2, CircleDashed } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface HistoryEvent {
  year: string;
  event: string;
  description: string;
  hash: string;
}

export function ProvenanceStepper({ events }: { events: HistoryEvent[] }) {
  return (
    <div className="flex flex-col gap-6 ml-4 my-8 relative">
      <div className="absolute top-4 bottom-8 left-[11px] w-[2px] bg-charcoal-700/50" />
      
      {events.map((event, index) => {
        const isLastItem = index === events.length - 1;

        return (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            key={index} 
            className="flex gap-8 relative"
          >
            <div className="relative z-10 w-6 h-6 shrink-0 mt-1">
              <div className={cn(
                "w-full h-full rounded-full flex items-center justify-center border-2",
                "bg-charcoal-900 border-gold-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
              )}>
                <div className="w-2 h-2 rounded-full bg-gold-400" />
              </div>
            </div>
            
            <div className="flex-1 pb-8">
              <div className="flex items-center justify-between mb-1">
                <span className="font-serif text-gold-400 text-lg">{event.year}</span>
                <span className="text-xs font-mono text-charcoal-500 px-2 py-1 bg-charcoal-900/50 rounded-sm border border-charcoal-800" title="Blockchain Hash">
                  {event.hash}
                </span>
              </div>
              <h4 className="text-parchment-50 font-medium mb-2 text-lg">{event.event}</h4>
              <p className="text-parchment-300 text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
