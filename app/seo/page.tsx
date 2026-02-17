import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
    title: 'SEO Dashboard | FinnSays',
    description: 'Internal SEO metrics and performance monitoring for FinnSays.',
    robots: {
        index: false, // Don't index this internal page
        follow: false,
    },
};

export default function SEODashboard() {
    // Mock metrics for display
    const metrics = [
        { label: 'Total Indexed Pages', value: '54', change: '+12%', positive: true },
        { label: 'Avg Lighthouse Score', value: '98/100', change: '+2%', positive: true },
        { label: 'Target Keywords', value: '15', change: 'Top 10', positive: true },
        { label: 'Avg Page Load', value: '0.8s', change: '-0.2s', positive: true },
        { label: 'Social Shares', value: '1,240', change: '+150', positive: true },
        { label: 'Backlinks', value: '45', change: '+5', positive: true },
    ];

    const topKeywords = [
        { keyword: 'stock market dashboard', volume: '12,000', rank: '#12' },
        { keyword: 'real-time stock prices', volume: '10,000', rank: '#15' },
        { keyword: 'cryptocurrency tracker', volume: '8,500', rank: '#8' },
        { keyword: 'commodity futures data', volume: '2,400', rank: '#5' },
        { keyword: 'best financial dashboard', volume: '1,500', rank: '#3' },
    ];

    return (
        <main className="container mx-auto px-4 py-12 max-w-6xl">
            <FadeIn>
                <h1 className="text-4xl font-light mb-2">SEO Performance Dashboard</h1>
                <p className="text-white/50 mb-10">Real-time tracking of search engine visibility and technical performance.</p>
            </FadeIn>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {metrics.map((m, i) => (
                    <FadeIn key={i} delay={i * 0.05}>
                        <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:border-white/10 transition-colors">
                            <p className="text-sm text-white/40 uppercase tracking-wider mb-2">{m.label}</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-light text-white">{m.value}</span>
                                <span className={`text-sm font-medium ${m.positive ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {m.change}
                                </span>
                            </div>
                        </div>
                    </FadeIn>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Keyword Rankings */}
                <FadeIn delay={0.3}>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
                        <h2 className="text-xl font-light mb-6">Top Performing Keywords</h2>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 text-xs text-white/30 uppercase tracking-wider pb-2 border-b border-white/[0.04]">
                                <span>Keyword</span>
                                <span className="text-right">Volume</span>
                                <span className="text-right">Rank</span>
                            </div>
                            {topKeywords.map((k, i) => (
                                <div key={i} className="grid grid-cols-3 text-sm border-b border-white/[0.02] last:border-0 pb-3 last:pb-0">
                                    <span className="font-medium text-white/80">{k.keyword}</span>
                                    <span className="text-right text-white/50">{k.volume}</span>
                                    <span className="text-right text-emerald-400 font-mono">{k.rank}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Technical Health */}
                <FadeIn delay={0.4}>
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-8">
                        <h2 className="text-xl font-light mb-6">Technical Health</h2>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/60">Core Web Vitals</span>
                                    <span className="text-emerald-400">Passing</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/60">Mobile Usability</span>
                                    <span className="text-emerald-400">Excellent</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[100%]" />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-white/60">Crawlability</span>
                                    <span className="text-emerald-400">100% Indexed</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[100%]" />
                                </div>
                            </div>
                            <div className="pt-4 mt-2 border-t border-white/[0.04]">
                                <p className="text-xs text-white/40">Last crawl: Just now</p>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </main>
    );
}
