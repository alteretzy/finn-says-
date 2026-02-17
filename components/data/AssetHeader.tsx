'use client';

import { MarketAsset } from '@/lib/finnhub/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import FadeIn from '@/components/animations/FadeIn';
import { formatPrice, formatPercent } from '@/lib/utils/formatters';
import { useWatchlist } from '@/hooks/useWatchlist';

interface AssetHeaderProps {
    symbol: string;
    asset: MarketAsset;
    currentPrice: number;
    priceChange: number;
    percentChange: number;
}

export default function AssetHeader({
    symbol,
    asset,
    currentPrice,
    priceChange,
    percentChange
}: AssetHeaderProps) {
    const { isInWatchlist, toggleWatchlist } = useWatchlist();
    const inWatchlist = isInWatchlist(symbol);
    const isLivePositive = priceChange >= 0;

    return (
        <FadeIn>
            <section className="mb-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-semibold text-white/70">
                            {symbol.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight animate-shimmer">
                                {asset.name}
                            </h1>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-base sm:text-lg text-white/50">{symbol}</p>
                                <Badge>
                                    {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="text-left md:text-right">
                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tabular-nums">
                            ${formatPrice(currentPrice)}
                        </p>
                        <div className="flex items-center gap-2 mt-2 md:justify-end">
                            <Badge variant={isLivePositive ? 'success' : 'error'} className="text-sm px-3 py-1">
                                {formatPercent(percentChange)}
                            </Badge>
                            <span
                                className={`text-lg font-light ${isLivePositive ? 'text-emerald-400' : 'text-red-400'}`}
                            >
                                {isLivePositive ? '+' : ''}
                                {Number.isFinite(priceChange) ? priceChange.toFixed(2) : '0.00'}
                            </span>
                            <span className="flex h-2 w-2 relative ml-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleWatchlist(symbol)}
                        className={inWatchlist ? '!border-[#0055FF]/40 !text-[#0055FF]' : ''}
                    >
                        {inWatchlist ? '★ Watchlisted' : '☆ Watchlist'}
                    </Button>
                    <Button variant="outline" size="sm">
                        ↗ Share
                    </Button>
                </div>
            </section>
        </FadeIn>
    );
}
