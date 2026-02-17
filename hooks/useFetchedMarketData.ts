
import { useState, useEffect } from 'react';

export interface MarketItem {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    name?: string;
    image?: string;
    unit?: string;
    type?: 'stock' | 'crypto' | 'metal' | 'commodity';
}

export function useFetchedMarketData() {
    const [stocks, setStocks] = useState<MarketItem[]>([]);
    const [crypto, setCrypto] = useState<MarketItem[]>([]);
    const [metals, setMetals] = useState<MarketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAll() {
            try {
                setLoading(true);
                // We use Promise.allSettled so one failure doesn't block the others
                const [stocksRes, cryptoRes, metalsRes] = await Promise.allSettled([
                    fetch('/api/stocks').then(r => { if (!r.ok) throw new Error('Stocks failed'); return r.json(); }),
                    fetch('/api/crypto').then(r => { if (!r.ok) throw new Error('Crypto failed'); return r.json(); }),
                    fetch('/api/metals').then(r => { if (!r.ok) throw new Error('Metals failed'); return r.json(); }),
                ]);

                if (stocksRes.status === 'fulfilled') {
                    const s = Array.isArray(stocksRes.value) ? stocksRes.value.map((i: MarketItem) => ({ ...i, type: 'stock' as const })) : [];
                    setStocks(s);
                } else {
                    console.error('Stocks fetch failed:', stocksRes.reason);
                }

                if (cryptoRes.status === 'fulfilled') {
                    const c = Array.isArray(cryptoRes.value) ? cryptoRes.value.map((i: MarketItem) => ({ ...i, type: 'crypto' as const })) : [];
                    setCrypto(c);
                }

                if (metalsRes.status === 'fulfilled') {
                    const m = Array.isArray(metalsRes.value) ? metalsRes.value.map((i: MarketItem) => ({ ...i, type: 'metal' as const })) : [];
                    setMetals(m);
                }

            } catch (err) {
                console.error('Market data fetch error:', err);
                setError(err instanceof Error ? err.message : 'Failed to load market data');
            } finally {
                setLoading(false);
            }
        }

        fetchAll();

        // Refresh every 60 seconds
        const interval = setInterval(fetchAll, 60000);
        return () => clearInterval(interval);
    }, []);

    const totalAssets = stocks.length + crypto.length + metals.length;
    const allAssets = [...stocks, ...crypto, ...metals];

    return { stocks, crypto, metals, allAssets, loading, error, totalAssets };
}
