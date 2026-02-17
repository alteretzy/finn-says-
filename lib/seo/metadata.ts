import { Metadata } from 'next';
import { AssetData } from '@/lib/finnhub/types';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

export function generateAssetMetadata(asset: AssetData): Metadata {
    const title = `${asset.symbol} Price - Live Chart & Historical Data`;
    const description = `Track ${asset.symbol} live price, view real-time charts, and analyze historical data. Get current quotes, market statistics, and trading insights for ${asset.name}.`;

    return {
        title,
        description,
        keywords: [
            `${asset.symbol} stock`,
            `${asset.name} price`,
            `${asset.symbol} chart`,
            `${asset.symbol} quote`,
            'real-time stock data',
            'live stock price',
        ],
        openGraph: {
            title: `${title} | ${SITE_NAME}`,
            description,
            type: 'website',
            images: [
                {
                    url: `${SITE_URL}/api/og?symbol=${asset.symbol}`,
                    width: 1200,
                    height: 630,
                    alt: `${asset.symbol} Price Chart`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: `${title} | ${SITE_NAME}`,
            description,
        },
        alternates: {
            canonical: `${SITE_URL}/asset/${asset.symbol}`,
        },
    };
}
