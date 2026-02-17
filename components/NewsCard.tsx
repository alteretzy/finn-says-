
'use client';

import Image from 'next/image';
import { useNews } from '@/hooks/useNews';

function timeAgo(dateString: string) {
    const now = new Date();
    const then = new Date(dateString);
    const diff = Math.floor((now.getTime() - then.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function NewsFeed({ symbol }: { symbol?: string }) {
    const { news, loading, error } = useNews(symbol);

    if (loading) return (
        <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-gray-800 rounded w-1/2" />
                </div>
            ))}
        </div>
    );

    if (error) return (
        <p className="text-red-400 text-sm">Failed to load news</p>
    );

    return (
        <div className="space-y-4">
            {news.map(item => (
                <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-3 group hover:bg-white/5 p-3 rounded-lg transition"
                >
                    {/* Thumbnail */}
                    {item.thumbnail && (
                        <div className="relative w-20 h-14 flex-shrink-0">
                            <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover rounded"
                                sizes="80px"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-blue-400 transition">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">{item.source}</span>
                            <span className="text-gray-600">·</span>
                            <span className="text-xs text-gray-500">
                                {timeAgo(item.publishedAt)}
                            </span>
                        </div>

                        {/* Related tickers */}
                        {item.relatedTickers.length > 0 && (
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {item.relatedTickers.slice(0, 3).map(ticker => (
                                    <span
                                        key={ticker}
                                        className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded"
                                    >
                                        ${ticker}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </a>
            ))}
        </div>
    );
}
