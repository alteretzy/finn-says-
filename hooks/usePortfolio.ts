'use client';

import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'finnsays-portfolio';

export interface PortfolioItem {
    symbol: string;
    quantity: number;
    avgBuyPrice: number;
}

export function usePortfolio() {
    const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setPortfolio(JSON.parse(stored));
            }
        } catch {
            // Ignore parse errors
        }
    }, []);

    const persist = useCallback((items: PortfolioItem[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignore storage errors
        }
    }, []);

    const addHolding = useCallback((symbol: string, quantity: number, price: number) => {
        setPortfolio((prev) => {
            const existingIndex = prev.findIndex((item) => item.symbol === symbol);
            let next: PortfolioItem[];

            if (existingIndex >= 0) {
                const existing = prev[existingIndex];
                const totalCost = existing.quantity * existing.avgBuyPrice + quantity * price;
                const totalQty = existing.quantity + quantity;
                const newAvg = totalCost / totalQty;

                next = [...prev];
                next[existingIndex] = {
                    symbol,
                    quantity: totalQty,
                    avgBuyPrice: newAvg,
                };
            } else {
                next = [...prev, { symbol, quantity, avgBuyPrice: price }];
            }

            persist(next);
            return next;
        });
    }, [persist]);

    const removeHolding = useCallback((symbol: string) => {
        setPortfolio((prev) => {
            const next = prev.filter((item) => item.symbol !== symbol);
            persist(next);
            return next;
        });
    }, [persist]);

    const updateHolding = useCallback((symbol: string, quantity: number, avgBuyPrice: number) => {
        setPortfolio((prev) => {
            const next = prev.map(item =>
                item.symbol === symbol
                    ? { ...item, quantity, avgBuyPrice }
                    : item
            );
            persist(next);
            return next;
        });
    }, [persist]);

    const getHolding = useCallback((symbol: string) => {
        return portfolio.find(p => p.symbol === symbol);
    }, [portfolio]);

    return {
        portfolio,
        addHolding,
        removeHolding,
        updateHolding,
        getHolding
    };
}
