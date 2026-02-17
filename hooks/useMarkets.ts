
'use client';

import { useState, useEffect, useCallback } from 'react';

export type AssetType = 'All' | 'Stocks' | 'Crypto' | 'Metals' | 'Commodities';

export interface Asset {
    symbol: string;
    name: string;
    type: string;
    price: number;
    change24h: number;
    volume: number;
    marketCap: number;
    sparkline?: number[];
    image?: string;
}

export function useMarkets(filter: AssetType = 'All') {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);

            const endpoints =
                filter === 'All'
                    ? ['/api/crypto', '/api/stocks', '/api/metals', '/api/commodities']
                    : filter === 'Crypto' ? ['/api/crypto']
                        : filter === 'Stocks' ? ['/api/stocks']
                            : filter === 'Metals' ? ['/api/metals']
                                : ['/api/commodities'];

            const results = await Promise.allSettled(
                endpoints.map(url => fetch(url).then(r => r.json()))
            );

            const allAssets = results
                .filter((r): r is PromiseFulfilledResult<Asset[]> => r.status === 'fulfilled')
                .flatMap(r => r.value);

            setAssets(allAssets);
            setLastUpdated(new Date());
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Refresh every 60s
        return () => clearInterval(interval);
    }, [fetchData]);

    return { assets, loading, error, lastUpdated, refetch: fetchData };
}
