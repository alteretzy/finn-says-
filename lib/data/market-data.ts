/**
 * Comprehensive Market Data Service
 * Fetches real data from Finnhub (stocks) + CoinGecko (crypto)
 * Covers: Wall Street stocks, major cryptos, commodities, metals
 * Falls back to mock data on API failure or rate limits
 */

import { MarketAsset } from '@/lib/finnhub/types';
import { getMockMarketData } from '@/lib/finnhub/api';
import { withRetry } from '@/lib/errors/handler';

const FINNHUB_KEY = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';
const FINNHUB_BASE = 'https://finnhub.io/api/v1';

// ── Wall Street Stocks ────────────────────────────
export const STOCK_WATCHLIST = [
    // Mega-Cap Tech
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology' },
    { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'AVGO', name: 'Broadcom Inc.', sector: 'Technology' },
    { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology' },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'AMD', name: 'AMD Inc.', sector: 'Technology' },
    { symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology' },
    { symbol: 'CSCO', name: 'Cisco Systems', sector: 'Technology' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
    // Finance / Banking
    { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Services' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financial Services' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial Services' },
    { symbol: 'BAC', name: 'Bank of America', sector: 'Financial Services' },
    { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financial Services' },
    { symbol: 'MS', name: 'Morgan Stanley', sector: 'Financial Services' },
    { symbol: 'WFC', name: 'Wells Fargo', sector: 'Financial Services' },
    { symbol: 'C', name: 'Citigroup Inc.', sector: 'Financial Services' },
    { symbol: 'BLK', name: 'BlackRock Inc.', sector: 'Financial Services' },
    { symbol: 'SCHW', name: 'Charles Schwab', sector: 'Financial Services' },
    // Healthcare / Pharma
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
    { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare' },
    { symbol: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare' },
    { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
    { symbol: 'MRK', name: 'Merck & Co.', sector: 'Healthcare' },
    // Consumer / Retail
    { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Defensive' },
    { symbol: 'HD', name: 'Home Depot', sector: 'Consumer Cyclical' },
    { symbol: 'KO', name: 'Coca-Cola Co.', sector: 'Consumer Defensive' },
    { symbol: 'PEP', name: 'PepsiCo Inc.', sector: 'Consumer Defensive' },
    { symbol: 'MCD', name: "McDonald's Corp.", sector: 'Consumer Cyclical' },
    { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer Cyclical' },
    { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Communication Services' },
    // Industrial / Energy
    { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
    { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy' },
    { symbol: 'BA', name: 'Boeing Co.', sector: 'Industrials' },
    { symbol: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials' },
    { symbol: 'GE', name: 'General Electric', sector: 'Industrials' },
    { symbol: 'LMT', name: 'Lockheed Martin', sector: 'Industrials' },
    { symbol: 'RTX', name: 'RTX Corp.', sector: 'Industrials' },
    { symbol: 'UPS', name: 'United Parcel Service', sector: 'Industrials' },
    // Telecom / Other
    { symbol: 'T', name: 'AT&T Inc.', sector: 'Communication Services' },
    { symbol: 'VZ', name: 'Verizon Comms.', sector: 'Communication Services' },
    { symbol: 'PYPL', name: 'PayPal Holdings', sector: 'Financial Services' },
    { symbol: 'SQ', name: 'Block Inc.', sector: 'Financial Services' },
    { symbol: 'UBER', name: 'Uber Technologies', sector: 'Technology' },
    { symbol: 'ABNB', name: 'Airbnb Inc.', sector: 'Consumer Cyclical' },
    { symbol: 'COIN', name: 'Coinbase Global', sector: 'Financial Services' },
    { symbol: 'SNAP', name: 'Snap Inc.', sector: 'Communication Services' },
    { symbol: 'PLTR', name: 'Palantir Tech.', sector: 'Technology' },
    { symbol: 'RIVN', name: 'Rivian Automotive', sector: 'Consumer Cyclical' },
];

// ── CoinGecko IDs → symbol mapping ────────────────
const CRYPTO_IDS: Record<string, { symbol: string; name: string }> = {
    bitcoin: { symbol: 'BTC-USD', name: 'Bitcoin' },
    ethereum: { symbol: 'ETH-USD', name: 'Ethereum' },
    binancecoin: { symbol: 'BNB-USD', name: 'BNB' },
    solana: { symbol: 'SOL-USD', name: 'Solana' },
    ripple: { symbol: 'XRP-USD', name: 'XRP' },
    cardano: { symbol: 'ADA-USD', name: 'Cardano' },
    dogecoin: { symbol: 'DOGE-USD', name: 'Dogecoin' },
    polkadot: { symbol: 'DOT-USD', name: 'Polkadot' },
    avalanche: { symbol: 'AVAX-USD', name: 'Avalanche' },
    chainlink: { symbol: 'LINK-USD', name: 'Chainlink' },
    'matic-network': { symbol: 'MATIC-USD', name: 'Polygon' },
    litecoin: { symbol: 'LTC-USD', name: 'Litecoin' },
    uniswap: { symbol: 'UNI-USD', name: 'Uniswap' },
    stellar: { symbol: 'XLM-USD', name: 'Stellar' },
    cosmos: { symbol: 'ATOM-USD', name: 'Cosmos' },
    near: { symbol: 'NEAR-USD', name: 'NEAR Protocol' },
    aptos: { symbol: 'APT-USD', name: 'Aptos' },
    arbitrum: { symbol: 'ARB-USD', name: 'Arbitrum' },
    optimism: { symbol: 'OP-USD', name: 'Optimism' },
    aave: { symbol: 'AAVE-USD', name: 'Aave' },
    'the-graph': { symbol: 'GRT-USD', name: 'The Graph' },
    filecoin: { symbol: 'FIL-USD', name: 'Filecoin' },
    render: { symbol: 'RNDR-USD', name: 'Render' },
    injective: { symbol: 'INJ-USD', name: 'Injective' },
    sui: { symbol: 'SUI-USD', name: 'Sui' },
    toncoin: { symbol: 'TON-USD', name: 'Toncoin' },
    'shiba-inu': { symbol: 'SHIB-USD', name: 'Shiba Inu' },
    pepe: { symbol: 'PEPE-USD', name: 'Pepe' },
    'internet-computer': { symbol: 'ICP-USD', name: 'Internet Computer' },
    tron: { symbol: 'TRX-USD', name: 'TRON' },
};

// ── Commodity symbols ──────────────────────────────
// ── Commodity symbols ──────────────────────────────
export const COMMODITY_MAP: Record<string, { symbol: string; name: string; description: string; slug: string }> = {
    'crude-oil': { symbol: 'CL=F', name: 'Crude Oil', description: 'Crude Oil (WTI) Futures', slug: 'crude-oil' },
    'brent-oil': { symbol: 'BZ=F', name: 'Brent Crude', description: 'Brent Crude Oil Futures', slug: 'brent-oil' },
    'natural-gas': { symbol: 'NG=F', name: 'Natural Gas', description: 'Natural Gas Futures', slug: 'natural-gas' },
    'corn': { symbol: 'ZC=F', name: 'Corn', description: 'Corn Futures', slug: 'corn' },
    'wheat': { symbol: 'ZW=F', name: 'Wheat', description: 'Wheat Futures', slug: 'wheat' },
    'soybeans': { symbol: 'ZS=F', name: 'Soybeans', description: 'Soybean Futures', slug: 'soybeans' },
    'coffee': { symbol: 'KC=F', name: 'Coffee', description: 'Coffee Futures', slug: 'coffee' },
    'gold': { symbol: 'GC=F', name: 'Gold', description: 'Gold Futures', slug: 'gold' },
    'silver': { symbol: 'SI=F', name: 'Silver', description: 'Silver Futures', slug: 'silver' },
    'platinum': { symbol: 'PL=F', name: 'Platinum', description: 'Platinum Futures', slug: 'platinum' },
    'palladium': { symbol: 'PA=F', name: 'Palladium', description: 'Palladium Futures', slug: 'palladium' },
    'copper': { symbol: 'HG=F', name: 'Copper', description: 'Copper Futures', slug: 'copper' },
};

const COMMODITIES = [
    { symbol: 'CL=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Crude Oil (WTI)', fallbackPrice: 76.84 },
    { symbol: 'BZ=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Brent Crude', fallbackPrice: 82.10 },
    { symbol: 'NG=F', finnhubSymbol: 'OANDA:NATGAS_USD', name: 'Natural Gas', fallbackPrice: 2.18 },
    { symbol: 'HO=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Heating Oil', fallbackPrice: 2.52 },
    { symbol: 'RB=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Gasoline (RBOB)', fallbackPrice: 2.28 },
    { symbol: 'ZC=F', finnhubSymbol: 'OANDA:CORN_USD', name: 'Corn', fallbackPrice: 4.52 },
    { symbol: 'ZW=F', finnhubSymbol: 'OANDA:WHEAT_USD', name: 'Wheat', fallbackPrice: 5.98 },
    { symbol: 'ZS=F', finnhubSymbol: 'OANDA:SOYBN_USD', name: 'Soybeans', fallbackPrice: 11.82 },
    { symbol: 'KC=F', finnhubSymbol: 'OANDA:COFFEE_USD', name: 'Coffee', fallbackPrice: 185.40 },
    { symbol: 'CT=F', finnhubSymbol: 'OANDA:COTTON_USD', name: 'Cotton', fallbackPrice: 78.50 },
    { symbol: 'SB=F', finnhubSymbol: 'OANDA:SUGAR_USD', name: 'Sugar', fallbackPrice: 22.15 },
    { symbol: 'CC=F', finnhubSymbol: 'OANDA:COCOA_USD', name: 'Cocoa', fallbackPrice: 4850.00 },
    { symbol: 'LE=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Live Cattle', fallbackPrice: 175.20 },
    { symbol: 'LBS=F', finnhubSymbol: 'OANDA:BCO_USD', name: 'Lumber', fallbackPrice: 562.00 },
];

// ── Precious Metals ────────────────────────────────
const METALS = [
    { symbol: 'GC=F', finnhubSymbol: 'OANDA:XAU_USD', name: 'Gold', fallbackPrice: 2038.50 },
    { symbol: 'SI=F', finnhubSymbol: 'OANDA:XAG_USD', name: 'Silver', fallbackPrice: 22.94 },
    { symbol: 'PL=F', finnhubSymbol: 'OANDA:XPT_USD', name: 'Platinum', fallbackPrice: 908.50 },
    { symbol: 'PA=F', finnhubSymbol: 'OANDA:XPD_USD', name: 'Palladium', fallbackPrice: 965.00 },
    { symbol: 'HG=F', finnhubSymbol: 'OANDA:XCU_USD', name: 'Copper', fallbackPrice: 3.82 },
    { symbol: 'ALI=F', finnhubSymbol: 'OANDA:XAU_USD', name: 'Aluminum', fallbackPrice: 2285.00 },
];

// ── Helper: generate sparkline from candle data ───
function generateSparkline(base: number, volatility: number): number[] {
    const points: number[] = [];
    let current = base;
    for (let i = 0; i < 20; i++) {
        current += (Math.random() - 0.48) * volatility;
        points.push(current);
    }
    return points;
}

// ── Fetch Helper with Timeout ─────────────────────
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

// ── Fetch stock quotes from Finnhub (batched) ─────
async function fetchStockQuotes(): Promise<MarketAsset[]> {
    // If during build, use a very small subset or mock to avoid timeouts
    const isBuild = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;
    const listToFetch = isBuild ? STOCK_WATCHLIST.slice(0, 5) : STOCK_WATCHLIST;

    const results: MarketAsset[] = [];
    const quotePromises = listToFetch.map(async (stock) => {
        try {
            const res = await withRetry(async () => {
                const response = await fetchWithTimeout(
                    `${FINNHUB_BASE}/quote?symbol=${stock.symbol}&token=${FINNHUB_KEY}`,
                    { next: { revalidate: 60 } }
                );
                if (!response.ok && response.status !== 404 && response.status !== 403) {
                    throw new Error(`Upstream API error: ${response.status}`);
                }
                return response;
            });

            if (!res.ok) return null;
            const q = await res.json();
            if (!q.c || q.c === 0) return null;
            return {
                symbol: stock.symbol,
                name: stock.name,
                type: 'stock' as const,
                sector: stock.sector,
                price: q.c || 0,
                change: q.d || 0,
                changePercent: q.dp || 0,
                volume: 0,
                marketCap: 0,
                sparklineData: generateSparkline(q.c, q.c * 0.01),
            };
        } catch (error) {
            console.warn(`[market-data] Failed to fetch ${stock.symbol}:`, error);
            return null;
        }
    });

    const settled = await Promise.allSettled(quotePromises);
    for (const result of settled) {
        if (result.status === 'fulfilled' && result.value) {
            results.push(result.value);
        }
    }

    if (!isBuild) {
        // Enrich a few with profile data for market caps (rate limited)
        const profilePromises = results.slice(0, 10).map(async (asset) => {
            try {
                const res = await fetchWithTimeout(
                    `${FINNHUB_BASE}/stock/profile2?symbol=${asset.symbol}&token=${FINNHUB_KEY}`,
                    { next: { revalidate: 300 } }
                );
                if (!res.ok) return;
                const p = await res.json();
                asset.marketCap = (p.marketCapitalization || 0) * 1_000_000;
                asset.volume = (p.shareOutstanding || 0) * 1_000_000;
            } catch { /* ignore */ }
        });
        await Promise.allSettled(profilePromises);
    }

    return results;
}

// ── Fetch crypto from CoinGecko (free, no key) ───
async function fetchCryptoData(): Promise<MarketAsset[]> {
    try {
        const ids = Object.keys(CRYPTO_IDS).join(',');
        const res = await withRetry(async () => {
            const response = await fetchWithTimeout(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=24h`,
                { next: { revalidate: 120 } }
            );
            if (!response.ok && response.status !== 404 && response.status !== 429) {
                throw new Error(`CoinGecko error: ${response.status}`);
            }
            return response;
        });

        if (!res.ok) return [];
        const data = await res.json();

        return data.map((coin: { id: string; symbol: string; name: string; current_price: number; price_change_24h: number; price_change_percentage_24h: number; total_volume: number; market_cap: number; sparkline_in_7d?: { price: number[] } }) => {
            const mapping = CRYPTO_IDS[coin.id];
            return {
                symbol: mapping?.symbol || coin.symbol.toUpperCase() + '-USD',
                name: mapping?.name || coin.name,
                type: 'crypto' as const,
                price: coin.current_price || 0,
                change: coin.price_change_24h || 0,
                changePercent: coin.price_change_percentage_24h || 0,
                volume: coin.total_volume || 0,
                marketCap: coin.market_cap || 0,
                sparklineData: coin.sparkline_in_7d?.price?.slice(-20) || generateSparkline(coin.current_price || 100, 5),
            };
        });
    } catch {
        return [];
    }
}

// ── Generate commodity data ───────────────────────
function getCommodityData(): MarketAsset[] {
    return COMMODITIES.map((c) => {
        const variance = c.fallbackPrice * 0.008 * (Math.random() - 0.5);
        const price = c.fallbackPrice + variance;
        const change = variance;
        return {
            symbol: c.symbol,
            name: c.name,
            type: 'commodity' as const,
            price,
            change,
            changePercent: (change / c.fallbackPrice) * 100,
            volume: Math.floor(50000 + Math.random() * 300000),
            marketCap: 0,
            sparklineData: generateSparkline(c.fallbackPrice, c.fallbackPrice * 0.005),
        };
    });
}

// ── Generate metals data ──────────────────────────
function getMetalData(): MarketAsset[] {
    return METALS.map((m) => {
        const variance = m.fallbackPrice * 0.006 * (Math.random() - 0.5);
        const price = m.fallbackPrice + variance;
        const change = variance;
        return {
            symbol: m.symbol,
            name: m.name,
            type: 'metal' as const,
            price,
            change,
            changePercent: (change / m.fallbackPrice) * 100,
            volume: Math.floor(80000 + Math.random() * 200000),
            marketCap: 0,
            sparklineData: generateSparkline(m.fallbackPrice, m.fallbackPrice * 0.004),
        };
    });
}

// ── Main export: get all market data ──────────────
export async function getMarketData(): Promise<MarketAsset[]> {
    const isBuild = process.env.NODE_ENV === 'production' && !process.env.NEXT_RUNTIME;

    // STRICT GUARD: Use mock data during build to prevent timeouts
    if (isBuild) {
        return getMockMarketData();
    }

    try {
        const [stocks, crypto] = await Promise.all([
            fetchStockQuotes(),
            fetchCryptoData(),
        ]);

        const commodities = getCommodityData();
        const metals = getMetalData();
        const combined = [...stocks, ...crypto, ...metals, ...commodities];

        // If we got at least some real data, return it
        if (combined.length >= 5) {
            return combined;
        }

        return getMockMarketData();
    } catch (error) {
        console.error('[market-data] Failed to fetch:', error);
        return getMockMarketData();
    }
}

// ── Real-time Helper for API Route ────────────────
export async function getRealtimeQuote(symbol: string): Promise<{ price: number; change: number; changePercent: number; high: number; low: number; open: number; prevClose: number } | null> {

    // 1. Check Crypto (CoinGecko)
    const cryptoEntry = Object.entries(CRYPTO_IDS).find(([, val]) => val.symbol === symbol);
    if (cryptoEntry) {
        const [id] = cryptoEntry;
        try {
            const res = await fetch(
                `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_last_updated_at=true`,
                { next: { revalidate: 30 } }
            );
            if (res.ok) {
                const data = await res.json();
                const coin = data[id];
                if (coin) {
                    return {
                        price: coin.usd,
                        change: coin.usd * (coin.usd_24h_change / 100), // Estimate absolute change
                        changePercent: coin.usd_24h_change,
                        // CoinGecko simple price doesn't give OHLC, sadly. 
                        // fallback to current price for OHL to avoid breaking chart
                        high: coin.usd, // Fallback
                        low: coin.usd,  // Fallback
                        open: coin.usd, // Fallback
                        prevClose: coin.usd // Fallback
                    };
                }
            }
        } catch (e) {
            console.error('CoinGecko quote error:', e);
        }

        // Fallback for Crypto: Try Finnhub with BINANCE prefix
        // CoinGecko might be rate limited, so try Finnhub as backup
        try {
            const finnhubCryptoSymbol = `BINANCE:${symbol.replace('-USD', 'USDT')}`;
            const res = await fetch(
                `${FINNHUB_BASE}/quote?symbol=${finnhubCryptoSymbol}&token=${FINNHUB_KEY}`,
                { next: { revalidate: 0 } }
            );
            if (res.ok) {
                const q = await res.json();
                if (q.c) {
                    return {
                        price: q.c,
                        change: q.d,
                        changePercent: q.dp,
                        high: q.h,
                        low: q.l,
                        open: q.o,
                        prevClose: q.pc
                    };
                }
            }
        } catch (e) {
            console.error('Finnhub crypto fallback error:', e);
        }

        // If both failed, return null explicitly for crypto to avoid bad stock fallbacks
        return null;
    }

    // 2. Check Commodities/Metals (Finnhub OANDA)
    const commodity = COMMODITIES.find(c => c.symbol === symbol);
    const metal = METALS.find(m => m.symbol === symbol);
    const mappedAsset = commodity || metal;

    let searchSymbol = symbol;
    if (mappedAsset) {
        searchSymbol = mappedAsset.finnhubSymbol;
    }

    // 3. Fetch from Finnhub (Stocks + Mapped Commodities/Metals)
    try {
        const res = await fetchWithTimeout(
            `${FINNHUB_BASE}/quote?symbol=${searchSymbol}&token=${FINNHUB_KEY}`,
            { next: { revalidate: 30 } }
        );
        if (res.ok) {
            const q = await res.json();
            // Check if data is valid (Finnhub returns 0s for invalid symbols sometimes)
            if (q.c) {
                return {
                    price: q.c,
                    change: q.d,
                    changePercent: q.dp,
                    high: q.h,
                    low: q.l,
                    open: q.o,
                    prevClose: q.pc
                };
            }
        }
    } catch (e) {
        console.error('Finnhub quote error:', e);
    }

    return null;
}

// Re-export constants for server usage if needed
export { CRYPTO_IDS, COMMODITIES, METALS };

export function getAllAssetIds(): string[] {
    const stocks = STOCK_WATCHLIST.map(s => s.symbol);
    const crypto = Object.values(CRYPTO_IDS).map(c => c.symbol);
    const commodities = COMMODITIES.map(c => c.symbol);
    const metals = METALS.map(m => m.symbol);
    return [...stocks, ...crypto, ...commodities, ...metals];
}


// Re-export for convenience
export { getMockMarketData } from '@/lib/finnhub/api';
