'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useMarketStore } from '@/store/marketStore';
import { MarketAsset } from '@/lib/finnhub/types';
import { wsManager, TickerData } from '@/lib/websocket/manager';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/components/providers/AuthProvider';
import { useSavedScreens } from '@/hooks/useSavedScreens';
import { formatPrice, formatVolume, formatMarketCap } from '@/lib/utils/formatters';
import ScreenerCard from './ScreenerCard';

interface ScreenerTableProps {
    initialAssets: MarketAsset[];
}

type SortField = 'name' | 'price' | 'change' | 'volume' | 'marketCap';
type SortOrder = 'asc' | 'desc';

export default function ScreenerTable({ initialAssets }: ScreenerTableProps) {
    const { prices, changes, updateFromTicker } = useMarketStore();
    const { user } = useAuth();
    const { screens, saveScreen } = useSavedScreens();

    // State
    const [sortField, setSortField] = useState<SortField>('marketCap');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
    const [filter, setFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState<'all' | 'stock' | 'crypto'>('all');
    const [isSaving, setIsSaving] = useState(false);

    // Handlers
    const handleSave = async () => {
        const name = prompt('Enter a name for this view:');
        if (name) {
            setIsSaving(true);
            await saveScreen(name, {
                filter,
                typeFilter,
                sortField,
                sortOrder
            });
            setIsSaving(false);
        }
    };

    const handleLoad = (screenId: string) => {
        const screen = screens.find(s => s.id === screenId);
        if (screen) {
            setFilter(screen.config.filter);
            setTypeFilter(screen.config.typeFilter);
            setSortField(screen.config.sortField as SortField);
            setSortOrder(screen.config.sortOrder);
        }
    };

    // Merge store data with initial data
    const liveAssets = useMemo(() => {
        return initialAssets.map(asset => {
            const livePrice = prices[asset.symbol];
            const liveChange = changes[asset.symbol];

            if (!livePrice) return asset;

            return {
                ...asset,
                price: livePrice,
                changePercent: liveChange ?? asset.changePercent,
                // We'll leave 'change' (absolute) as is or calculate if needed, but UI uses percent mostly
                change: liveChange ? (livePrice * liveChange / 100) : asset.change
            };
        });
    }, [initialAssets, prices, changes]);

    // Effect to subscribe to all screen items (or at least visible ones)
    useEffect(() => {
        const handleData = (data: TickerData) => updateFromTicker(data);

        // Subscribe to initial list
        initialAssets.forEach(a => {
            // Only subscribe if it's a crypto asset (supported by our Binance WS)
            if (a.type === 'crypto') {
                wsManager.subscribe(a.symbol, handleData);
            }
        });

        // Cleanup
        return () => {
            initialAssets.forEach(a => {
                if (a.type === 'crypto') {
                    wsManager.unsubscribe(a.symbol, handleData);
                }
            });
        };
    }, [initialAssets, updateFromTicker]);

    const sortedAndFiltered = useMemo(() => {
        let result = liveAssets;

        if (filter) {
            const q = filter.toLowerCase();
            result = result.filter(a =>
                a.symbol.toLowerCase().includes(q) ||
                a.name.toLowerCase().includes(q)
            );
        }

        if (typeFilter !== 'all') {
            result = result.filter(a => a.type === typeFilter);
        }

        return result.sort((a, b) => {
            let valA: number | string = '';
            let valB: number | string = '';

            switch (sortField) {
                case 'name': valA = a.name; valB = b.name; break;
                case 'price': valA = a.price; valB = b.price; break;
                case 'change': valA = a.changePercent; valB = b.changePercent; break;
                case 'volume': valA = a.volume; valB = b.volume; break;
                case 'marketCap': valA = a.marketCap; valB = b.marketCap; break;
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [liveAssets, filter, typeFilter, sortField, sortOrder]);

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) return <span className="text-white/10 ml-1">↕</span>;
        return <span className="text-[#0055FF] ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>;
    };

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTypeFilter('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${typeFilter === 'all' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setTypeFilter('stock')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${typeFilter === 'stock' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                    >
                        Stocks
                    </button>
                    <button
                        onClick={() => setTypeFilter('crypto')}
                        className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors ${typeFilter === 'crypto' ? 'bg-white/10 border-white/20 text-white' : 'bg-transparent border-white/5 text-white/40 hover:text-white'}`}
                    >
                        Crypto
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Filter by symbol or name..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#050510] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#0055FF]/50 transition-colors w-full md:w-64"
                />

                {/* Saved Screens Controls */}
                {user && (
                    <div className="flex items-center gap-2">
                        {screens.length > 0 && (
                            <select
                                onChange={(e) => handleLoad(e.target.value)}
                                className="bg-[#050510] border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 focus:outline-none hover:border-white/30 transition-colors"
                            >
                                <option value="">Load View...</option>
                                {screens.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        )}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSave}
                            disabled={isSaving}
                            className="whitespace-nowrap"
                        >
                            {isSaving ? 'Saving...' : 'Save View'}
                        </Button>
                    </div>
                )}
            </div>

            {/* Table (Desktop) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-white/5 bg-white/[0.02]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 text-xs text-white/40 uppercase tracking-wider">
                            <th className="p-4 font-medium cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                                Asset {renderSortIcon('name')}
                            </th>
                            <th className="p-4 font-medium text-right cursor-pointer hover:text-white" onClick={() => handleSort('price')}>
                                Price {renderSortIcon('price')}
                            </th>
                            <th className="p-4 font-medium text-right cursor-pointer hover:text-white" onClick={() => handleSort('change')}>
                                Change {renderSortIcon('change')}
                            </th>
                            <th className="p-4 font-medium text-right cursor-pointer hover:text-white hidden md:table-cell" onClick={() => handleSort('volume')}>
                                Volume {renderSortIcon('volume')}
                            </th>
                            <th className="p-4 font-medium text-right cursor-pointer hover:text-white hidden lg:table-cell" onClick={() => handleSort('marketCap')}>
                                Mkt Cap {renderSortIcon('marketCap')}
                            </th>
                            <th className="p-4 font-medium text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {sortedAndFiltered.map((asset) => (
                            <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-4">
                                    <Link href={`/asset/${asset.symbol}`} className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-semibold text-white/60 group-hover:bg-[#0055FF]/20 group-hover:text-[#0055FF] transition-colors">
                                            {asset.symbol.slice(0, 1)}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm group-hover:text-[#0055FF] transition-colors">{asset.symbol}</div>
                                            <div className="text-white/40 text-[10px] hidden sm:block">{asset.name}</div>
                                        </div>
                                    </Link>
                                </td>
                                <td className="p-4 text-right font-mono text-sm text-white/90">
                                    ${formatPrice(asset.price)}
                                </td>
                                <td className="p-4 text-right">
                                    <Badge variant={asset.changePercent >= 0 ? 'success' : 'error'} size="sm">
                                        {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                                    </Badge>
                                </td>
                                <td className="p-4 text-right font-mono text-xs text-white/60 hidden md:table-cell">
                                    {formatVolume(asset.volume)}
                                </td>
                                <td className="p-4 text-right font-mono text-xs text-white/60 hidden lg:table-cell">
                                    {formatMarketCap(asset.marketCap)}
                                </td>
                                <td className="p-4 text-right">
                                    {/* Simulated Sparkline */}
                                    <div className="h-6 w-24 ml-auto flex items-end gap-[1px] opacity-50">
                                        {[...Array(12)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-full rounded-sm ${asset.changePercent >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}
                                                style={{ height: `${20 + Math.random() * 80}%`, opacity: 0.3 + (i / 12) * 0.7 }}
                                            />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards (Mobile) */}
            <div className="md:hidden space-y-3">
                {sortedAndFiltered.map((asset) => (
                    <ScreenerCard key={asset.symbol} asset={asset} />
                ))}
            </div>

            {sortedAndFiltered.length === 0 && (
                <div className="p-12 text-center text-white/50 text-sm border border-white/5 rounded-xl bg-white/[0.02]">
                    No results found matching your filters.
                </div>
            )}
        </div>
    );
}
