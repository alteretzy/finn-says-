import { Metadata } from 'next';
import { getMarketData } from '@/lib/data/market-data';
import WatchlistClient from '@/components/data/WatchlistClient';

export const metadata: Metadata = {
    title: 'My Watchlist — Track Your Favorite Assets',
    description:
        'Create and manage your personalized stock watchlist. Track real-time prices, monitor performance, and get updates on your favorite stocks, crypto, and commodities.',
    keywords: [
        'stock watchlist',
        'portfolio tracker',
        'stock alerts',
        'investment tracking',
        'stock monitoring',
        'personalized watchlist',
        'portfolio management',
    ],
    openGraph: {
        title: 'Stock Watchlist — FinnSays',
        description: 'Track and monitor your favorite stocks in real-time',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'My Watchlist — FinnSays',
        description: 'Track your favorite stocks in real-time',
    },
    alternates: {
        canonical: '/watchlist',
    },
};

export const revalidate = 60;

export default async function WatchlistPage() {
    const marketData = await getMarketData();

    return <WatchlistClient initialData={marketData} />;
}
