'use client';

import { useRealtimePrice } from '@/hooks/useRealtimePrice';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils/formatters';

interface RealtimePriceProps {
    symbol: string;
    showVolume?: boolean;
    className?: string;
}

export function RealtimePrice({
    symbol,
    showVolume = false,
    className = '',
}: RealtimePriceProps) {
    const { data, isConnected, error, isLoading } = useRealtimePrice(symbol);

    // Error state
    if (error) {
        return (
            <div className="text-red-400 text-xs animate-pulse">
                Offline
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-white/50">
                <span className="text-sm">Connecting...</span>
            </div>
        );
    }

    if (!data) return null;

    const isPositive = data.changePercent >= 0;
    const colorClass = isPositive ? 'text-emerald-400' : 'text-red-400';
    const bgClass = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center justify-between mb-1">
                {/* Live connection indicator */}
                {isConnected && (
                    <div className="flex items-center gap-1.5 mb-1 order-last">
                        <motion.div
                            className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                )}
            </div>

            <div className="flex items-baseline gap-3">
                {/* Price with scale animation on change */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={data.price}
                        initial={{ scale: 1.05, color: '#ffffff' }}
                        animate={{ scale: 1, color: isPositive ? '#34d399' : '#f87171' }}
                        transition={{ duration: 0.3 }}
                        className="text-2xl md:text-3xl font-light font-mono text-white tracking-tight"
                    >
                        ${formatPrice(data.price)}
                    </motion.div>
                </AnimatePresence>

                {/* Change percentage indicator */}
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono font-medium ${bgClass} ${colorClass}`}>
                    {isPositive ? (
                        <span>▲</span>
                    ) : (
                        <span>▼</span>
                    )}
                    <span>
                        {isPositive ? '+' : ''}
                        {data.changePercent.toFixed(2)}%
                    </span>
                </div>
            </div>

            {/* Optional volume display */}
            {showVolume && (
                <div className="text-xs text-white/40 mt-1 font-mono">
                    Vol: {(data.volume / 1000000).toFixed(2)}M
                </div>
            )}
        </div>
    );
}
