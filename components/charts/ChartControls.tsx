'use client';

interface ChartControlsProps {
    selectedRange: string;
    onRangeChange: (range: string) => void;
}

const ranges = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export default function ChartControls({ selectedRange, onRangeChange }: ChartControlsProps) {
    return (
        <div className="flex items-center gap-1">
            {ranges.map((range) => (
                <button
                    key={range}
                    onClick={() => onRangeChange(range)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${selectedRange === range
                            ? 'bg-[#0066FF]/10 border border-[#0066FF] text-white'
                            : 'text-white/50 hover:text-white hover:bg-white/5 border border-transparent'
                        }`}
                >
                    {range}
                </button>
            ))}
        </div>
    );
}
