'use client';

import FadeIn from '@/components/animations/FadeIn';
import Badge from '@/components/ui/Badge';
import TradingViewWidget from '@/components/charts/TradingViewWidget';
import { MarketAsset, CandleData } from '@/lib/finnhub/types';
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '@/lib/utils/formatters';

interface AssetOverviewProps {
    symbol: string;
    asset: MarketAsset;
    candleData: CandleData[];
    currentPrice: number;
    percentChange: number;
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div className={`bg-white/[0.02] border rounded-xl p-4 md:p-5 transition-colors hover:border-white/10 ${accent ? 'border-[#0055FF]/20' : 'border-white/[0.06]'}`}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{label}</p>
            <p className="text-lg md:text-xl font-light text-white tabular-nums">{value}</p>
        </div>
    );
}

export default function AssetOverview({
    symbol,
    asset,
    candleData,
    currentPrice,
    percentChange
}: AssetOverviewProps) {
    const lastCandle = candleData.length > 0 ? candleData[candleData.length - 1] : null;

    return (
        <>
            {/* Key Statistics */}
            <FadeIn delay={0.05}>
                <section className="mb-10">
                    <h2 className="text-xl font-light mb-5 text-white/80">Key Statistics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <StatCard label="Open" value={`$${formatPrice(lastCandle?.open || asset.price)}`} />
                        <StatCard label="High" value={`$${formatPrice(lastCandle?.high || asset.price)}`} />
                        <StatCard label="Low" value={`$${formatPrice(lastCandle?.low || asset.price)}`} />
                        <StatCard label="Volume" value={formatVolume(lastCandle?.volume || asset.volume)} />
                        <StatCard label="Market Cap" value={formatMarketCap(asset.marketCap)} />
                        <StatCard label="Change" value={formatPercent(percentChange)} accent />
                    </div>
                </section>
            </FadeIn>

            {/* Chart */}
            <FadeIn delay={0.1}>
                <section className="mb-10">
                    <div className="h-[500px] w-full bg-[#131722] rounded-xl overflow-hidden border border-white/5">
                        <TradingViewWidget symbol={symbol} />
                    </div>
                </section>
            </FadeIn>

            {/* About */}
            <FadeIn delay={0.15}>
                <section className="mb-10">
                    <h2 className="text-xl font-light mb-5 text-white/80">About {asset.name}</h2>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                        <p className="text-sm md:text-base text-white/60 font-light leading-relaxed mb-6">
                            {asset.name} ({symbol}) is a {asset.type === 'stock' ? 'publicly traded company'
                                : asset.type === 'crypto' ? 'cryptocurrency'
                                    : asset.type === 'metal' ? 'precious metal'
                                        : 'commodity'} tracked on FinnSays with real-time price data
                            and interactive charting tools. The current price is $
                            {formatPrice(currentPrice)} with a 24-hour change of{' '}
                            {formatPercent(percentChange)}.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Badge>{asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}</Badge>
                            {asset.marketCap > 0 && (
                                <Badge>Market Cap: {formatMarketCap(asset.marketCap)}</Badge>
                            )}
                        </div>
                    </div>
                </section>
            </FadeIn>
        </>
    );
}
