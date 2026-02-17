import { Metadata } from 'next';
import FadeIn from '@/components/animations/FadeIn';
import ScreenerTable from '@/components/data/ScreenerTable';
import { getMarketData } from '@/lib/data/market-data';

export const metadata: Metadata = {
    title: 'Stock Screener — Filter & Compare 1000+ Assets',
    description:
        'Advanced stock screener with real-time data. Filter stocks, crypto, and commodities by price, volume, market cap, and performance. Live streaming data.',
    keywords: [
        'stock screener',
        'stock filter',
        'stock comparison tool',
        'market scanner',
        'real-time stock data',
        'stock finder',
        'best stocks today',
        'crypto screener',
    ],
    openGraph: {
        title: 'Stock Screener — FinnSays',
        description: 'Filter and compare 1000+ assets with real-time market data',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Stock Screener — FinnSays',
        description: 'Filter and compare 1000+ stocks with real-time data',
    },
    alternates: {
        canonical: '/screener',
    },
};

export default async function ScreenerPage() {
    const assets = await getMarketData();

    return (
        <main className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12 pt-32 pb-12 min-h-screen">
            <FadeIn>
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-light text-white mb-4">Market Screener</h1>
                    <p className="text-white/50 max-w-2xl">
                        Scan global markets for opportunities. Filter by asset class, volume, and performance.
                        Real-time data streaming active.
                    </p>
                </div>
            </FadeIn>

            <FadeIn delay={0.1}>
                <ScreenerTable initialAssets={assets} />
            </FadeIn>
        </main>
    );
}
