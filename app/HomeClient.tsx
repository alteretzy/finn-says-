'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';
import InfiniteTicker from '@/components/ui/InfiniteTicker';
import LiveMarketsSection from '@/components/data/LiveMarketsSection';
import NewsSection from '@/components/news/NewsSection';

const WaterBall = dynamic(() => import('@/components/effects/WaterBall'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-transparent" />,
});



import Image from 'next/image';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

// ... imports

export default function HomeClient() {
    return (
        <ErrorBoundary fallback={
            <div className="flex items-center justify-center min-h-screen text-white/50">
                <p>Something went wrong loading the dashboard. Please refresh.</p>
            </div>
        }>
            <main className="relative min-h-screen bg-black overflow-x-hidden">

                {/* ── Section 1: Hero ─────────────────────────────── */}
                <section className="relative h-screen flex items-center px-6 md:px-12 max-w-[1800px] mx-auto">
                    <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">

                        {/* Text Content */}
                        <div>
                            <FadeIn>
                                <span className="text-[10px] text-white/25 uppercase tracking-[0.3em] font-medium mb-4 block">Market Intelligence</span>
                                <h1 className="text-4xl xs:text-5xl md:text-7xl xl:text-8xl font-light tracking-[-0.03em] leading-[1.05] text-white mb-8">
                                    Professional <br />
                                    <span className="text-white/50">Market Intelligence.</span>
                                </h1>
                            </FadeIn>

                            <FadeIn delay={0.2}>
                                <p className="text-lg md:text-xl font-light text-white/50 max-w-lg leading-relaxed mb-10">
                                    Real-time data and analytics for global markets. Track stocks, crypto, and commodities with institutional-grade tools and precision.
                                </p>
                            </FadeIn>

                            <FadeIn delay={0.4}>
                                <Link href="/markets" className="group relative inline-flex rounded-full">
                                    <div
                                        className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: 'conic-gradient(from 95deg, transparent 0deg, #0055FF 40deg, transparent 80deg)',
                                        }}
                                    />
                                    <span className="relative z-10 inline-flex items-center px-8 py-4 rounded-full bg-black border border-white/15 text-white text-sm uppercase tracking-widest hover:border-transparent transition-all duration-300">
                                        Learn More
                                    </span>
                                </Link>
                            </FadeIn>
                        </div>

                        {/* Hero Orb — Interactive */}
                        <div className="relative h-[500px] md:h-[600px] w-full flex items-center justify-center">
                            <div className="absolute inset-0 scale-[1.1] md:scale-125 opacity-90 flex items-center justify-center">
                                <WaterBall size={600} />
                            </div>
                        </div>
                    </div>

                    {/* Vertical Text Side */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block">
                        <div className="bg-white text-black text-[10px] font-bold uppercase tracking-widest py-4 px-1 writing-vertical-rl rotate-180">
                            Honors
                        </div>
                    </div>
                </section>

                {/* ── Scrolling Ticker ─────────────────────────────── */}
                <InfiniteTicker />

                {/* ── Section 2: Why Algorithmic (Glass Cards) ────── */}
                <section className="relative py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto min-h-screen flex flex-col justify-center overflow-hidden">

                    <div className="relative z-10 mb-16 md:mb-24 text-center">
                        <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Why Algorithmic</h2>
                        <p className="text-white/40">The difference between reacting to markets and anticipating them.</p>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        {/* ── Liquid Chrome Blob (visible between cards) ── */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1] overflow-visible">
                            <motion.div
                                className="relative w-[350px] h-[350px] lg:w-[450px] lg:h-[450px] xl:w-[550px] xl:h-[550px]"
                                style={{ opacity: 0.3 }}
                                animate={{
                                    y: [-20, 8, -20],
                                    rotate: [-3, 3, -3],
                                    scale: [1, 1.03, 1]
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <Image
                                    alt="Systematic trading logic visualization"
                                    fill
                                    className="object-contain drop-shadow-[0_0_60px_rgba(0,85,255,0.3)]"
                                    sizes="(max-width: 768px) 350px, (max-width: 1024px) 450px, 550px"
                                    src="/images/abstract_blop.webp"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Card 1: The Challenge */}
                        <div className="relative group z-[2]">
                            {/* Gradient border glow */}
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/15 via-white/5 to-white/10 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Blue hover glow */}
                            <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: '0 0 80px rgba(0, 85, 255, 0.12), inset 0 1px 0 rgba(0, 85, 255, 0.1)' }} />
                            <Card className="relative min-h-[400px] md:min-h-[500px] !bg-black/30 !backdrop-blur-none !border-white/[0.08] p-6 md:p-12 flex flex-col justify-between group-hover:!border-white/[0.15] transition-all duration-500" noPadding>
                                <div>
                                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mb-6 block">The Challenge</span>
                                    <h3 className="text-2xl md:text-3xl font-light text-white leading-snug">
                                        Manual constraints and emotional bias.
                                    </h3>
                                </div>

                                <div className="relative mt-auto pt-16">
                                    <p className="text-white/50 font-light leading-relaxed text-[15px] max-w-sm">
                                        Traditional trading is limited by human reaction times. Manual strategies suffer from inconsistency, emotional decision-making, and the physical inability to monitor hundreds of global symbols simultaneously.
                                    </p>
                                </div>
                            </Card>
                        </div>

                        {/* Card 2: The Solution */}
                        <div className="relative group z-[2]">
                            {/* Gradient border glow */}
                            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-white/15 opacity-40 group-hover:opacity-100 transition-opacity duration-500" />
                            {/* Blue hover glow */}
                            <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ boxShadow: '0 0 80px rgba(0, 85, 255, 0.12), inset 0 1px 0 rgba(0, 85, 255, 0.1)' }} />
                            <Card className="relative min-h-[400px] md:min-h-[500px] !bg-black/30 !backdrop-blur-none !border-white/[0.08] p-6 md:p-12 flex flex-col justify-between group-hover:!border-white/[0.15] transition-all duration-500" noPadding>
                                <div>
                                    <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium mb-6 block">The Solution</span>
                                    <h3 className="text-2xl md:text-3xl font-light text-white leading-snug">
                                        Systematic precision and global scale.
                                    </h3>
                                </div>

                                <div className="relative mt-auto pt-16">
                                    <p className="text-white/50 font-light leading-relaxed text-[15px] max-w-sm">
                                        Our proprietary algorithms execute in milliseconds, eliminating bias and maintaining peak performance 24/7. High-density data processing allows for simultaneous execution across every global venue.
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>

                </section>

                {/* ── Section 3: Live Markets ───────────────────── */}
                <LiveMarketsSection />

                {/* ── Section 4: Market Intelligence (News) ───────── */}
                <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                    <div className="flex items-center justify-between mb-16">
                        <div>
                            <span className="text-xs text-white/30 uppercase tracking-widest block mb-2">Live Feed</span>
                            <h2 className="text-3xl md:text-4xl font-light text-white">Market Intelligence</h2>
                        </div>
                        <Link href="/news" className="hidden md:block">
                            <button className="text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors">
                                View All News →
                            </button>
                        </Link>
                    </div>

                    <NewsSection />
                </section>

                {/* ── CTA Section ─────────────────────────────────── */}
                <section className="relative py-24 md:py-32 px-6 md:px-12 border-t border-white/5 overflow-hidden">
                    {/* Background watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span className="text-[100px] md:text-[160px] lg:text-[200px] font-bold uppercase tracking-wider text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}>
                            FINNSAYS
                        </span>
                    </div>
                    {/* Radial blue glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{
                        background: 'radial-gradient(ellipse at 50% 40%, rgba(0, 85, 255, 0.06) 0%, transparent 60%)'
                    }} />
                    <div className="relative max-w-[1800px] mx-auto text-center">
                        <FadeIn>
                            <span className="text-[10px] text-white/20 uppercase tracking-[0.3em] font-medium block mb-6">Get Started</span>
                            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">We build beyond algorithms</h2>
                            <p className="text-white/40 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                                A proprietary synchronization gateway for global crypto futures markets.
                                Make a trade once and have it replicated instantly across every venue.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link href="/markets">
                                    <button className="px-8 py-4 rounded-full bg-[#0055FF] text-white text-sm uppercase tracking-widest hover:bg-[#0044CC] transition-all duration-300">
                                        Start Trading
                                    </button>
                                </Link>
                                <Link href="/contact" className="group relative inline-flex rounded-full">
                                    <div
                                        className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                        style={{
                                            background: 'conic-gradient(from 95deg, transparent 0deg, #0055FF 40deg, transparent 80deg)',
                                        }}
                                    />
                                    <span className="relative z-10 inline-flex items-center px-8 py-4 rounded-full bg-black border border-white/15 text-white/60 text-sm uppercase tracking-widest hover:text-white hover:border-transparent transition-all duration-300">
                                        Contact Us
                                    </span>
                                </Link>
                            </div>
                        </FadeIn>
                    </div>
                </section>
            </main>
        </ErrorBoundary>
    );
}
