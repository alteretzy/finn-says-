import AssetClient from './AssetClient';
import { getMarketData } from '@/lib/data/market-data';
import { getMockCandleData } from '@/lib/finnhub/api';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { alphaVantageClient } from '@/lib/alphaVantage/client';
import { MarketAsset } from '@/lib/finnhub/types';

export const revalidate = 60;

// Generate static params from our curated watchlist
export async function generateStaticParams() {
    const data = await getMarketData();
    return data.map((asset) => ({
        symbol: asset.symbol,
    }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const allAssets = await getMarketData();
    let asset = allAssets.find((a) => a.symbol === symbol);

    if (!asset) {
        // Fallback for metadata if not in watchlist
        try {
            const quote = await dataAggregator.getQuote(symbol);
            if (quote) {
                asset = {
                    symbol: symbol,
                    name: symbol,
                    type: 'stock',
                    price: quote.price,
                    change: quote.change,
                    changePercent: quote.changePercent,
                    volume: quote.volume,
                    marketCap: 0,
                    sparklineData: []
                };
            }
        } catch (e) {
            console.error('Metadata fallback failed:', e);
        }
    }

    if (!asset) {
        return { title: `${symbol} Price & News | FinnSays` };
    }

    const priceStr = asset.price < 1
        ? asset.price.toFixed(4)
        : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const changeEmoji = asset.changePercent >= 0 ? '📈' : '📉';
    const changePrefix = asset.change >= 0 ? '+' : '';

    return {
        title: `${asset.symbol} ${asset.name} — $${priceStr} ${changeEmoji} ${changePrefix}${asset.changePercent.toFixed(2)}%`,
        description: `Track ${asset.name} (${asset.symbol}) live price, real-time candlestick charts, technical indicators, and market news. Current price: $${priceStr} (${changePrefix}${asset.changePercent.toFixed(2)}%).`,
        openGraph: {
            title: `${asset.symbol} — ${asset.name} Live Price & Analysis`,
            description: `Live price, real-time charts, and institutional-grade analytics for ${asset.name}. 24h: ${changeEmoji} ${changePrefix}${asset.changePercent.toFixed(2)}%`,
            type: 'website',
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com'}/api/og?symbol=${symbol}&price=${priceStr}&change=${asset.changePercent.toFixed(2)}`,
                    width: 1200,
                    height: 630,
                    alt: `${asset.symbol} price analysis`,
                },
            ],
            siteName: 'FinnSays',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${asset.symbol} Price Today — FinnSays`,
            description: `Track ${asset.name} live with real-time analytics.`,
            images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com'}/api/og?symbol=${symbol}&price=${priceStr}&change=${asset.changePercent.toFixed(2)}`],
        },
    };
}

export default async function AssetPage({ params }: { params: Promise<{ symbol: string }> }) {
    const { symbol } = await params;
    const allAssets = await getMarketData();
    let asset = allAssets.find((a) => a.symbol === symbol) || null;

    // If not in markets list, try to fetch it live
    if (!asset) {
        const quote = await dataAggregator.getQuote(symbol);
        if (quote) {
            asset = {
                symbol: symbol,
                name: symbol, // Placeholder name
                type: 'stock',
                price: quote.price,
                change: quote.change,
                changePercent: quote.changePercent,
                volume: quote.volume,
                marketCap: 0,
                sparklineData: []
            };

            // Try to get real name/details from Alpha Vantage Overview
            try {
                const overview = await alphaVantageClient.getOverview(symbol);
                if (overview && overview.Name) {
                    asset.name = overview.Name;
                    asset.marketCap = parseFloat(overview.MarketCapitalization || '0');
                }
            } catch (e) {
                console.warn('Alpha Vantage overview fallback failed:', e);
            }
        }
    }


    // Use DataAggregator to fetch candles for all asset types
    let candleData;
    try {
        const now = Math.floor(Date.now() / 1000);
        const twoMonthsAgo = now - 60 * 24 * 60 * 60;
        const candles = await dataAggregator.getCandles(symbol, 'D', twoMonthsAgo, now);
        if (candles.length > 0) {
            candleData = candles;
        }
    } catch (e) {
        console.warn('[asset] DataAggregator candle fetch failed:', e);
    }

    // Last resort: mock data
    if (!candleData || candleData.length === 0) {
        candleData = getMockCandleData();
    }

    // JSON-LD Schema
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: asset?.name || symbol,
        identifier: symbol,
        category: asset?.type || 'Financial Instrument',
        description: `Real-time ${asset?.name || symbol} market data, price charts, and analysis`,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.com'}/asset/${symbol}`,
        offers: {
            '@type': 'Offer',
            price: asset?.price || 0,
            priceCurrency: 'USD',
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <AssetClient
                symbol={symbol}
                asset={asset as MarketAsset}
                candleData={candleData}
            />
        </>
    );
}

