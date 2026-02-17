import { MetadataRoute } from 'next';
import { STOCK_WATCHLIST, CRYPTO_IDS, COMMODITY_MAP } from '@/lib/data/market-data';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com';

    // Static routes
    const routes = [
        '',
        '/markets',
        '/screener',
        '/news',
        '/watchlist',
        '/contact',
        '/technology',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic routes - Stocks
    const stockRoutes = STOCK_WATCHLIST.map((stock) => ({
        url: `${baseUrl}/stocks/${stock.symbol}`,
        lastModified: new Date(),
        changeFrequency: 'always' as const,
        priority: 0.9,
    }));

    // Dynamic routes - Crypto
    const cryptoRoutes = Object.keys(CRYPTO_IDS).map((coin) => ({
        url: `${baseUrl}/crypto/${coin}`,
        lastModified: new Date(),
        changeFrequency: 'always' as const,
        priority: 0.9,
    }));

    // Dynamic routes - Commodities
    const commodityRoutes = Object.keys(COMMODITY_MAP).map((comp) => ({
        url: `${baseUrl}/commodities/${comp}`,
        lastModified: new Date(),
        changeFrequency: 'always' as const,
        priority: 0.8,
    }));

    return [...routes, ...stockRoutes, ...cryptoRoutes, ...commodityRoutes];
}
