import { NextResponse } from 'next/server';
import { getMarketData } from '@/lib/data/market-data';

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function GET() {
    try {
        const data = await getMarketData();
        return NextResponse.json({
            success: true,
            data,
            timestamp: Date.now(),
            source: 'finnhub+coingecko',
        });
    } catch (error) {
        console.error('[api/market-data] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch market data' },
            { status: 500 }
        );
    }
}
