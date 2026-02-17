import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'finnsays-watchlist';

export interface WatchlistItem {
    symbol: string;
    addedAt: number;
}

export function useWatchlist() {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const { user } = useAuth();

    // Load from localStorage or DB on mount/user change
    useEffect(() => {
        if (!user) {
            // Guest mode: Load from localStorage
            Promise.resolve().then(() => {
                try {
                    const stored = localStorage.getItem(STORAGE_KEY);
                    if (stored) {
                        setWatchlist(JSON.parse(stored));
                    }
                } catch { /* ignore */ }
            });
        } else if (supabase) {
            // Auth mode: Load from Supabase
            const loadFromDB = async () => {
                if (!supabase) return;
                const { data, error } = await supabase
                    .from('watchlists')
                    .select('symbol, added_at')
                    .eq('user_id', user.id);

                if (data && !error) {
                    const items = data.map(d => ({
                        symbol: d.symbol,
                        addedAt: new Date(d.added_at).getTime()
                    }));
                    setWatchlist(items);

                    // Merge local items if any exist (on first login)
                    const local = localStorage.getItem(STORAGE_KEY);
                    if (local) {
                        const localItems = JSON.parse(local) as WatchlistItem[];
                        if (localItems.length > 0) {
                            // Sync local storage items to Supabase
                            for (const item of localItems) {
                                if (!items.some(i => i.symbol === item.symbol) && supabase) {
                                    await supabase.from('watchlists').upsert({
                                        user_id: user.id,
                                        symbol: item.symbol,
                                        added_at: new Date(item.addedAt).toISOString()
                                    });
                                }
                            }
                            localStorage.removeItem(STORAGE_KEY); // Clear local after merge
                        }
                    }
                }
            };
            loadFromDB();
        }
    }, [user]);



    const addToWatchlist = useCallback(async (symbol: string) => {
        if (!user) {
            // Guest mode
            setWatchlist((prev) => {
                if (prev.some((item) => item.symbol === symbol)) return prev;
                const next = [...prev, { symbol, addedAt: Date.now() }];
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
                return next;
            });
        } else if (supabase) {
            // Auth mode
            const now = new Date();
            const { error } = await supabase.from('watchlists').upsert({
                user_id: user.id,
                symbol,
                added_at: now.toISOString()
            });
            if (!error) {
                setWatchlist(prev => [...prev.filter(i => i.symbol !== symbol), { symbol, addedAt: now.getTime() }]);
            }
        }
    }, [user]);

    const removeFromWatchlist = useCallback(async (symbol: string) => {
        if (!user) {
            setWatchlist((prev) => {
                const next = prev.filter((item) => item.symbol !== symbol);
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { }
                return next;
            });
        } else if (supabase) {
            const { error } = await supabase.from('watchlists').delete().match({ user_id: user.id, symbol });
            if (!error) {
                setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
            }
        }
    }, [user]);

    const toggleWatchlist = useCallback((symbol: string) => {
        const exists = watchlist.some((item) => item.symbol === symbol);
        if (exists) {
            removeFromWatchlist(symbol);
        } else {
            addToWatchlist(symbol);
        }
    }, [watchlist, addToWatchlist, removeFromWatchlist]);

    const isInWatchlist = useCallback(
        (symbol: string) => watchlist.some((item) => item.symbol === symbol),
        [watchlist]
    );

    return {
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
    };
}
