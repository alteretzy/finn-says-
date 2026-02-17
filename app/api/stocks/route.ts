
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const STOCKS = [
    'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA',
    'TSLA', 'META', 'JPM', 'V', 'JNJ',
    'WMT', 'XOM', 'BAC', 'PG', 'MA',
    'UNH', 'HD', 'CVX', 'ABBV', 'MRK'
];

export async function GET() {
    try {
        const results = await Promise.allSettled(
            STOCKS.map(symbol => yahooFinance.quote(symbol))
        );

        const formatted = results
            .map((r) => {
                if (r.status === 'rejected') return null;
                const q = r.value;
                return {
                    symbol: q.symbol,
                    name: q.shortName || q.longName || q.symbol,
                    type: 'Stock',
                    price: q.regularMarketPrice ?? 0,
                    change24h: q.regularMarketChangePercent ?? 0,
                    change: q.regularMarketChange ?? 0,
                    volume: q.regularMarketVolume ?? 0,
                    marketCap: q.marketCap ?? 0,
                    high: q.regularMarketDayHigh ?? 0,
                    low: q.regularMarketDayLow ?? 0,
                    open: q.regularMarketOpen ?? 0,
                    prevClose: q.regularMarketPreviousClose ?? 0,
                    exchange: q.fullExchangeName ?? '',
                    currency: q.currency ?? 'USD',
                };
            })
            .filter(Boolean);

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=60' }
        });

    } catch {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
