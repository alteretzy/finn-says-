'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import FadeIn from '@/components/animations/FadeIn';
import { MarketAsset } from '@/lib/finnhub/types';
import { useRealtimeChart } from '@/hooks/useRealtimeChart';
import { useChartHistory } from '@/hooks/useChartHistory';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import ChartErrorBoundary from '@/components/data/ChartErrorBoundary';

// Sub-components
import AssetHeader from '@/components/data/AssetHeader';
import AssetOverview from '@/components/data/AssetOverview';
import AssetTechnical from '@/components/data/AssetTechnical';
import AssetNews from '@/components/data/AssetNews';

interface AssetClientProps {
    symbol: string;
    asset: MarketAsset | null;
    candleData: {
        time: string;
        open: number;
        high: number;
        low: number;
        close: number;
        volume: number;
    }[];
}

type TabType = 'overview' | 'news' | 'technical';

export default function AssetClient({ symbol, asset, candleData: initialCandleData }: AssetClientProps) {
    // 1. Hydrate history from localStorage first
    const [persistedData] = useChartHistory(symbol, initialCandleData);

    // 2. Feed persisted data into realtime chart hook
    const { data: candleData } = useRealtimeChart({
        symbol,
        initialData: persistedData, // Use persisted data as base
        enabled: !!asset
    });

    const STORAGE_KEY = `finnsays_chart_history_${symbol}`;

    // Save to local storage on every update (throttled by react render cycle)
    if (typeof window !== 'undefined' && candleData.length > initialCandleData.length) {
        try {
            const toStore = candleData.slice(-1000);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
        } catch (e) { console.error(e); }
    }

    const [activeTab, setActiveTab] = useState<TabType>('overview');

    if (!asset) {
        return (
            <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                    ?
                </div>
                <h1 className="text-3xl font-light mb-4">Asset Not Found</h1>
                <p className="text-white/50 mb-8">
                    Could not find data for symbol &quot;{symbol}&quot;.
                </p>
                <Link href="/markets">
                    <Button>Back to Markets</Button>
                </Link>
            </main>
        );
    }

    const lastCandle = candleData.length > 0 ? candleData[candleData.length - 1] : null;
    const currentPrice = lastCandle ? lastCandle.close : asset.price;
    const priceChange = lastCandle ? (lastCandle.close - lastCandle.open) : asset.change;
    const percentChange = lastCandle
        ? (lastCandle.open !== 0 ? ((priceChange / lastCandle.open) * 100) : 0)
        : asset.changePercent;

    const tabs: { key: TabType; label: string }[] = [
        { key: 'overview', label: 'Overview' },
        { key: 'news', label: 'News' },
        { key: 'technical', label: 'Technical' },
    ];

    return (
        <ErrorBoundary>
            <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
                {/* ── Breadcrumb ───────────────────────── */}
                <FadeIn>
                    <div className="flex items-center gap-2 text-sm text-white/30 mb-8">
                        <Link href="/" className="hover:text-white/60 transition-colors">
                            Home
                        </Link>
                        <span>/</span>
                        <Link href="/markets" className="hover:text-white/60 transition-colors">
                            Markets
                        </Link>
                        <span>/</span>
                        <span className="text-white/60">{symbol}</span>
                    </div>
                </FadeIn>

                {/* ── Header ───────────────────────────── */}
                <AssetHeader
                    symbol={symbol}
                    asset={asset}
                    currentPrice={currentPrice}
                    priceChange={priceChange}
                    percentChange={percentChange}
                />

                {/* ── Tabs ─────────────────────────────── */}
                <FadeIn delay={0.03}>
                    <div className="flex gap-1 mb-8 border-b border-white/[0.04] pb-0">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-5 py-3 text-xs uppercase tracking-widest transition-all border-b-2 -mb-[1px] ${activeTab === tab.key
                                    ? 'border-[#0055FF] text-[#0055FF]'
                                    : 'border-transparent text-white/30 hover:text-white/60'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* ── Tab Content ──────────────────────── */}
                {activeTab === 'overview' && (
                    <ChartErrorBoundary name="AssetOverview">
                        <AssetOverview
                            symbol={symbol}
                            asset={asset}
                            candleData={candleData}
                            currentPrice={currentPrice}
                            percentChange={percentChange}
                        />
                    </ChartErrorBoundary>
                )}

                {activeTab === 'news' && (
                    <FadeIn delay={0.05}>
                        <section className="mb-10">
                            <h2 className="text-xl font-light mb-5 text-white/80">Latest News</h2>
                            <AssetNews symbol={symbol} />
                        </section>
                    </FadeIn>
                )}

                {activeTab === 'technical' && (
                    <ChartErrorBoundary name="AssetTechnical">
                        <AssetTechnical
                            symbol={symbol}
                            candleData={candleData}
                            currentPrice={currentPrice}
                        />
                    </ChartErrorBoundary>
                )}

                {/* ── Back link ─────────────────────────── */}
                <FadeIn delay={0.2}>
                    <div className="pt-4 pb-8">
                        <Link href="/markets">
                            <Button variant="ghost" size="sm">
                                ← Back to Markets
                            </Button>
                        </Link>
                    </div>
                </FadeIn>
            </main>
        </ErrorBoundary>
    );
}
