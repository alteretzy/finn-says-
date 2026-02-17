import FadeIn from '@/components/animations/FadeIn';

const TESTIMONIALS = [
    {
        quote: "FinnSays provides institutional-grade data with retail-friendly UX. It's my go-to for quick market checks.",
        author: "Sarah Jenkins",
        role: "Financial Analyst",
    },
    {
        quote: "The programmatic SEO pages are a game changer. Finding specific asset data has never been faster.",
        author: "David Chen",
        role: "Day Trader",
    },
    {
        quote: "Clean, fast, and accurate. The real-time WebSocket updates are incredibly responsive.",
        author: "Elena Rodriguez",
        role: "Portfolio Manager",
    },
];

export default function Testimonials() {
    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0055FF]/10 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[128px]" />

            <div className="container mx-auto px-6 relative z-10">
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-light mb-4 text-white">Trusted by Traders</h2>
                        <p className="text-white/50">Join thousands of users who rely on FinnSays for market intelligence.</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((t, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="bg-white/[0.02] border border-white/[0.06] p-8 rounded-2xl relative group hover:bg-white/[0.04] transition-colors">
                                <div className="text-4xl text-[#0055FF]/20 absolute top-6 left-6 font-serif">&ldquo;</div>
                                <p className="text-white/70 italic mb-6 relative z-10 pt-4 leading-relaxed">
                                    {t.quote}
                                </p>
                                <div>
                                    <p className="font-medium text-white">{t.author}</p>
                                    <p className="text-xs text-emerald-400 uppercase tracking-wider">{t.role}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
