import { NextRequest, NextResponse } from 'next/server';
import { dataAggregator } from '@/lib/dataManager/aggregator';

export const revalidate = 0;

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get('symbol');
    const resolution = searchParams.get('resolution') || 'D';
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const range = searchParams.get('range'); // '1D','1W','1M','3M','6M','1Y','ALL'

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    // Calculate from/to based on range if not explicitly provided
    const now = Math.floor(Date.now() / 1000);
    let fromTs: number;
    const toTs = to ? parseInt(to) : now;
    let autoResolution = resolution;

    if (range) {
        switch (range) {
            case '1D':
                fromTs = now - 86400;
                autoResolution = '5';
                break;
            case '1W':
                fromTs = now - 7 * 86400;
                autoResolution = '15';
                break;
            case '1M':
                fromTs = now - 30 * 86400;
                autoResolution = 'D';
                break;
            case '3M':
                fromTs = now - 90 * 86400;
                autoResolution = 'D';
                break;
            case '6M':
                fromTs = now - 180 * 86400;
                autoResolution = 'D';
                break;
            case '1Y':
                fromTs = now - 365 * 86400;
                autoResolution = 'W';
                break;
            case 'ALL':
                fromTs = now - 5 * 365 * 86400;
                autoResolution = 'W';
                break;
            default:
                fromTs = now - 60 * 86400;
                autoResolution = 'D';
        }
    } else {
        fromTs = from ? parseInt(from) : now - 60 * 86400;
    }

    try {
        const candles = await dataAggregator.getCandles(symbol, autoResolution, fromTs, toTs);

        return NextResponse.json({
            success: true,
            symbol,
            resolution: autoResolution,
            range: range || null,
            data: candles,
            count: candles.length,
        });
    } catch (error) {
        console.error('[api/proxy/candles] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch candle data' },
            { status: 500 }
        );
    }
}
