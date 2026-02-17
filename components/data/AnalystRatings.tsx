import { AnalystRecommendation } from '@/lib/finnhub/types';

interface AnalystRatingsProps {
    data: AnalystRecommendation[];
}

export default function AnalystRatings({ data }: AnalystRatingsProps) {
    if (!data || data.length === 0) return null;

    const latest = data[0];
    const total = latest.buy + latest.hold + latest.sell + latest.strongBuy + latest.strongSell;

    if (total === 0) return null;

    const getPercent = (val: number) => (val / total) * 100;

    return (
        <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-6">Analyst Consensus</h3>

            <div className="flex h-8 rounded-lg overflow-hidden mb-6">
                {latest.strongBuy > 0 && <div style={{ width: `${getPercent(latest.strongBuy)}%` }} className="bg-[#00C805]" />}
                {latest.buy > 0 && <div style={{ width: `${getPercent(latest.buy)}%` }} className="bg-[#86EFAC]" />}
                {latest.hold > 0 && <div style={{ width: `${getPercent(latest.hold)}%` }} className="bg-[#FACC15]" />}
                {latest.sell > 0 && <div style={{ width: `${getPercent(latest.sell)}%` }} className="bg-[#FB923C]" />}
                {latest.strongSell > 0 && <div style={{ width: `${getPercent(latest.strongSell)}%` }} className="bg-[#EF4444]" />}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-white/40 mb-1">Strong Buy</span>
                    <span className="text-lg font-medium text-[#00C805]">{latest.strongBuy}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-white/40 mb-1">Buy</span>
                    <span className="text-lg font-medium text-[#86EFAC]">{latest.buy}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-white/40 mb-1">Hold</span>
                    <span className="text-lg font-medium text-[#FACC15]">{latest.hold}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-white/40 mb-1">Sell</span>
                    <span className="text-lg font-medium text-[#FB923C]">{latest.sell}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-white/40 mb-1">Strong Sell</span>
                    <span className="text-lg font-medium text-[#EF4444]">{latest.strongSell}</span>
                </div>
            </div>
        </div>
    );
}
