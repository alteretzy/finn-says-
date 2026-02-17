// ── Finnhub API Types ──────────────────────────

export interface FinnhubQuote {
    c: number;   // Current price
    d: number;   // Change
    dp: number;  // Percent change
    h: number;   // High price of the day
    l: number;   // Low price of the day
    o: number;   // Open price of the day
    pc: number;  // Previous close price
    t: number;   // Timestamp
}

export interface FinnhubCompanyProfile {
    country: string;
    currency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
}

export interface FinnhubCandles {
    c: number[]; // Close prices
    h: number[]; // High prices
    l: number[]; // Low prices
    o: number[]; // Open prices
    s: string;   // Status
    t: number[]; // Timestamps
    v: number[]; // Volumes
}

export interface FinnhubTrade {
    p: number; // Price
    s: string; // Symbol
    t: number; // Timestamp
    v: number; // Volume
}

// ── App Types ──────────────────────────────────

export interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export interface AssetData {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    open: number;
    high: number;
    low: number;
    previousClose: number;
    volume: number;
    marketCap: number;
    peRatio?: number;
    sector?: string;
    industry?: string;
    description?: string;
    website?: string;
    historicalData: CandleData[];
}

export interface AnalystRecommendation {
    buy: number;
    hold: number;
    period: string;
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: string;
}

export interface MarketAsset {
    symbol: string;
    name: string;
    type: 'stock' | 'crypto' | 'commodity' | 'metal';
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap: number;
    sparklineData: number[];
    sector?: string;
}
