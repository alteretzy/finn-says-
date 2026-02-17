'use client';

import { MarketAsset } from '@/lib/finnhub/types';
import { useMemo } from 'react';

interface SectorHeatmapProps {
    assets: MarketAsset[];
}

export default function SectorHeatmap({ assets }: SectorHeatmapProps) {
    const sectors = useMemo(() => {
        const sectorMap: Record<string, { totalChange: number; count: number }> = {};

        assets.filter(a => a.type === 'stock' && a.sector).forEach(asset => {
            const sector = asset.sector!;
            if (!sectorMap[sector]) {
                sectorMap[sector] = { totalChange: 0, count: 0 };
            }
            sectorMap[sector].totalChange += asset.changePercent;
            sectorMap[sector].count += 1;
        });

        return Object.entries(sectorMap).map(([name, data]) => ({
            name,
            change: data.totalChange / data.count
        })).sort((a, b) => b.change - a.change); // Best performers first
    }, [assets]);

    if (sectors.length === 0) return null;

    return (
        <div className="mb-8">
            <h3 className="text-xs font-medium text-white/50 mb-3 uppercase tracking-wider">Sector Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {sectors.map((sector) => (
                    <div
                        key={sector.name}
                        className={`p-3 rounded-lg border border-white/5 flex flex-col justify-between h-20 transition-colors ${sector.change >= 0 ? 'bg-emerald-500/[0.05] hover:bg-emerald-500/[0.1]' : 'bg-red-500/[0.05] hover:bg-red-500/[0.1]'
                            }`}
                    >
                        <span className="text-[10px] text-white/60 font-medium truncate uppercase tracking-wide" title={sector.name}>
                            {sector.name}
                        </span>
                        <span className={`text-lg font-mono tracking-tight ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                            {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
