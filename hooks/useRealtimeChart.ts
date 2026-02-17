'use client';

import { useState, useEffect } from 'react';
import { wsManager } from '@/lib/websocket/manager';

interface Candle {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface UseRealtimeChartProps {
    symbol: string;
    initialData: Candle[];
    enabled?: boolean;
}

export function useRealtimeChart({
    symbol,
    initialData,
    enabled = true,
}: UseRealtimeChartProps) {
    const [data, setData] = useState<Candle[]>(initialData);

    // Sync with initialData prop changes
    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        if (!enabled || !symbol) return;

        // Handler for new ticker data
        const handleTicker = (ticker: any) => {
            if (ticker.symbol !== symbol) return;

            const price = ticker.price;
            const time = ticker.timestamp; // timestamp in ms

            setData((prev) => {
                const last = prev[prev.length - 1];
                if (!last) return prev;

                // Simple date check (UTC)
                const tradeDate = new Date(time).toISOString().split('T')[0];

                if (last.time === tradeDate) {
                    // Update current candle
                    return [
                        ...prev.slice(0, -1),
                        {
                            ...last,
                            close: price,
                            high: Math.max(last.high, price),
                            low: Math.min(last.low, price),
                            // Update volume (Binance gives 24h vol, but we want candle volume?
                            // Ticker stream gives accumulating 24h volume.
                            // For a simple chart, we might just track the change or ignore vol for live updates to avoid jumps)
                            // Let's just update the close/high/low for the visual chart.
                            volume: last.volume,
                        },
                    ];
                } else {
                    // Start new candle (next day)
                    if (new Date(tradeDate) < new Date(last.time)) return prev;

                    return [
                        ...prev,
                        {
                            time: tradeDate,
                            open: price,
                            high: price,
                            low: price,
                            close: price,
                            volume: 0,
                        },
                    ];
                }
            });
        };

        wsManager.subscribe(symbol, handleTicker);
        return () => wsManager.unsubscribe(symbol, handleTicker);
    }, [symbol, enabled]);

    return { data };
}
