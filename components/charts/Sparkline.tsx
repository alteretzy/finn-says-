interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
}

export default function Sparkline({ data, color, height = 60 }: SparklineProps) {
    if (!data || data.length < 2) return null;

    const isPositive = data[data.length - 1] >= data[0];
    const strokeColor = color || (isPositive ? '#10B981' : '#EF4444');

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data
        .map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = ((max - value) / range) * 100;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg
            width="100%"
            height={height}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="overflow-visible"
        >
            <defs>
                <linearGradient id={`sparkline-grad-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
                points={`0,100 ${points} 100,100`}
                fill={`url(#sparkline-grad-${strokeColor.replace('#', '')})`}
            />
            {/* Line */}
            <polyline
                points={points}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
            />
        </svg>
    );
}
