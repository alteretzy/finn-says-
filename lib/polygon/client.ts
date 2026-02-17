/**
 * Polygon.io API Client (Optional)
 * High-frequency data, aggregates, snapshots
 * Gracefully degrades when API key not configured
 */

import { APIError, RateLimitError, withRetry } from '@/lib/errors/handler';

const BASE_URL = 'https://api.polygon.io';

export class PolygonClient {
    private apiKey: string;
    private enabled: boolean;

    constructor() {
        this.apiKey = process.env.POLYGON_API_KEY || '';
        this.enabled = this.apiKey.length > 0;
    }

    get isEnabled(): boolean {
        return this.enabled;
    }

    private async request<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
        if (!this.enabled) {
            throw new APIError('Polygon API key not configured', 401, 'polygon', false);
        }

        const url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.append('apiKey', this.apiKey);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, value);
            });
        }

        const response = await fetch(url.toString(), { next: { revalidate: 60 } });

        if (response.status === 429) {
            throw new RateLimitError('polygon', Date.now() + 60000);
        }

        if (!response.ok) {
            throw new APIError(
                `Polygon HTTP ${response.status}: ${response.statusText}`,
                response.status,
                'polygon'
            );
        }

        return response.json();
    }

    /** Get aggregate bars (OHLCV) */
    async getAggregates(
        ticker: string,
        multiplier: number,
        timespan: 'minute' | 'hour' | 'day' | 'week' | 'month',
        from: string,
        to: string
    ): Promise<PolygonAggregatesResponse> {
        return withRetry(() =>
            this.request<PolygonAggregatesResponse>(
                `/v2/aggs/ticker/${ticker}/range/${multiplier}/${timespan}/${from}/${to}`,
                { adjusted: 'true', sort: 'asc', limit: '50000' }
            )
        );
    }

    /** Get single ticker snapshot */
    async getSnapshot(ticker: string): Promise<PolygonSnapshotResponse> {
        return withRetry(() =>
            this.request<PolygonSnapshotResponse>(
                `/v2/snapshot/locale/us/markets/stocks/tickers/${ticker}`
            )
        );
    }

    /** Get previous day's close */
    async getPreviousClose(ticker: string): Promise<PolygonPrevCloseResponse> {
        return withRetry(() =>
            this.request<PolygonPrevCloseResponse>(
                `/v2/aggs/ticker/${ticker}/prev`,
                { adjusted: 'true' }
            )
        );
    }

    /** Get market status */
    async getMarketStatus(): Promise<PolygonMarketStatus> {
        return this.request<PolygonMarketStatus>('/v1/marketstatus/now');
    }
}

// ── Types ──────────────────────────────────────────

export interface PolygonAggregatesResponse {
    ticker: string;
    queryCount: number;
    resultsCount: number;
    adjusted: boolean;
    results?: PolygonBar[];
    status: string;
    request_id: string;
}

export interface PolygonBar {
    v: number;   // Volume
    vw: number;  // Volume weighted average price
    o: number;   // Open
    c: number;   // Close
    h: number;   // High
    l: number;   // Low
    t: number;   // Timestamp (ms)
    n: number;   // Number of transactions
}

export interface PolygonSnapshotResponse {
    status: string;
    ticker: {
        ticker: string;
        todaysChange: number;
        todaysChangePerc: number;
        day: { o: number; h: number; l: number; c: number; v: number; vw: number };
        prevDay: { o: number; h: number; l: number; c: number; v: number; vw: number };
        lastTrade: { p: number; s: number; t: number };
        min: { av: number; t: number; n: number; o: number; h: number; l: number; c: number; v: number; vw: number };
        updated: number;
    };
}

export interface PolygonPrevCloseResponse {
    ticker: string;
    results?: PolygonBar[];
    status: string;
}

export interface PolygonMarketStatus {
    market: string;       // 'open' | 'closed' | 'extended-hours'
    serverTime: string;
    exchanges: Record<string, string>;
    currencies: Record<string, string>;
}

// Singleton
export const polygonClient = new PolygonClient();
