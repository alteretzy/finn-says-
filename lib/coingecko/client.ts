/**
 * CoinGecko API Client
 * Cryptocurrency market data, OHLC, charts, trending
 * Free tier: 10-50 req/min (no key needed), Pro: 500 req/min
 */

import { APIError, RateLimitError, withRetry } from '@/lib/errors/handler';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export class CoinGeckoClient {
    private apiKey?: string;

    constructor() {
        this.apiKey = process.env.COINGECKO_API_KEY || undefined;
    }

    private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        const url = new URL(`${BASE_URL}${endpoint}`);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const headers: HeadersInit = {
            Accept: 'application/json',
        };
        if (this.apiKey) {
            headers['x-cg-pro-api-key'] = this.apiKey;
        }

        const response = await fetch(url.toString(), {
            headers,
            next: { revalidate: 120 },
        });

        if (response.status === 429) {
            throw new RateLimitError('coingecko', Date.now() + 60000);
        }

        if (!response.ok) {
            throw new APIError(
                `CoinGecko HTTP ${response.status}: ${response.statusText}`,
                response.status,
                'coingecko'
            );
        }

        return response.json();
    }

    /** Get top coins by market cap with sparklines */
    async getMarkets(
        vsCurrency = 'usd',
        perPage = 100,
        page = 1,
        sparkline = true
    ): Promise<CoinGeckoMarket[]> {
        return withRetry(() =>
            this.request<CoinGeckoMarket[]>('/coins/markets', {
                vs_currency: vsCurrency,
                order: 'market_cap_desc',
                per_page: perPage.toString(),
                page: page.toString(),
                sparkline: sparkline.toString(),
                price_change_percentage: '24h,7d',
            })
        );
    }

    /** Get OHLC data for candlestick charts */
    async getOHLC(coinId: string, vsCurrency = 'usd', days: number | 'max' = 30): Promise<number[][]> {
        return withRetry(() =>
            this.request<number[][]>(`/coins/${coinId}/ohlc`, {
                vs_currency: vsCurrency,
                days: days.toString(),
            })
        );
    }

    /** Get market chart (price, volume, market cap arrays) */
    async getMarketChart(
        coinId: string,
        vsCurrency = 'usd',
        days: number | 'max' = 30
    ): Promise<CoinGeckoMarketChart> {
        return withRetry(() =>
            this.request<CoinGeckoMarketChart>(`/coins/${coinId}/market_chart`, {
                vs_currency: vsCurrency,
                days: days.toString(),
            })
        );
    }

    /** Get detailed coin info */
    async getCoin(coinId: string): Promise<CoinGeckoDetail> {
        return withRetry(() =>
            this.request<CoinGeckoDetail>(`/coins/${coinId}`, {
                localization: 'false',
                tickers: 'false',
                market_data: 'true',
                community_data: 'false',
                developer_data: 'false',
            })
        );
    }

    /** Get simple price (low-cost call) */
    async getSimplePrice(
        ids: string[],
        vsCurrencies = 'usd',
        include24hChange = true
    ): Promise<Record<string, CoinGeckoSimplePrice>> {
        return withRetry(() =>
            this.request<Record<string, CoinGeckoSimplePrice>>('/simple/price', {
                ids: ids.join(','),
                vs_currencies: vsCurrencies,
                include_24hr_change: include24hChange.toString(),
                include_24hr_vol: 'true',
                include_last_updated_at: 'true',
            })
        );
    }

    /** Get trending coins */
    async getTrending(): Promise<CoinGeckoTrending> {
        return withRetry(() => this.request<CoinGeckoTrending>('/search/trending'));
    }

    /** Get global crypto market data */
    async getGlobal(): Promise<CoinGeckoGlobal> {
        return withRetry(() => this.request<CoinGeckoGlobal>('/global'));
    }
}

// ── Types ──────────────────────────────────────────

export interface CoinGeckoMarket {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    sparkline_in_7d?: { price: number[] };
    price_change_percentage_24h_in_currency?: number;
    price_change_percentage_7d_in_currency?: number;
    last_updated: string;
}

export interface CoinGeckoMarketChart {
    prices: [number, number][];
    market_caps: [number, number][];
    total_volumes: [number, number][];
}

export interface CoinGeckoDetail {
    id: string;
    symbol: string;
    name: string;
    description: { en: string };
    market_data: {
        current_price: { usd: number };
        market_cap: { usd: number };
        total_volume: { usd: number };
        high_24h: { usd: number };
        low_24h: { usd: number };
        price_change_24h: number;
        price_change_percentage_24h: number;
        ath: { usd: number };
        atl: { usd: number };
        circulating_supply: number;
        total_supply: number | null;
        max_supply: number | null;
    };
}

export interface CoinGeckoSimplePrice {
    usd: number;
    usd_24h_change?: number;
    usd_24h_vol?: number;
    last_updated_at?: number;
}

export interface CoinGeckoTrending {
    coins: {
        item: {
            id: string;
            coin_id: number;
            name: string;
            symbol: string;
            market_cap_rank: number;
            thumb: string;
            small: string;
            large: string;
            slug: string;
            price_btc: number;
            score: number;
        };
    }[];
}

export interface CoinGeckoGlobal {
    data: {
        active_cryptocurrencies: number;
        markets: number;
        total_market_cap: Record<string, number>;
        total_volume: Record<string, number>;
        market_cap_percentage: Record<string, number>;
        market_cap_change_percentage_24h_usd: number;
        updated_at: number;
    };
}

// Singleton
export const coinGeckoClient = new CoinGeckoClient();
