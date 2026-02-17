'use client';

import { useState, useEffect } from 'react';
import FadeIn from '@/components/animations/FadeIn';

interface YahooNewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
    thumbnail?: {
        resolutions: { url: string; width: number; height: number }[];
    };
    relatedTickers?: string[];
}

export default function LiveNewsWire({ initialNews }: { initialNews: YahooNewsItem[] }) {
    const [news, setNews] = useState<YahooNewsItem[]>(initialNews);

    // Simulate incoming news stream (in a real app, this would be a websocket)
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                // Fetch latest news to prepend (simulated refresh)
                const res = await fetch('/api/news?q=market&count=1');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setNews(prev => {
                            // Only add if new
                            if (prev.some(n => n.uuid === data[0].uuid)) return prev;
                            return [data[0], ...prev.slice(0, 49)]; // Keep max 50 items
                        });
                    }
                }
            } catch {
                // ignore
            }
        }, 15000); // Check every 15s

        return () => clearInterval(interval);
    }, []);

    const getSentimentColor = (title: string) => {
        const t = title.toLowerCase();
        if (t.includes('surge') || t.includes('jump') || t.includes('plunge') || t.includes('record')) {
            return t.includes('surge') || t.includes('jump') || t.includes('high') ? 'text-emerald-400' : 'text-red-400';
        }
        return 'text-white/80';
    };

    return (
        <div className="space-y-px">
            {news.map((item, i) => (
                <FadeIn key={item.uuid} delay={i * 0.02}>
                    <div className="group relative flex items-start gap-4 p-4 hover:bg-white/[0.04] transition-colors border-b border-white/[0.06]">
                        {/* Time */}
                        <div className="hidden sm:block w-24 flex-shrink-0 text-right">
                            <span className="text-xs text-white/40 font-mono">
                                {new Date(item.providerPublishTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] bg-white/10 text-white/60 px-1.5 py-0.5 rounded uppercase font-medium">
                                    {item.publisher}
                                </span>
                                {item.relatedTickers && item.relatedTickers.length > 0 && (
                                    <div className="flex gap-1">
                                        {item.relatedTickers.slice(0, 3).map(ticker => (
                                            <span key={ticker} className="text-[10px] text-[#0055FF] font-medium cursor-pointer hover:underline">
                                                ${ticker}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <a href={item.link} target="_blank" rel="noreferrer" className="block group-hover:translate-x-1 transition-transform duration-300">
                                <h3 className={`text-sm md:text-base font-light leading-snug ${getSentimentColor(item.title)} group-hover:text-white transition-colors`}>
                                    {item.title}
                                </h3>
                            </a>
                        </div>

                        {/* Mobile Time */}
                        <div className="sm:hidden absolute top-4 right-4 text-[10px] text-white/50">
                            {new Date(item.providerPublishTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </FadeIn>
            ))}
        </div>
    );
}
