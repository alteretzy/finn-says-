'use client';

import { useRealtimePrice } from '@/hooks/useRealtimePrice';
import { motion } from 'framer-motion';

interface TickerItemProps {
    symbol: string;
}

function TickerItem({ symbol }: TickerItemProps) {
    const { data } = useRealtimePrice(symbol, { throttleMs: 2000 }); // Slower update for ticker

    // Fallback if no data yet (show symbol)
    if (!data) return (
        <div className="flex items-center gap-2 px-6 border-r border-white/5 opacity-50">
            <span className="font-bold text-xs">{symbol}</span>
            <span className="text-xs">---</span>
        </div>
    );

    const isPositive = data.changePercent >= 0;
    const colorClass = isPositive ? 'text-emerald-400' : 'text-red-400';

    return (
        <div className="flex items-center gap-3 px-8 border-r border-white/5 min-w-max">
            <span className="font-bold text-xs tracking-wider text-white/80">{symbol.replace('-USD', '')}</span>
            <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">${data.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                <span className={`text-xs font-mono ${colorClass}`}>
                    {isPositive ? '+' : ''}
                    {data.changePercent.toFixed(2)}%
                </span>
            </div>
        </div>
    );
}

export function TickerTape() {
    const symbols = [
        'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD',
        'DOGE-USD', 'XRP-USD', 'ADA-USD', 'AVAX-USD',
        'DOT-USD', 'MATIC-USD', 'LINK-USD', 'LTC-USD'
    ];

    return (
        <div className="w-full bg-[#050510] border-b border-white/5 overflow-hidden h-10 flex items-center relative z-20">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050510] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050510] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex"
                animate={{ x: [0, -1000] }} // Adjust based on width
                transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {/* Duplicate the list to ensure smooth infinite scroll */}
                {[...symbols, ...symbols, ...symbols].map((symbol, index) => (
                    <TickerItem key={`${symbol}-${index}`} symbol={symbol} />
                ))}
            </motion.div>
        </div>
    );
}
