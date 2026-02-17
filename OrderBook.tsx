'use client';

import React, { useEffect, useState } from 'react';

interface OrderBookProps {
    symbol: string;
    currentPrice: number;
}

interface Order {
    price: number;
    amount: number;
    total: number;
    depth: number; // 0-100% for visual bar
}

const ROWS = 12;

export default function OrderBook({ symbol, currentPrice }: OrderBookProps) {
    const [bids, setBids] = useState<Order[]>([]);
    const [asks, setAsks] = useState<Order[]>([]);

    // Simulate initial order book data based on current price
    useEffect(() => {
        if (!currentPrice) return;

        const generateBook = () => {
            const newBids: Order[] = [];
            const newAsks: Order[] = [];

            // Random spread between 0.01% and 0.05%
            const spread = currentPrice * (0.0001 + Math.random() * 0.0004);

            let bidPrice = currentPrice - spread / 2;
            let askPrice = currentPrice + spread / 2;

            let bidTotal = 0;
            let askTotal = 0;

            // Generate Bids (Buy Orders)
            for (let i = 0; i < ROWS; i++) {
                // Decrement price by small random steps
                const step = currentPrice * (0.0002 + Math.random() * 0.0005);
                bidPrice -= step;

                const amount = Math.random() * 5 + (Math.random() * 20 * (1 - i / ROWS)); // More volume near spread
                bidTotal += amount;

                newBids.push({
                    price: bidPrice,
                    amount: amount,
                    total: bidTotal,
                    depth: 0 // Calculated after total is known
                });
            }

            // Generate Asks (Sell Orders)
            for (let i = 0; i < ROWS; i++) {
                const step = currentPrice * (0.0002 + Math.random() * 0.0005);
                askPrice += step;

                const amount = Math.random() * 5 + (Math.random() * 20 * (1 - i / ROWS));
                askTotal += amount;

                newAsks.push({
                    price: askPrice,
                    amount: amount,
                    total: askTotal,
                    depth: 0
                });
            }

            // Normalize depth bars relative to max total volume in view
            const maxVol = Math.max(bidTotal, askTotal);
            newBids.forEach(b => b.depth = (b.total / maxVol) * 100);
            newAsks.forEach(a => a.depth = (a.total / maxVol) * 100);

            setBids(newBids);
            setAsks(newAsks);
        };

        generateBook();

        // Simulate high-frequency updates
        const interval = setInterval(generateBook, 1500);
        return () => clearInterval(interval);
    }, [currentPrice, symbol]);

    const spreadValue = asks.length > 0 && bids.length > 0 ? asks[0].price - bids[0].price : 0;
    const spreadPercent = currentPrice > 0 ? (spreadValue / currentPrice) * 100 : 0;

    return (
        <div className="bg-[#0A0A15]/60 border border-white/[0.06] rounded-xl overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="flex bg-white/[0.02] border-b border-white/[0.04] p-3 text-white/40 uppercase tracking-wider text-[10px]">
                <div className="flex-1">Price (USD)</div>
                <div className="flex-1 text-right">Amount</div>
                <div className="flex-1 text-right">Total</div>
            </div>

            {/* Asks (Sells) - Red - Reverse order to show lowest ask at bottom */}
            <div className="flex flex-col-reverse">
                {asks.map((ask, i) => (
                    <Row key={`ask-${i}`} order={ask} type="ask" />
                ))}
            </div>

            {/* Spread Indicator */}
            <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] border-y border-white/[0.04] text-white/70 font-medium">
                <span className={spreadPercent > 0.05 ? 'text-amber-400' : 'text-emerald-400'}>
                    {spreadValue.toFixed(2)} ({spreadPercent.toFixed(3)}%)
                </span>
                <span className="text-[10px] text-white/50 uppercase tracking-widest">Spread</span>
            </div>

            {/* Bids (Buys) - Green */}
            <div>
                {bids.map((bid, i) => (
                    <Row key={`bid-${i}`} order={bid} type="bid" />
                ))}
            </div>
        </div>
    );
}

// Memoized Row for performance
const Row = React.memo(({ order, type }: { order: Order; type: 'bid' | 'ask' }) => {
    const isBid = type === 'bid';
    const bg = isBid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)';

    return (
        <div className="relative flex items-center p-1.5 hover:bg-white/[0.04] transition-colors group">
            {/* Depth Bar */}
            <div
                className="absolute top-0 bottom-0 right-0 transition-all duration-500 ease-out"
                style={{
                    width: `${order.depth}%`,
                    backgroundColor: bg,
                    opacity: 0.5
                }}
            />

            <div className={`flex-1 relative z-10 ${isBid ? 'text-emerald-400' : 'text-red-400'}`}>
                {order.price.toFixed(2)}
            </div>
            <div className="flex-1 text-right relative z-10 text-white/70">
                {order.amount.toFixed(4)}
            </div>
            <div className="flex-1 text-right relative z-10 text-white/40">
                {order.total.toFixed(2)}
            </div>
        </div>
    );
});

Row.displayName = 'OrderBookRow';
