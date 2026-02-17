import { useState, useEffect } from 'react';
import { wsManager } from '@/lib/websocket/manager';
import { useMarketStore } from '@/store/marketStore';

export function useRealtimePrice(symbol: string, options?: { enabled?: boolean; throttleMs?: number }) {
    const { prices, lastUpdated, changes, volumes } = useMarketStore();
    const [isConnected, setIsConnected] = useState(() => wsManager.getState() === 'connected');

    useEffect(() => {
        if (!symbol || options?.enabled === false) return;

        // Subscribe to symbol updates (handled via store)
        wsManager.subscribe(symbol, () => { });

        // Listen for connection state
        const unsubState = wsManager.onStateChange((state) => {
            setIsConnected(state === 'connected');
        });

        return () => {
            wsManager.unsubscribe(symbol, () => { });
            unsubState();
        };
    }, [symbol, options?.enabled]);

    const price = prices[symbol];
    const timestamp = lastUpdated[symbol];
    const changePercent = changes[symbol];
    const volume = volumes[symbol];

    return {
        data: price && timestamp ? {
            price,
            timestamp,
            changePercent: changePercent || 0,
            volume: volume || 0
        } : null,
        isConnected,
        isLoading: !isConnected,
        error: null
    };
}
