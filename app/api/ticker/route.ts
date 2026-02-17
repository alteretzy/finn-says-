
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// These power the top live ticker bar
const TICKER_SYMBOLS = [
    'BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD',
    'AAPL', 'TSLA', 'NVDA', 'MSFT'
];

export async function GET() {
    try {
        const results = await Promise.allSettled(
            TICKER_SYMBOLS.map(s => yahooFinance.quote(s))
        );

        const data = results
            .map((r, i) => {
                if (r.status === 'rejected') return null;
                const q = r.value;
                return {
                    symbol: TICKER_SYMBOLS[i],
                    name: q.shortName || q.symbol,
                    price: q.regularMarketPrice ?? 0,
                    change: q.regularMarketChange ?? 0,
                    changePercent: q.regularMarketChangePercent ?? 0,
                };
            })
            .filter(Boolean);

        return NextResponse.json(data, {
            headers: { 'Cache-Control': 's-maxage=15, stale-while-revalidate=30' }
        });

    } catch {
        return NextResponse.json([], { status: 200 });
    }
}
