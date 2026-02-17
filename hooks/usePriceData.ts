'use client';

import useSWR from 'swr';

interface PriceData {
    c: number;   // Current price
    d: number;   // Change
    dp: number;  // Percent change
    h: number;   // High
    l: number;   // Low
    o: number;   // Open
    pc: number;  // Previous close
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function usePriceData(symbol: string | null) {
    const { data, error, isLoading, mutate } = useSWR<PriceData>(
        symbol ? `/api/finnhub/quote?symbol=${symbol}` : null,
        fetcher,
        {
            refreshInterval: 10000, // Refresh every 10 seconds
            revalidateOnFocus: true,
            dedupingInterval: 5000,
        }
    );

    return {
        price: data?.c ?? null,
        change: data?.d ?? null,
        changePercent: data?.dp ?? null,
        high: data?.h ?? null,
        low: data?.l ?? null,
        open: data?.o ?? null,
        previousClose: data?.pc ?? null,
        isLoading,
        isError: !!error,
        refresh: mutate,
    };
}
