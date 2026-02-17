import { NextRequest, NextResponse } from 'next/server';
import { coinGeckoClient } from '@/lib/coingecko/client';
import { getQuote } from '@/lib/finnhub/api';

export const revalidate = 0; // No caching for real-time quotes

// ── Symbol → CoinGecko ID mapping ────────────────
const CRYPTO_MAP: Record<string, string> = {
    'BTC-USD': 'bitcoin',
    'ETH-USD': 'ethereum',
    'BNB-USD': 'binancecoin',
    'SOL-USD': 'solana',
    'XRP-USD': 'ripple',
    'ADA-USD': 'cardano',
    'DOGE-USD': 'dogecoin',
    'DOT-USD': 'polkadot',
    'AVAX-USD': 'avalanche',
    'LINK-USD': 'chainlink',
    'MATIC-USD': 'matic-network',
    'LTC-USD': 'litecoin',
    'UNI-USD': 'uniswap',
    'XLM-USD': 'stellar',
    'ATOM-USD': 'cosmos',
    'NEAR-USD': 'near',
    'APT-USD': 'aptos',
    'ARB-USD': 'arbitrum',
    'OP-USD': 'optimism',
    'AAVE-USD': 'aave',
    'GRT-USD': 'the-graph',
    'FIL-USD': 'filecoin',
    'RNDR-USD': 'render',
    'INJ-USD': 'injective',
    'SUI-USD': 'sui',
    'TON-USD': 'toncoin',
    'SHIB-USD': 'shiba-inu',
    'PEPE-USD': 'pepe',
    'ICP-USD': 'internet-computer',
    'TRX-USD': 'tron',
};

// ── Commodity/Metal → Finnhub OANDA mapping ──────
const COMMODITY_MAP: Record<string, string> = {
    'CL=F': 'OANDA:BCO_USD',
    'BZ=F': 'OANDA:BCO_USD',
    'NG=F': 'OANDA:NATGAS_USD',
    'GC=F': 'OANDA:XAU_USD',
    'SI=F': 'OANDA:XAG_USD',
    'PL=F': 'OANDA:XPT_USD',
    'PA=F': 'OANDA:XPD_USD',
    'HG=F': 'OANDA:XCU_USD',
    'ZC=F': 'OANDA:CORN_USD',
    'ZW=F': 'OANDA:WHEAT_USD',
    'ZS=F': 'OANDA:SOYBN_USD',
    'KC=F': 'OANDA:COFFEE_USD',
    'CT=F': 'OANDA:COTTON_USD',
    'SB=F': 'OANDA:SUGAR_USD',
    'CC=F': 'OANDA:COCOA_USD',
};

export async function GET(request: NextRequest) {
    const { searchParams } = request.nextUrl;
    const symbol = searchParams.get('symbol');

    if (!symbol) {
        return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        // ── 1. Crypto → CoinGecko ────────────────────
        const coinId = CRYPTO_MAP[symbol];
        if (coinId) {
            try {
                const data = await coinGeckoClient.getSimplePrice(
                    [coinId],
                    'usd',
                    true
                );
                const coin = data[coinId];
                if (coin && coin.usd) {
                    const price = coin.usd;
                    const changePct = coin.usd_24h_change ?? 0;
                    const changeAbs = price * (changePct / 100);
                    return NextResponse.json({
                        c: price,            // current
                        d: changeAbs,        // change
                        dp: changePct,       // change %
                        h: price,            // high (approx)
                        l: price,            // low (approx)
                        o: price - changeAbs,// open (approx)
                        pc: price - changeAbs// prev close (approx)
                    });
                }
            } catch (e) {
                console.error('[quote] CoinGecko failed for', symbol, e);
            }
            // Crypto with no data — return 404, don't fall through to stock API
            return NextResponse.json({ error: 'Crypto quote unavailable' }, { status: 404 });
        }

        // ── 2. Commodity/Metal → Finnhub OANDA ───────
        const mappedSymbol = COMMODITY_MAP[symbol] || symbol;

        // ── 3. Stock / Mapped symbol → Finnhub ───────
        const quote = await getQuote(mappedSymbol);
        if (!quote || !quote.c) {
            return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
        }

        return NextResponse.json(quote);

    } catch (error) {
        console.error('[quote] Error fetching quote:', error);
        return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
    }
}
