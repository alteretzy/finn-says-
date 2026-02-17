export const SITE_NAME = 'FinnSays';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://finnsays.vercel.app';
export const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

export const ASSET_TYPES = ['All', 'Stocks', 'Crypto', 'Commodities', 'Metals'] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const TIME_RANGES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

export const RESOLUTION_MAP: Record<string, string> = {
    '1D': '5',
    '1W': '15',
    '1M': 'D',
    '3M': 'D',
    '1Y': 'W',
    ALL: 'M',
};
