
'use client';

import { useState, useEffect } from 'react';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    url: string;
    source: string;
    publishedAt: string;
    thumbnail: string | null;
    relatedTickers: string[];
}

export function useNews(symbol?: string) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchNews() {
            try {
                setLoading(true);
                const url = symbol
                    ? `/api/news?symbol=${symbol}`
                    : '/api/news';

                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch news');
                const data = await res.json();
                setNews(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        }

        fetchNews();
        // Refresh every 5 minutes
        const interval = setInterval(fetchNews, 300000);
        return () => clearInterval(interval);
    }, [symbol]);

    return { news, loading, error };
}
