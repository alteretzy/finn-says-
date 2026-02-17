/**
 * Alpha Vantage API Client
 * Technical indicators, fundamentals, and financial statements
 * Free tier: 5 req/min, 500 req/day
 */

import { APIError, RateLimitError, withRetry } from '@/lib/errors/handler';

const BASE_URL = 'https://www.alphavantage.co/query';

export class AlphaVantageClient {
    private apiKey: string;
    private enabled: boolean;

    constructor() {
        this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
        this.enabled = this.apiKey.length > 0;
    }

    get isEnabled(): boolean {
        return this.enabled;
    }

    private async request<T>(params: Record<string, string>): Promise<T> {
        if (!this.enabled) {
            throw new APIError('Alpha Vantage API key not configured', 401, 'alphaVantage', false);
        }

        const url = new URL(BASE_URL);
        url.searchParams.append('apikey', this.apiKey);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString(), { next: { revalidate: 300 } });

        if (!response.ok) {
            throw new APIError(`Alpha Vantage HTTP ${response.status}`, response.status, 'alphaVantage');
        }

        const data = await response.json();

        // Alpha Vantage returns rate limit errors in the response body
        if (data['Note']?.includes('call frequency')) {
            throw new RateLimitError('alphaVantage', Date.now() + 60000);
        }
        if (data['Error Message']) {
            throw new APIError(data['Error Message'], 400, 'alphaVantage', false);
        }

        return data;
    }

    /** Get company overview / fundamentals */
    async getOverview(symbol: string) {
        return withRetry(() =>
            this.request<AlphaVantageOverview>({ function: 'OVERVIEW', symbol })
        );
    }

    /** Get daily adjusted OHLCV */
    async getDaily(symbol: string, outputSize: 'compact' | 'full' = 'compact') {
        return withRetry(() =>
            this.request<Record<string, unknown>>({
                function: 'TIME_SERIES_DAILY_ADJUSTED',
                symbol,
                outputsize: outputSize,
            })
        );
    }

    /** Get SMA (Simple Moving Average) */
    async getSMA(symbol: string, interval = 'daily', timePeriod = 20, seriesType = 'close') {
        return this.request<Record<string, unknown>>({
            function: 'SMA',
            symbol,
            interval,
            time_period: timePeriod.toString(),
            series_type: seriesType,
        });
    }

    /** Get RSI (Relative Strength Index) */
    async getRSI(symbol: string, interval = 'daily', timePeriod = 14, seriesType = 'close') {
        return this.request<Record<string, unknown>>({
            function: 'RSI',
            symbol,
            interval,
            time_period: timePeriod.toString(),
            series_type: seriesType,
        });
    }

    /** Get MACD */
    async getMACD(symbol: string, interval = 'daily', seriesType = 'close') {
        return this.request<Record<string, unknown>>({
            function: 'MACD',
            symbol,
            interval,
            series_type: seriesType,
        });
    }

    /** Get income statement */
    async getIncomeStatement(symbol: string) {
        return this.request<Record<string, unknown>>({ function: 'INCOME_STATEMENT', symbol });
    }

    /** Get balance sheet */
    async getBalanceSheet(symbol: string) {
        return this.request<Record<string, unknown>>({ function: 'BALANCE_SHEET', symbol });
    }

    /** Get earnings */
    async getEarnings(symbol: string) {
        return this.request<Record<string, unknown>>({ function: 'EARNINGS', symbol });
    }
}

// Type for company overview
export interface AlphaVantageOverview {
    Symbol: string;
    AssetType: string;
    Name: string;
    Description: string;
    Exchange: string;
    Currency: string;
    Country: string;
    Sector: string;
    Industry: string;
    MarketCapitalization: string;
    PERatio: string;
    PEGRatio: string;
    BookValue: string;
    DividendPerShare: string;
    DividendYield: string;
    EPS: string;
    ProfitMargin: string;
    OperatingMarginTTM: string;
    ReturnOnAssetsTTM: string;
    ReturnOnEquityTTM: string;
    RevenueTTM: string;
    GrossProfitTTM: string;
    Beta: string;
    '52WeekHigh': string;
    '52WeekLow': string;
    '50DayMovingAverage': string;
    '200DayMovingAverage': string;
    AnalystTargetPrice: string;
    AnalystRatingStrongBuy: string;
    AnalystRatingBuy: string;
    AnalystRatingHold: string;
    AnalystRatingSell: string;
    AnalystRatingStrongSell: string;
}

// Singleton
export const alphaVantageClient = new AlphaVantageClient();
