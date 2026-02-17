
'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface TickerItem {
    symbol: string;
    price: number;
    changePercent: number;
}

export default function InfiniteTicker() {
    const [items, setItems] = useState<TickerItem[]>([]);

    useEffect(() => {
        async function fetchTicker() {
            try {
                const res = await fetch('/api/ticker');
                if (res.ok) {
                    const data = await res.json();
                    setItems(data);
                }
            } catch (e) {
                console.error("Ticker fetch error", e);
            }
        }
        fetchTicker();
    }, []);

    // Duplicate items so the loop is seamless. If empty, show placeholders.
    const displayItems = items.length > 0 ? items : [
        { symbol: 'BTC', price: 0, changePercent: 0 },
        { symbol: 'ETH', price: 0, changePercent: 0 },
        { symbol: 'SOL', price: 0, changePercent: 0 },
        { symbol: 'AAPL', price: 0, changePercent: 0 },
    ];
    const doubled = [...displayItems, ...displayItems];

    return (
        <div className="group/ticker relative w-full overflow-hidden border-y border-white/5 py-5 bg-black/50 backdrop-blur-sm z-40">
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex gap-12 whitespace-nowrap group-hover/ticker:[animation-play-state:paused]"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: 30,
                        ease: 'linear',
                    },
                }}
            >
                {doubled.map((item, i) => (
                    <span
                        key={`${item.symbol}-${i}`}
                        className="text-sm font-light text-white/60 uppercase tracking-widest flex items-center gap-3 select-none cursor-default transition-all duration-300 hover:text-white hover:[text-shadow:0_0_12px_rgba(255,255,255,0.5)] group/item"
                    >
                        <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 group-hover/item:shadow-[0_0_8px_rgba(0,85,255,0.6)] ${item.changePercent >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <span className="font-medium text-white">{item.symbol}</span>
                        <span className="opacity-70">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <span className={`text-xs ${item.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {item.changePercent > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
