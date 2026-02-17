import {
    FinnhubQuote,
    FinnhubCompanyProfile,
    FinnhubCandles,
    AssetData,
    MarketAsset,
    AnalystRecommendation,
} from './types';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
const BASE_URL = 'https://finnhub.io/api/v1';

// ── Low-level fetchers ──────────────────────────

async function finnhubFetch<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}token=${FINNHUB_API_KEY}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Finnhub API error: ${res.status}`);
    return res.json();
}

export async function getQuote(symbol: string): Promise<FinnhubQuote> {
    return finnhubFetch<FinnhubQuote>(`/quote?symbol=${symbol}`);
}

export async function getCompanyProfile(symbol: string): Promise<FinnhubCompanyProfile> {
    return finnhubFetch<FinnhubCompanyProfile>(`/stock/profile2?symbol=${symbol}`);
}

export async function getCandles(
    symbol: string,
    resolution: string,
    from: number,
    to: number
): Promise<FinnhubCandles> {
    return finnhubFetch<FinnhubCandles>(
        `/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}`
    );
}

export async function getAnalystRecommendations(symbol: string): Promise<AnalystRecommendation[]> {
    try {
        return await finnhubFetch<AnalystRecommendation[]>(`/stock/recommendation?symbol=${symbol}`);
    } catch (error) {
        console.warn('Error fetching analyst recommendations:', error);
        return [];
    }
}

// ── High-level aggregator ───────────────────────

export async function getAssetData(symbol: string): Promise<AssetData | null> {
    try {
        const now = Math.floor(Date.now() / 1000);
        const monthAgo = now - 30 * 24 * 60 * 60;

        const [quote, profile, candles] = await Promise.all([
            getQuote(symbol),
            getCompanyProfile(symbol),
            getCandles(symbol, 'D', monthAgo, now),
        ]);

        const historicalData =
            candles.s === 'ok' && candles.t
                ? candles.t.map((time: number, index: number) => ({
                    time: new Date(time * 1000).toISOString().split('T')[0],
                    open: candles.o[index],
                    high: candles.h[index],
                    low: candles.l[index],
                    close: candles.c[index],
                    volume: candles.v[index],
                }))
                : [];

        return {
            symbol,
            name: profile.name || symbol,
            price: quote.c,
            change: quote.d,
            changePercent: quote.dp,
            open: quote.o,
            high: quote.h,
            low: quote.l,
            previousClose: quote.pc,
            volume: profile.shareOutstanding || 0,
            marketCap: profile.marketCapitalization || 0,
            peRatio: undefined,
            sector: profile.finnhubIndustry,
            description: undefined,
            website: profile.weburl,
            historicalData,
        };
    } catch (error) {
        console.error('Error fetching asset data:', error);
        return null;
    }
}

// ── Mock data for demo ──────────────────────────

function generateSparkline(base: number, volatility: number): number[] {
    const points: number[] = [];
    let current = base;
    for (let i = 0; i < 20; i++) {
        current += (Math.random() - 0.48) * volatility;
        points.push(current);
    }
    return points;
}

export function getMockMarketData(): MarketAsset[] {
    return [
        // Stocks
        {
            symbol: 'AAPL', name: 'Apple Inc.', type: 'stock',
            price: 178.72, change: 2.35, changePercent: 1.33, volume: 54320000, marketCap: 2800000000000,
            sparklineData: generateSparkline(176, 2),
        },
        {
            symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stock',
            price: 378.91, change: -4.12, changePercent: -1.08, volume: 21500000, marketCap: 2810000000000,
            sparklineData: generateSparkline(382, 3),
        },
        {
            symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stock',
            price: 141.80, change: 1.56, changePercent: 1.11, volume: 18200000, marketCap: 1780000000000,
            sparklineData: generateSparkline(140, 1.5),
        },
        {
            symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'stock',
            price: 178.25, change: 3.41, changePercent: 1.95, volume: 32100000, marketCap: 1840000000000,
            sparklineData: generateSparkline(175, 2.5),
        },
        {
            symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'stock',
            price: 875.28, change: 12.45, changePercent: 1.44, volume: 45600000, marketCap: 2160000000000,
            sparklineData: generateSparkline(862, 10),
        },
        {
            symbol: 'META', name: 'Meta Platforms', type: 'stock',
            price: 502.30, change: -7.20, changePercent: -1.41, volume: 15800000, marketCap: 1280000000000,
            sparklineData: generateSparkline(508, 5),
        },
        {
            symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock',
            price: 248.42, change: 5.67, changePercent: 2.34, volume: 68900000, marketCap: 790000000000,
            sparklineData: generateSparkline(242, 6),
        },
        {
            symbol: 'JPM', name: 'JPMorgan Chase', type: 'stock',
            price: 196.42, change: 1.18, changePercent: 0.60, volume: 8200000, marketCap: 564000000000,
            sparklineData: generateSparkline(195, 1.2),
        },
        {
            symbol: 'V', name: 'Visa Inc.', type: 'stock',
            price: 278.50, change: 1.92, changePercent: 0.69, volume: 5600000, marketCap: 572000000000,
            sparklineData: generateSparkline(276, 2),
        },
        {
            symbol: 'WMT', name: 'Walmart Inc.', type: 'stock',
            price: 172.35, change: -0.82, changePercent: -0.47, volume: 7800000, marketCap: 466000000000,
            sparklineData: generateSparkline(173, 1.2),
        },
        {
            symbol: 'XOM', name: 'Exxon Mobil', type: 'stock',
            price: 104.20, change: 0.85, changePercent: 0.82, volume: 14200000, marketCap: 416000000000,
            sparklineData: generateSparkline(103, 1),
        },
        {
            symbol: 'BA', name: 'Boeing Co.', type: 'stock',
            price: 198.75, change: -2.30, changePercent: -1.14, volume: 6800000, marketCap: 120000000000,
            sparklineData: generateSparkline(201, 3),
        },
        // Crypto
        {
            symbol: 'BTC-USD', name: 'Bitcoin', type: 'crypto',
            price: 97542.18, change: 1245.30, changePercent: 1.88, volume: 28500000000, marketCap: 1920000000000,
            sparklineData: generateSparkline(96000, 800),
        },
        {
            symbol: 'ETH-USD', name: 'Ethereum', type: 'crypto',
            price: 2656.72, change: -89.41, changePercent: -2.52, volume: 14200000000, marketCap: 320000000000,
            sparklineData: generateSparkline(2740, 60),
        },
        {
            symbol: 'BNB-USD', name: 'BNB', type: 'crypto',
            price: 632.34, change: 12.56, changePercent: 2.14, volume: 1820000000, marketCap: 92000000000,
            sparklineData: generateSparkline(620, 10),
        },
        {
            symbol: 'SOL-USD', name: 'Solana', type: 'crypto',
            price: 198.92, change: 6.78, changePercent: 4.77, volume: 3200000000, marketCap: 88000000000,
            sparklineData: generateSparkline(192, 5),
        },
        {
            symbol: 'XRP-USD', name: 'XRP', type: 'crypto',
            price: 2.5234, change: 0.0523, changePercent: 2.30, volume: 1100000000, marketCap: 145000000000,
            sparklineData: generateSparkline(2.47, 0.05),
        },
        {
            symbol: 'ADA-USD', name: 'Cardano', type: 'crypto',
            price: 0.7842, change: 0.0189, changePercent: 2.01, volume: 420000000, marketCap: 28000000000,
            sparklineData: generateSparkline(0.76, 0.02),
        },
        {
            symbol: 'DOGE-USD', name: 'Dogecoin', type: 'crypto',
            price: 0.2534, change: 0.0089, changePercent: 3.64, volume: 980000000, marketCap: 36000000000,
            sparklineData: generateSparkline(0.24, 0.01),
        },
        {
            symbol: 'AVAX-USD', name: 'Avalanche', type: 'crypto',
            price: 35.42, change: -1.23, changePercent: -3.36, volume: 520000000, marketCap: 13000000000,
            sparklineData: generateSparkline(36.5, 1.5),
        },
        {
            symbol: 'LINK-USD', name: 'Chainlink', type: 'crypto',
            price: 18.75, change: 0.45, changePercent: 2.46, volume: 680000000, marketCap: 11000000000,
            sparklineData: generateSparkline(18.3, 0.8),
        },
        {
            symbol: 'DOT-USD', name: 'Polkadot', type: 'crypto',
            price: 7.18, change: -0.12, changePercent: -1.64, volume: 280000000, marketCap: 10000000000,
            sparklineData: generateSparkline(7.3, 0.3),
        },
        // Metals
        {
            symbol: 'GC=F', name: 'Gold', type: 'metal',
            price: 2038.50, change: 15.80, changePercent: 0.78, volume: 182000, marketCap: 0,
            sparklineData: generateSparkline(2022, 12),
        },
        {
            symbol: 'SI=F', name: 'Silver', type: 'metal',
            price: 22.94, change: -0.32, changePercent: -1.37, volume: 68000, marketCap: 0,
            sparklineData: generateSparkline(23.2, 0.4),
        },
        {
            symbol: 'PL=F', name: 'Platinum', type: 'metal',
            price: 908.50, change: 5.20, changePercent: 0.58, volume: 45000, marketCap: 0,
            sparklineData: generateSparkline(903, 6),
        },
        {
            symbol: 'PA=F', name: 'Palladium', type: 'metal',
            price: 965.00, change: -12.30, changePercent: -1.26, volume: 22000, marketCap: 0,
            sparklineData: generateSparkline(977, 8),
        },
        {
            symbol: 'HG=F', name: 'Copper', type: 'metal',
            price: 3.82, change: 0.04, changePercent: 1.06, volume: 95000, marketCap: 0,
            sparklineData: generateSparkline(3.78, 0.04),
        },
        // Commodities
        {
            symbol: 'CL=F', name: 'Crude Oil', type: 'commodity',
            price: 76.84, change: 1.23, changePercent: 1.63, volume: 312000, marketCap: 0,
            sparklineData: generateSparkline(75.5, 1.2),
        },
        {
            symbol: 'NG=F', name: 'Natural Gas', type: 'commodity',
            price: 2.18, change: -0.08, changePercent: -3.54, volume: 145000, marketCap: 0,
            sparklineData: generateSparkline(2.26, 0.06),
        },
        {
            symbol: 'ZC=F', name: 'Corn', type: 'commodity',
            price: 4.52, change: 0.06, changePercent: 1.35, volume: 78000, marketCap: 0,
            sparklineData: generateSparkline(4.46, 0.08),
        },
        {
            symbol: 'ZW=F', name: 'Wheat', type: 'commodity',
            price: 5.98, change: -0.12, changePercent: -1.97, volume: 56000, marketCap: 0,
            sparklineData: generateSparkline(6.1, 0.1),
        },
        {
            symbol: 'KC=F', name: 'Coffee', type: 'commodity',
            price: 185.40, change: 3.20, changePercent: 1.76, volume: 34000, marketCap: 0,
            sparklineData: generateSparkline(182, 3),
        },
    ];
}

export function getMockCandleData(): {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}[] {
    const data = [];
    let price = 175;
    const now = new Date();

    for (let i = 60; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const open = price + (Math.random() - 0.5) * 3;
        const close = open + (Math.random() - 0.48) * 5;
        const high = Math.max(open, close) + Math.random() * 2;
        const low = Math.min(open, close) - Math.random() * 2;
        const volume = Math.floor(20000000 + Math.random() * 40000000);

        data.push({
            time: dateStr,
            open: parseFloat(open.toFixed(2)),
            high: parseFloat(high.toFixed(2)),
            low: parseFloat(low.toFixed(2)),
            close: parseFloat(close.toFixed(2)),
            volume,
        });

        price = close;
    }

    return data;
}
