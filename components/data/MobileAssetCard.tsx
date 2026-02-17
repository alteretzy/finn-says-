'use client';

import Link from 'next/link';
import { MarketAsset } from '@/lib/finnhub/types';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatVolume, formatMarketCap } from '@/lib/utils/formatters';

interface MobileAssetCardProps {
    asset: MarketAsset;
    subtitle?: string;
    extraDetail?: {
        label: string;
        value: string | number;
    };
}

export default function MobileAssetCard({ asset, subtitle, extraDetail }: MobileAssetCardProps) {
    const isPositive = asset.changePercent >= 0;

    return (
        <Link
            href={`/asset/${asset.symbol}`}
            className="block bg-[#0A0A12] border border-white/5 rounded-xl p-4 mb-3 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-semibold text-white/60">
                        {asset.symbol.slice(0, 1)}
                    </div>
                    <div>
                        <h3 className="text-white font-medium">{asset.symbol}</h3>
                        <p className="text-white/40 text-[10px] truncate max-w-[120px]">
                            {subtitle || asset.name}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white font-mono text-base">${formatPrice(asset.price || 0)}</p>
                    <Badge variant={isPositive ? 'success' : 'error'} size="sm" className="mt-1">
                        {isPositive ? '+' : ''}{(asset.changePercent || 0).toFixed(2)}%
                    </Badge>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-white/30 border-t border-white/5 pt-3">
                <div>
                    <span className="block mb-1 uppercase tracking-tighter">Volume</span>
                    <span className="text-white/60 font-mono">{formatVolume(asset.volume)}</span>
                </div>
                {extraDetail ? (
                    <div className="text-right">
                        <span className="block mb-1 uppercase tracking-tighter">{extraDetail.label}</span>
                        <span className="text-white/60 font-mono">{extraDetail.value}</span>
                    </div>
                ) : (
                    <div className="text-right">
                        <span className="block mb-1 uppercase tracking-tighter">Mkt Cap</span>
                        <span className="text-white/60 font-mono">{formatMarketCap(asset.marketCap)}</span>
                    </div>
                )}
            </div>
        </Link>
    );
}
