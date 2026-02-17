import { useState, useEffect, useRef } from 'react';

const STORAGE_KEY_PREFIX = 'finnsays_chart_history_';

export function useChartHistory(symbol: string, initialData: any[]) {
    const [history, setHistory] = useState<any[]>(initialData);
    const isHydrated = useRef(false);

    // Hydrate from storage on mount
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const stored = localStorage.getItem(STORAGE_KEY_PREFIX + symbol);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Simple validation: ensure it's an array and newer than initialData
                if (Array.isArray(parsed) && parsed.length > initialData.length) {
                    setHistory(parsed);
                }
            }
        } catch (e) {
            console.error('Failed to load chart history', e);
        } finally {
            isHydrated.current = true;
        }
    }, [symbol, initialData]);

    // Save to storage whenever history updates
    useEffect(() => {
        if (!isHydrated.current) return;
        if (history.length === 0) return;

        try {
            // Limit storage to last 1000 candles to prevent quota issues
            const toStore = history.slice(-1000);
            localStorage.setItem(STORAGE_KEY_PREFIX + symbol, JSON.stringify(toStore));
        } catch (e) {
            console.warn('Failed to save chart history', e);
        }
    }, [history, symbol]);

    return [history, setHistory] as const;
}
