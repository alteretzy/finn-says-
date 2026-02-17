'use client';

import { useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { useWatchlist } from '@/hooks/useWatchlist';
import DataTable from '@/components/data/DataTable';
import FadeIn from '@/components/animations/FadeIn';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/charts/Sparkline';
import { formatPrice, formatPercent, formatMarketCap } from '@/lib/utils/formatters';
import { MarketAsset } from '@/lib/finnhub/types';
import MobileAssetCard from '@/components/data/MobileAssetCard';
import { useMarketStore } from '@/store/marketStore';
import { wsManager } from '@/lib/websocket/manager';

interface WatchlistClientProps {
    initialData: MarketAsset[];
}

type SortKey = 'symbol' | 'price' | 'changePercent' | 'marketCap';
type SortDirection = 'asc' | 'desc';

export default function WatchlistClient({ initialData }: WatchlistClientProps) {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const { prices, changes, setPreviousClose, updateFromTicker } = useMarketStore();
    const [sortKey, setSortKey] = useState<SortKey>('symbol');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

    // Subscribe to WebSocket updates
    useEffect(() => {
        if (watchlist.length === 0) return;

        watchlist.forEach(item => {
            const initial = initialData.find(d => d.symbol === item.symbol);
            if (initial) {
                const pc = initial.price - initial.change;
                setPreviousClose(item.symbol, pc);
            }
            wsManager.subscribe(item.symbol, updateFromTicker);
        });

        return () => {
            watchlist.forEach(item => {
                wsManager.unsubscribe(item.symbol, updateFromTicker);
            });
        };
    }, [watchlist, initialData, setPreviousClose, updateFromTicker]);

    const watchlistData = useMemo(() => {
        const baseData = initialData
            .filter(asset => watchlist.some(w => w.symbol === asset.symbol))
            .map(asset => {
                const currentPrice = prices[asset.symbol] || asset.price;
                const currentChangePercent = changes[asset.symbol] || asset.changePercent;
                return {
                    ...asset,
                    price: currentPrice,
                    changePercent: currentChangePercent
                };
            });

        return baseData.sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (aVal === undefined || bVal === undefined) return 0;
            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [initialData, watchlist, prices, changes, sortKey, sortDirection]);

    const handleSort = (key: string) => {
        if (key === sortKey) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key as SortKey);
            setSortDirection('asc');
        }
    };

    const columns = [
        {
            key: 'symbol',
            label: 'Asset',
            render: (value: any, row: MarketAsset) => (
                <Link href={`/asset/${row.symbol}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xs font-light text-white/50">
                        {(value as string).charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-light text-white/80 group-hover:text-white transition-colors">
                            {value as string}
                        </p>
                        <p className="text-xs text-white/50 font-light">{row.name}</p>
                    </div>
                </Link>
            ),
        },
        {
            key: 'price',
            label: 'Price',
            align: 'right' as const,
            render: (value: any) => (
                <span className="font-light tabular-nums text-white/80">${formatPrice(value as number)}</span>
            ),
        },
        {
            key: 'changePercent',
            label: '24h Change',
            align: 'right' as const,
            render: (value: any) => (
                <Badge variant={(value as number) >= 0 ? 'success' : 'error'}>
                    {formatPercent(value as number)}
                </Badge>
            ),
        },
        {
            key: 'marketCap',
            label: 'Market Cap',
            align: 'right' as const,
            render: (value: any) => (
                <span className="text-white/40 tabular-nums font-light">{formatMarketCap(value as number)}</span>
            ),
        },
        {
            key: 'sparklineData',
            label: '7D',
            align: 'right' as const,
            width: '120px',
            render: (value: any, row: MarketAsset) => (
                <div className="w-[100px] ml-auto">
                    <Sparkline data={value as number[]} height={28} color={row.changePercent >= 0 ? '#10B981' : '#EF4444'} />
                </div>
            ),
        },
        {
            key: 'actions',
            label: '',
            align: 'right' as const,
            width: '60px',
            render: (_: any, row: MarketAsset) => (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(row.symbol);
                    }}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors"
                    title="Remove from watchlist"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                </button>
            ),
        },
    ];

    return (
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-28">
            <FadeIn>
                <div className="mb-12">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3 font-light">
                        Personalized
                    </p>
                    <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4">
                        Your Watchlist
                    </h1>
                    <p className="text-sm text-white/50 font-light max-w-xl leading-relaxed">
                        Track your favorite assets in real-time.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                {watchlistData.length > 0 ? (
                    <>
                        <div className="hidden md:block">
                            <DataTable
                                data={watchlistData}
                                columns={columns}
                                onSort={handleSort}
                                sortKey={sortKey}
                                sortDirection={sortDirection}
                                onRowClick={(row) => {
                                    window.location.href = `/asset/${row.symbol}`;
                                }}
                            />
                        </div>
                        <div className="md:hidden space-y-4">
                            {watchlistData.map((asset) => (
                                <MobileAssetCard key={asset.symbol} asset={asset} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 border border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-white/40 mb-4 font-light">Your watchlist is empty.</p>
                        <Link href="/markets" className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                            Browse Markets →
                        </Link>
                    </div>
                )}
            </FadeIn>
        </main>
    );
}
