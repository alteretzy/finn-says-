'use client';

import { MarketAsset } from '@/lib/finnhub/types';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils/formatters';
import Link from 'next/link';

interface LiveAssetCardProps {
    asset: MarketAsset;
}

export default function LiveAssetCard({ asset }: LiveAssetCardProps) {
    const { symbol, price, changePercent, name } = asset;
    const isPositive = changePercent >= 0;

    return (
        <Link href={`/asset/${symbol}`}>
            <motion.div
                whileHover={{ y: -2 }}
                className="relative overflow-hidden rounded-xl bg-[#0A0A12] border border-white/5 p-5 group cursor-pointer transition-all duration-300 hover:border-white/20 hover:bg-white/[0.03]"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: isPositive ? '#10B981' : '#EF4444' }}
                        >
                            {symbol.slice(0, 1)}
                        </div>
                        <div>
                            <div className="text-white font-medium text-sm">{symbol}</div>
                            <div className="text-white/40 text-[10px] truncate max-w-[100px]">{name}</div>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-mono font-medium ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {isPositive ? '+' : ''}{(changePercent || 0).toFixed(2)}%
                    </div>
                </div>

                <div className="flex items-end justify-between mt-4">
                    <div className="text-2xl font-light text-white font-mono tracking-tight">
                        {formatPrice(price || 0)}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}
