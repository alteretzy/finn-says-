
import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

// Yahoo Finance symbols for metals
const METALS = [
    { symbol: 'GC=F', name: 'Gold', unit: 'oz' },
    { symbol: 'SI=F', name: 'Silver', unit: 'oz' },
    { symbol: 'PL=F', name: 'Platinum', unit: 'oz' },
    { symbol: 'PA=F', name: 'Palladium', unit: 'oz' },
    { symbol: 'HG=F', name: 'Copper', unit: 'lb' },
];

export async function GET() {
    try {
        const results = await Promise.allSettled(
            METALS.map(m => yahooFinance.quote(m.symbol))
        );

        const formatted = results.map((r, i) => {
            if (r.status === 'rejected') return {
                ...METALS[i],
                type: 'Metal',
                price: 0,
                change24h: 0,
                volume: 0,
                marketCap: 0,
            };

            const q = r.value;
            return {
                symbol: METALS[i].symbol,
                name: METALS[i].name,
                unit: METALS[i].unit,
                type: 'Metal',
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
            { error: 'Failed to fetch metals' },
            { status: 500 }
        );
    }
}
