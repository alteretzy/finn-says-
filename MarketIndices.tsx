'use client';

import { useEffect } from 'react';
import { wsManager, TickerData } from '@/lib/websocket/manager';
import { useMarketStore } from '@/store/marketStore';
import LivePrice from './LivePrice';
import LiveChange from './LiveChange';

const INDICES = [
    { symbol: 'BTC-USD', name: 'Bitcoin' },
    { symbol: 'ETH-USD', name: 'Ethereum' },
    { symbol: 'SOL-USD', name: 'Solana' },
    // Replaced stock indices with crypto/supported ones for now as Binance stream only covers crypto without API key
    // Unless we use simulated behavior for indices again in wsManager for stocks?
    // wsManager currently only does Binance.
    // So 'SPY', 'QQQ' etc will not update unless we have a source.
    // For "Real Data" demo, let's show what we can update: Crypto. 
    // Or we keep them static/simulated if user wants. 
    // The user asked for "Real World Data".
    // I will use main crypto assets for now as the "Indices" or "Key Markets"
    { symbol: 'BNB-USD', name: 'Binance Coin' }
];

export default function MarketIndices() {
    const { updateFromTicker } = useMarketStore();

    useEffect(() => {
        const handleData = (data: TickerData) => updateFromTicker(data);
        INDICES.forEach(idx => wsManager.subscribe(idx.symbol, handleData));
        return () => {
            INDICES.forEach(idx => wsManager.unsubscribe(idx.symbol, handleData));
        };
    }, [updateFromTicker]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {INDICES.map((index) => (
                <div key={index.symbol} className="bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col">
                    <span className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">{index.name}</span>
                    <div className="flex items-end justify-between">
                        <LivePrice symbol={index.symbol} initialPrice={0} className="text-lg text-white font-medium" />
                        <LiveChange symbol={index.symbol} initialChange={0} className="text-xs" />
                    </div>
                </div>
            ))}
        </div>
    );
}
