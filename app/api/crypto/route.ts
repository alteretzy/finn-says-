
import { NextResponse } from 'next/server';

const COINS = [
    'bitcoin', 'ethereum', 'ripple', 'binancecoin', 'solana',
    'tron', 'dogecoin', 'cardano', 'chainlink', 'stellar',
    'avalanche-2', 'polkadot', 'uniswap', 'litecoin', 'polygon'
];

export async function GET() {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/coins/markets?` +
            `vs_currency=usd&ids=${COINS.join(',')}&order=market_cap_desc` +
            `&per_page=20&page=1&sparkline=true&price_change_percentage=24h,7d`,
            {
                headers: { 'Accept': 'application/json' },
                next: { revalidate: 60 } // Cache 60 seconds
            }
        );

        if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
        const data = await res.json();

        const formatted = data.map((coin: { symbol: string; name: string; current_price: number; price_change_percentage_24h: number; price_change_percentage_7d_in_currency: number; total_volume: number; market_cap: number; image: string; sparkline_in_7d?: { price: number[] }; market_cap_rank: number }) => ({
            symbol: `${coin.symbol.toUpperCase()}-USD`,
            name: coin.name,
            type: 'Crypto',
            price: coin.current_price,
            change24h: coin.price_change_percentage_24h,
            change7d: coin.price_change_percentage_7d_in_currency,
            volume: coin.total_volume,
            marketCap: coin.market_cap,
            image: coin.image,
            sparkline: coin.sparkline_in_7d?.price || [],
            rank: coin.market_cap_rank,
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error('Crypto API failed:', error);
        return NextResponse.json(
            { error: 'Failed to fetch crypto data' },
            { status: 500 }
        );
    }
}
