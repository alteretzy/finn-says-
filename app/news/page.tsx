
import NewsFeed from '@/components/NewsCard';

export const metadata = {
    title: 'Market News | FinnSays',
    description: 'Real-time financial news from Yahoo Finance.',
};

export default function NewsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-24">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Market News</h1>
                <span className="text-xs text-gray-400 bg-green-500/10 text-green-400 px-2 py-1 rounded-full">
                    ● Live via Yahoo Finance
                </span>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {['All', 'Stocks', 'Crypto', 'Earnings', 'Economy'].map(cat => (
                    <button
                        key={cat}
                        className="text-sm px-3 py-1 rounded-full border border-white/10 
                       hover:border-blue-500 hover:text-blue-400 transition text-gray-400"
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <NewsFeed />
        </main>
    );
}
