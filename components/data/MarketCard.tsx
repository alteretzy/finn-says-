'use client';

import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/charts/Sparkline';
import { MarketAsset } from '@/lib/finnhub/types';
import Card from '@/components/ui/Card';

interface MarketCardProps {
    asset: MarketAsset;
    variant?: 'default' | 'compact';
}

export default function MarketCard({ asset, variant = 'default' }: MarketCardProps) {
    const isPositive = asset.changePercent >= 0;

    if (variant === 'compact') {
        return (
            <Link href={`/asset/${asset.symbol}`} className="block group">
                <Card className="flex items-center justify-between p-4 bg-[#0A0A15]/60 hover:bg-[#0F0F20]/80 transition-colors border-white/5" noPadding>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-medium text-white/70">
                            {asset.symbol.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white group-hover:text-[#0055FF] transition-colors">{asset.symbol}</p>
                            <p className="text-xs text-white/40">{isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-white/90">${asset.price.toLocaleString()}</p>
                        <div className="w-16 h-8 opacity-50">
                            <Sparkline
                                data={asset.sparklineData}
                                color={isPositive ? '#10B981' : '#EF4444'}
                                height={30}
                            />
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    return (
        <Link href={`/asset/${asset.symbol}`} className="block h-full group">
            <Card className="h-full flex flex-col justify-between hover:border-white/20 transition-all duration-300 relative overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${isPositive ? 'from-emerald-500/5' : 'from-red-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Header */}
                <div className="flex items-start justify-between mb-4 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-white/90 group-hover:text-[#0055FF] transition-colors">{asset.symbol}</span>
                            <Badge variant={isPositive ? 'success' : 'error'} size="sm">
                                {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                            </Badge>
                        </div>
                        <p className="text-xs text-white/40 font-light truncate max-w-[120px]">{asset.name}</p>
                    </div>
                </div>

                {/* Price */}
                <div className="mb-4 relative z-10">
                    <p className="text-2xl font-light text-white tracking-tight">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Sparkline */}
                <div className="h-12 w-full opacity-60 group-hover:opacity-100 transition-opacity duration-300 relative z-10">
                    <Sparkline
                        data={asset.sparklineData}
                        color={isPositive ? '#10B981' : '#EF4444'}
                        height={50}
                    />
                </div>
            </Card>
        </Link>
    );
}
