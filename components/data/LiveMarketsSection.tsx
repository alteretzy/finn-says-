import { useState, useEffect } from 'react';
import FadeIn from '@/components/animations/FadeIn';
import LiveAssetCard from './LiveAssetCard';
import { MarketAsset } from '@/lib/finnhub/types';
import { useMarketStore } from '@/store/marketStore';
import { wsManager, TickerData } from '@/lib/websocket/manager';
import { useFetchedMarketData } from '@/hooks/useFetchedMarketData';


type TabType = 'all' | 'crypto' | 'stocks' | 'metals' | 'commodities';

export default function LiveMarketsSection() {
    const { allAssets, loading, error: fetchError } = useFetchedMarketData();
    const assets = allAssets as MarketAsset[];
    const [tab, setTab] = useState<TabType>('all');
    const { prices, changes, updateFromTicker } = useMarketStore();

    // Fallback if fetchHook doesn't provide type, or we map it:
    // The fetch hook already adds 'type'.

    // No manual useEffect fetch needed anymore!

    // Subscribe to assets once loaded
    useEffect(() => {
        if (assets.length === 0) return;

        const handleData = (data: TickerData) => {
            updateFromTicker(data);
        };

        assets.forEach(asset => {
            // Only subscribe if it's likely supported (e.g. crypto) or if we have a mapping
            // For now, let's try subscribing to all, the manager handles filtering/mapping
            wsManager.subscribe(asset.symbol, handleData);
        });

        return () => {
            assets.forEach(asset => {
                wsManager.unsubscribe(asset.symbol, handleData);
            });
        };
    }, [assets, updateFromTicker]);

    const tabs: { key: TabType; label: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'crypto', label: 'Crypto' },
        { key: 'stocks', label: 'Stocks' },
        { key: 'metals', label: 'Metals' },
        { key: 'commodities', label: 'Commodities' },
    ];

    const filtered = assets.filter((a) => {
        if (tab === 'all') return true;
        if (tab === 'crypto') return a.type === 'crypto';
        if (tab === 'stocks') return a.type === 'stock';
        if (tab === 'metals') return a.type === 'metal';
        if (tab === 'commodities') return a.type === 'commodity';
        return true;
    });

    // Show top 12 for the landing page
    const displayed = filtered.slice(0, 12);

    return (
        <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.2em] font-medium block mb-2 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]/50" />
                        Live Data
                    </span>
                    <h2 className="text-3xl md:text-4xl font-light text-white">Markets Overview</h2>
                    <p className="text-sm text-white/50 mt-2">
                        {assets.length} assets tracked across stocks, crypto, metals & commodities
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Real-time
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-2 text-xs uppercase tracking-widest rounded-full border transition-all duration-300 whitespace-nowrap ${tab === t.key
                            ? 'bg-[#0055FF]/20 border-[#0055FF]/40 text-[#0055FF]'
                            : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white/60 hover:border-white/10'
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-[160px] rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))}
                </div>
            ) : fetchError ? (
                <div className="text-center py-16">
                    <p className="text-white/50 text-sm">Unable to load market data. Please try again later.</p>
                </div>
            ) : displayed.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-white/50 text-sm">No assets available for this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                    {displayed.map((asset, i) => {
                        const getDisplayData = (asset: MarketAsset) => {
                            const price = prices[asset.symbol] || asset.price;
                            const change = changes[asset.symbol] || asset.changePercent;
                            return { price, change };
                        };
                        const { price, change } = getDisplayData(asset);
                        return (
                            <FadeIn key={asset.symbol} delay={i * 0.03}>
                                <LiveAssetCard
                                    asset={{ ...asset, price, changePercent: change }}
                                />
                            </FadeIn>
                        );
                    })}
                </div>
            )}

            {/* View All link */}
            <div className="mt-8 text-center">
                <a
                    href="/markets"
                    className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors"
                >
                    View All {assets.length} Assets →
                </a>
            </div>
        </section>
    );
}
