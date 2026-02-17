interface SkeletonLoaderProps {
    className?: string;
    lines?: number;
    lineHeight?: string;
}

export default function SkeletonLoader({
    className = '',
    lines = 1,
    lineHeight = 'h-4',
}: SkeletonLoaderProps) {
    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton rounded-lg ${lineHeight} ${i === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
                        }`}
                />
            ))}
        </div>
    );
}
