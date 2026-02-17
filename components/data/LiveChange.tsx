'use client';

import { useMarketStore } from '@/store/marketStore';

interface LiveChangeProps {
    symbol: string;
    initialChange: number;
    className?: string;
    showIcon?: boolean;
}

export default function LiveChange({ symbol, initialChange, className = '', showIcon = true }: LiveChangeProps) {
    const { changes } = useMarketStore();
    const change = changes[symbol] ?? initialChange;
    const isPositive = change >= 0;

    return (
        <span className={`font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'} ${className}`}>
            {showIcon && (change > 0 ? '+' : '')}
            {change.toFixed(2)}%
        </span>
    );
}
