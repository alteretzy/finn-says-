'use client';

import { useEffect, useState, useRef } from 'react';
import { useMarketStore } from '@/store/marketStore';
import { formatPrice } from '@/lib/utils/formatters';

interface LivePriceProps {
    symbol: string;
    initialPrice: number;
    className?: string;
}

export default function LivePrice({ symbol, initialPrice, className = '' }: LivePriceProps) {
    const { prices } = useMarketStore();
    const price = prices[symbol] || initialPrice;
    const prevPriceRef = useRef(initialPrice);
    const [flash, setFlash] = useState<'up' | 'down' | null>(null);

    useEffect(() => {
        if (price && price !== prevPriceRef.current) {
            const direction = price > prevPriceRef.current ? 'up' : 'down';
            setTimeout(() => setFlash(direction), 0);
            prevPriceRef.current = price;
            const timer = setTimeout(() => setFlash(null), 1000);
            return () => clearTimeout(timer);
        }
    }, [price]);

    return (
        <span
            className={`font-light tabular-nums transition-colors duration-300 ${flash === 'up' ? 'text-emerald-400' : flash === 'down' ? 'text-red-400' : 'text-white/80'
                } ${className}`}
        >
            {formatPrice(price)}
        </span>
    );
}
