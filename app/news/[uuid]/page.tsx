import Image from 'next/image';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ uuid: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}

export async function generateMetadata({ searchParams }: PageProps) {
    const sp = await searchParams;
    const title = sp.title || 'News Article';
    return {
        title: `${title} | FinnSays`,
        description: `Read the latest: ${title}`,
    };
}

export default async function NewsArticlePage({ params, searchParams }: PageProps) {
    const { uuid } = await params;
    const sp = await searchParams;

    const title = sp.title || 'News Article';
    const publisher = sp.publisher || 'Unknown';
    const time = sp.time ? parseInt(sp.time) : Date.now() / 1000;
    const img = sp.img || '';
    const externalLink = sp.link || '#';

    const date = new Date(time * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <main className="min-h-screen bg-black">
            {/* Hero Image */}
            {img && (
                <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-10" />
                    <Image
                        src={img}
                        alt={title}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                </div>
            )}

            {/* Content */}
            <div className="relative max-w-3xl mx-auto px-6 md:px-12 -mt-20 z-20">
                {/* Publisher badge */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#0055FF] font-semibold bg-[#0055FF]/10 border border-[#0055FF]/20 px-3 py-1 rounded-full">
                        {publisher}
                    </span>
                    <span className="text-xs text-white/30">
                        {formattedDate} &middot; {formattedTime}
                    </span>
                </div>

                {/* Headline */}
                <h1 className="text-3xl md:text-5xl font-light text-white leading-tight tracking-tight mb-8">
                    {title}
                </h1>

                {/* Divider */}
                <div className="w-12 h-px bg-white/10 mb-8" />

                {/* Summary / Body placeholder */}
                <div className="space-y-6 mb-12">
                    <p className="text-white/50 text-lg font-light leading-relaxed">
                        This article was originally published by <span className="text-white/70">{publisher}</span>.
                        Click the button below to read the full story on the original source.
                    </p>
                </div>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
                    <a
                        href={externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0055FF] hover:bg-[#0044DD] text-white text-sm font-medium px-6 py-3 rounded-lg transition-colors"
                    >
                        Read Full Article
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                    </a>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 text-sm transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Bottom border */}
                <div className="border-t border-white/5 pt-8 pb-16">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/20">
                        Article ID: {uuid}
                    </p>
                </div>
            </div>
        </main>
    );
}
