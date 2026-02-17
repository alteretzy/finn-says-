import Link from 'next/link';
import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';

export const metadata: Metadata = {
    title: 'Financial Insights & News | FinnSays Blog',
    description: 'Expert analysis, market updates, and educational guides on stocks, crypto, and commodities.',
};

const POSTS = [
    {
        slug: 'understanding-real-time-stock-data',
        title: 'Understanding Real-Time Stock Data',
        excerpt: 'Why milliseconds matter in modern trading and how we aggregate global market feeds.',
        date: 'Feb 14, 2026',
        category: 'Education'
    },
    {
        slug: 'how-to-read-candlestick-charts',
        title: 'How to Read Candlestick Charts',
        excerpt: 'A comprehensive guide to interpreting OHLC data and chart patterns for technical analysis.',
        date: 'Feb 12, 2026',
        category: 'Technical Analysis'
    },
    {
        slug: 'cryptocurrency-trading-basics',
        title: 'Cryptocurrency Trading Basics',
        excerpt: 'Navigating the volatile world of digital assets: wallets, exchanges, and security best practices.',
        date: 'Feb 10, 2026',
        category: 'Crypto'
    }
];

export default function BlogPage() {
    return (
        <main className="container mx-auto px-4 py-16 max-w-5xl">
            <FadeIn>
                <h1 className="text-5xl font-light mb-6">Market Insights</h1>
                <p className="text-xl text-white/50 mb-16 max-w-2xl">
                    Deep dives into financial technology, market analysis, and trading strategies.
                </p>
            </FadeIn>

            <div className="space-y-8">
                {POSTS.map((post, i) => (
                    <FadeIn key={post.slug} delay={i * 0.1}>
                        <article className="group relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.04] hover:border-white/10 transition-all">
                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="text-emerald-400 font-medium">{post.category}</span>
                                        <span className="text-white/30">•</span>
                                        <span className="text-white/40">{post.date}</span>
                                    </div>
                                    <h2 className="text-2xl font-light group-hover:text-[#0066FF] transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-white/60 max-w-3xl leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-white/10 text-white/40 group-hover:border-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1"
                                    >
                                        →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    </FadeIn>
                ))}
            </div>
        </main>
    );
}
