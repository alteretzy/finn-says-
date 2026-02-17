import { NextRequest, NextResponse } from 'next/server';

const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

export async function GET(request: NextRequest) {
    const symbol = request.nextUrl.searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const res = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
        );

        if (!res.ok) {
            throw new Error(`Finnhub API error: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Finnhub proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch quote' },
            { status: 500 }
        );
    }
}
