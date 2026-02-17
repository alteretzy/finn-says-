import Link from 'next/link';
import { MarketAsset } from '@/lib/finnhub/types';
import Badge from '@/components/ui/Badge';
import { formatPrice, formatPercent, formatVolume } from '@/lib/utils/formatters';

interface ScreenerCardProps {
    asset: MarketAsset;
}

export default function ScreenerCard({ asset }: ScreenerCardProps) {
    return (
        <Link href={`/asset/${asset.symbol}`} className="block bg-[#0A0A12] border border-white/5 rounded-xl p-4 mb-3 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-sm font-semibold text-white/60">
                        {asset.symbol.slice(0, 1)}
                    </div>
                    <div>
                        <h3 className="text-white font-medium">{asset.symbol}</h3>
                        <p className="text-white/40 text-xs">{asset.name}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-white font-mono text-lg">${formatPrice(asset.price)}</p>
                    <Badge variant={asset.changePercent >= 0 ? 'success' : 'error'} size="sm" className="mt-1">
                        {asset.changePercent > 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </Badge>
                </div>
            </div>

            <div className="flex justify-between items-center text-xs text-white/40 border-t border-white/5 pt-3">
                <div>
                    <span className="block mb-1">Vol</span>
                    <span className="text-white/70 font-mono">{formatVolume(asset.volume)}</span>
                </div>
                <div className="text-right">
                    <span className="block mb-1">Mkt Cap</span>
                    <span className="text-white/70 font-mono">{(asset.marketCap / 1000000).toFixed(2)}M</span>
                </div>
            </div>
        </Link>
    );
}
