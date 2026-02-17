export default function Loading() {
    return (
        <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-12">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-white/5 rounded-md animate-pulse" />
                        <div className="h-4 w-24 bg-white/5 rounded-md animate-pulse" />
                    </div>
                </div>
                <div className="text-right space-y-2 hidden md:block">
                    <div className="h-10 w-32 bg-white/5 rounded-md animate-pulse ml-auto" />
                    <div className="h-4 w-20 bg-white/5 rounded-md animate-pulse ml-auto" />
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="flex gap-4 mb-8">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-8 w-24 bg-white/5 rounded-md animate-pulse" />
                ))}
            </div>

            {/* Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Chart Area */}
                    <div className="aspect-[16/9] bg-white/5 rounded-2xl animate-pulse" />
                    {/* Text Area */}
                    <div className="space-y-4">
                        <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/5 rounded animate-pulse" />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white/5 rounded-2xl p-6 h-64 animate-pulse" />
                    <div className="bg-white/5 rounded-2xl p-6 h-48 animate-pulse" />
                </div>
            </div>
        </main>
    );
}
