'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import { formatTime } from '@/lib/utils/formatters';
import { YahooNewsItem } from '@/lib/yahoo/client';

function getThumbUrl(item: YahooNewsItem): string {
    if (item.thumbnail && item.thumbnail.resolutions && item.thumbnail.resolutions.length > 0) {
        // Find the best quality resolution or just the first one
        return item.thumbnail.resolutions[0].url;
    }
    return '';
}

export default function NewsSection() {
    const [news, setNews] = useState<YahooNewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch('/api/news?count=4');
                if (!res.ok) throw new Error('Failed to fetch news');
                const data = await res.json();
                setNews(data);
            } catch (err) {
                console.error('News fetch error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }
        fetchNews();
    }, []);

    if (loading) {
        return (
            <section className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
                    ))}
                </div>
            </section>
        );
    }

    if (error || news.length === 0) {
        return (
            <div className="py-12 text-center text-white/30 text-sm border border-white/5 rounded-2xl">
                No market news available at the moment.
            </div>
        );
    }

    return (
        <section className="w-full">
            <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <h2 className="text-xl md:text-2xl font-light text-white tracking-wide">Market News</h2>
                </div>
                <Link href="/news" className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest">
                    View All →
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {news.slice(0, 4).map((item, i) => {
                    const thumb = getThumbUrl(item);
                    return (
                        <FadeIn key={item.uuid} delay={i * 0.1}>
                            <Link
                                href={`/news/${item.uuid}?title=${encodeURIComponent(item.title)}&publisher=${encodeURIComponent(item.publisher)}&time=${item.providerPublishTime}&img=${encodeURIComponent(thumb)}&link=${encodeURIComponent(item.link)}`}
                                className="group block h-full"
                            >
                                <Card className="h-full flex flex-col !p-0 bg-[#0A0A15]/60 hover:bg-[#0F0F20]/80 transition-all duration-300 border-white/5 hover:border-white/10" noPadding>
                                    <div className="relative h-44 overflow-hidden rounded-t-2xl">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                        {thumb ? (
                                            <Image
                                                src={thumb}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#0055FF]/10 to-transparent" />
                                        )}
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="text-[9px] uppercase tracking-widest text-white/70 font-medium bg-white/5 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                                                {item.publisher}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h3 className="text-[15px] font-medium text-white/90 leading-snug mb-4 group-hover:text-[#0055FF] transition-colors line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <div className="mt-auto flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-[10px] text-white/40 font-light">
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <circle cx="6" cy="6" r="5" />
                                                    <path d="M6 3v3h2.5" />
                                                </svg>
                                                {item.providerPublishTime ? formatTime(new Date(item.providerPublishTime * 1000)) : 'Recently'}
                                            </div>
                                            <span className="text-[10px] text-[#0055FF] opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                                Read More
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </FadeIn>
                    );
                })}
            </div>
        </section>
    );
}
