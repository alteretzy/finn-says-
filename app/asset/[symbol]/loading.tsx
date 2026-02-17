import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function Loading() {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-28">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                <div>
                    <SkeletonLoader className="w-16 h-4 mb-3" />
                    <SkeletonLoader className="w-48 h-12 mb-2" />
                    <SkeletonLoader className="w-32 h-6" />
                </div>
                <div>
                    <SkeletonLoader className="w-40 h-10 mb-2" />
                    <SkeletonLoader className="w-24 h-6" />
                </div>
            </div>

            {/* Layout Skeleton (Chart + Sidebar) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart Area */}
                    <div className="h-[500px] bg-white/[0.02] border border-white/[0.05] rounded-2xl p-6 relative overflow-hidden">
                        <SkeletonLoader className="w-full h-full opacity-20" />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Stats */}
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <SkeletonLoader className="mb-6 w-32 h-6" />
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex justify-between items-center py-3 border-b border-white/[0.05]">
                                    <SkeletonLoader className="w-24 h-4" />
                                    <SkeletonLoader className="w-20 h-4" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
