import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NewsItem {
    id: string;
    headline: string;
    source: string;
    datetime: number;
    summary: string;
    image: string;
    url: string;
}

export default function AssetNews({ symbol }: { symbol: string }) {
    const [news, setNews] = useState<NewsItem[]>([]);

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch(`/api/news?symbol=${symbol}&count=5`);
                if (!res.ok) throw new Error('Failed to fetch news');
                const data = await res.json();
                setNews(data);
            } catch (err) {
                console.error('News fetch error:', err);
            } finally {
                // Done
            }
        }
        fetchNews();
    }, [symbol]);

    return (
        <div className="space-y-3">
            {news.slice(0, 4).map((item) => (
                <Link
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 hover:border-white/10 hover:bg-white/[0.03] transition-all group"
                >
                    <div className="flex gap-4">
                        {item.image && (
                            <div className="hidden sm:block w-20 h-20 rounded-lg bg-white/5 overflow-hidden flex-shrink-0 relative">
                                <Image
                                    src={item.image}
                                    alt=""
                                    fill
                                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                    sizes="80px"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors mb-1 line-clamp-2">
                                {item.headline}
                            </h4>
                            <div className="flex items-center gap-3 text-[10px] text-white/50">
                                <span>{item.source}</span>
                                <span>•</span>
                                <span>{new Date(item.datetime * 1000).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.summary}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}
