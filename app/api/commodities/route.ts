
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

const COMMODITIES = [
    { symbol: 'CL=F', name: 'Crude Oil (WTI)', unit: 'barrel' },
    { symbol: 'BZ=F', name: 'Brent Crude', unit: 'barrel' },
    { symbol: 'NG=F', name: 'Natural Gas', unit: 'MMBtu' },
    { symbol: 'ZW=F', name: 'Wheat', unit: 'bushel' },
    { symbol: 'ZC=F', name: 'Corn', unit: 'bushel' },
    { symbol: 'ZS=F', name: 'Soybeans', unit: 'bushel' },
    { symbol: 'KC=F', name: 'Coffee', unit: 'lb' },
    { symbol: 'CT=F', name: 'Cotton', unit: 'lb' },
];

export async function GET() {
    try {
        const results = await Promise.allSettled(
            COMMODITIES.map(c => yahooFinance.quote(c.symbol))
        );

        const formatted = results.map((r, i) => {
            if (r.status === 'rejected') return {
                ...COMMODITIES[i], type: 'Commodity', price: 0, change24h: 0
            };

            const q = r.value;
            return {
                symbol: COMMODITIES[i].symbol,
                name: COMMODITIES[i].name,
                unit: COMMODITIES[i].unit,
                type: 'Commodity',
                price: q.regularMarketPrice ?? 0,
                change24h: q.regularMarketChangePercent ?? 0,
                change: q.regularMarketChange ?? 0,
                volume: q.regularMarketVolume ?? 0,
                high: q.regularMarketDayHigh ?? 0,
                low: q.regularMarketDayLow ?? 0,
                marketCap: 0,
            };
        });

        return NextResponse.json(formatted, {
            headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' }
        });

    } catch {
        return NextResponse.json(
            { error: 'Failed to fetch commodities' },
            { status: 500 }
        );
    }
}
