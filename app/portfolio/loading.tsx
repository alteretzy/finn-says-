import SkeletonLoader from '@/components/ui/SkeletonLoader';
import FadeIn from '@/components/animations/FadeIn';

export default function Loading() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-28">
            <FadeIn>
                <div className="mb-12 space-y-4">
                    <SkeletonLoader className="w-24 h-4" />
                    <SkeletonLoader className="w-64 h-12" />
                </div>
            </FadeIn>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {[1, 2, 3].map((i) => (
                    <SkeletonLoader key={i} className="h-32 w-full rounded-2xl" />
                ))}
            </div>

            {/* List */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <SkeletonLoader key={i} className="h-20 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}
