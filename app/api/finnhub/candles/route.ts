import { NextRequest, NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol || !from || !to) {
        return NextResponse.json(
            { error: 'symbol, from, and to parameters are required' },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${FINNHUB_API_KEY}`
        );

        if (!res.ok) {
            throw new Error(`Finnhub API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Finnhub candles proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch candle data' },
            { status: 500 }
        );
    }
}
