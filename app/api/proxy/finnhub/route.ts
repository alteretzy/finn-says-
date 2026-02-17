import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const ALLOWED_ENDPOINTS = [
        'quote',
        'stock/candle',
        'stock/profile2',
        'company-news',
        'news',
        'search',
        'stock/symbol'
    ];
    const searchParams = request.nextUrl.searchParams;
    const endpoint = searchParams.get('endpoint');

    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint is required' }, { status: 400 });
    }

    // Validate endpoint allowlist
    if (!ALLOWED_ENDPOINTS.some(allowed => endpoint.startsWith(allowed))) {
        return NextResponse.json({ error: 'Invalid or unauthorized endpoint' }, { status: 403 });
    }

    const apiKey = process.env.FINNHUB_API_KEY || process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'Server configuration error: No API Key' }, { status: 500 });
    }

    // Construct upstream URL
    // Finnhub base: https://finnhub.io/api/v1
    const baseUrl = 'https://finnhub.io/api/v1';
    let url = `${baseUrl}/${endpoint}?token=${apiKey}`;

    // Append other query params (like symbol, resolution, etc.)
    searchParams.forEach((value, key) => {
        if (key !== 'endpoint' && key !== 'token') {
            url += `&${key}=${value}`;
        }
    });

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return NextResponse.json({ error: `Finnhub API error: ${res.statusText}` }, { status: res.status });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ error: 'Proxy failed' }, { status: 500 });
    }
}
