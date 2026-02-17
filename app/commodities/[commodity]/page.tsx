import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dataAggregator } from '@/lib/dataManager/aggregator';
import { COMMODITY_MAP } from '@/lib/data/market-data';
import AssetClient from '../../asset/[symbol]/AssetClient';
import { MarketAsset } from '@/lib/finnhub/types';

interface PageProps {
    params: Promise<{
        commodity: string;
    }>;
}

export const revalidate = 60;

// Generate static params for all commodities
export async function generateStaticParams() {
    return Object.keys(COMMODITY_MAP).map((commodity) => ({
        commodity: commodity,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { commodity } = await params;
    const info = COMMODITY_MAP[commodity.toLowerCase()];
    if (!info) return { title: 'Commodity Not Found | FinnSays' };
    return {
        title: `${info.name} Price Today (Live) — ${info.symbol} Charts | FinnSays`,
        description: `Track real-time ${info.name} (${info.symbol}) high-resolution price charts, institutional news, and technical analysis. ${info.description}.`,
    };
}

export default async function CommodityPage({ params }: PageProps) {
    const { commodity } = await params;
    const info = COMMODITY_MAP[commodity.toLowerCase()];

    if (!info) {
        notFound();
    }

    // 1. Fetch Data via Aggregator
    const now = Math.floor(Date.now() / 1000);
    const twoMonthsAgo = now - 60 * 24 * 60 * 60;

    const [quote, candles] = await Promise.all([
        dataAggregator.getQuote(info.symbol),
        dataAggregator.getCandles(info.symbol, 'D', twoMonthsAgo, now)
    ]);

    if (!quote) {
        notFound();
    }

    // 2. Transform to MarketAsset
    const marketAsset: MarketAsset = {
        symbol: info.symbol,
        name: info.name,
        type: 'commodity',
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: 0,
        sparklineData: candles.slice(-20).map(c => c.close)
    };

    // 3. Candle data (already transformed by aggregator)
    const candleData = candles.map(d => ({
        time: d.time,
        open: d.open || d.close,
        high: d.high || d.close,
        low: d.low || d.close,
        close: d.close,
        volume: d.volume || 0
    }));

    // JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": info.name,
        "offers": {
            "@type": "Offer",
            "price": quote.price,
            "priceCurrency": "USD"
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <AssetClient
                symbol={info.symbol}
                asset={marketAsset}
                candleData={candleData}
            />
        </>
    );
}
