import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export function PriceHistorySparkline({ data }: { data: { date: string, price: number }[] }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="h-20 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '4px' }}
            itemStyle={{ color: '#D4AF37' }}
          />
          <YAxis domain={['auto', 'auto']} hide />
          <Area 
            type="monotone" 
            dataKey="price" 
            stroke="#D4AF37" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPrice)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
