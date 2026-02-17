import { NextRequest, NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';

export const revalidate = 0;

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const quote = await dataAggregator.getQuote(symbol);

        if (!quote) {
            return NextResponse.json(
                { success: false, error: 'Quote not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: quote,
        });
    } catch (error) {
        console.error('[api/proxy/quote] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch quote' },
            { status: 500 }
        );
    }
}
