'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import Card from '@/components/ui/Card';

const FluidBackground = dynamic(() => import('@/components/effects/FluidBackground'), {
    ssr: false,
});

const techStack = [
    {
        number: '01',
        title: 'Execution Engine',
        subtitle: 'Sub-millisecond order routing',
        description: 'Our proprietary execution engine processes and routes orders in under 1ms, leveraging co-located servers and optimized network paths to minimize latency across all major exchanges.',
        stats: [
            { label: 'Avg Latency', value: '<1ms' },
            { label: 'Throughput', value: '100K/s' },
            { label: 'Uptime', value: '99.99%' },
        ],
    },
    {
        number: '02',
        title: 'Data Pipeline',
        subtitle: 'Real-time market data ingestion',
        description: 'High-density data processing pipeline ingests and normalizes market data from 50+ venues simultaneously. Every tick, every trade, every order book update — captured and processed in real-time.',
        stats: [
            { label: 'Data Sources', value: '50+' },
            { label: 'Events/sec', value: '2M+' },
            { label: 'Storage', value: '10PB' },
        ],
    },
    {
        number: '03',
        title: 'Risk Management',
        subtitle: 'Automated protection systems',
        description: 'Multi-layered risk management framework with real-time position monitoring, automated circuit breakers, and dynamic exposure limits. Every trade passes through 47 independent risk checks.',
        stats: [
            { label: 'Risk Checks', value: '47' },
            { label: 'Response', value: '<5ms' },
            { label: 'Coverage', value: '100%' },
        ],
    },
    {
        number: '04',
        title: 'Fyndex Gateway',
        subtitle: 'Proprietary synchronization',
        description: 'Our proprietary synchronization gateway for global crypto futures markets. Execute once, replicate everywhere. Fyndex ensures consistent state across all connected venues with zero drift.',
        stats: [
            { label: 'Venues', value: '12' },
            { label: 'Sync Delay', value: '<10ms' },
            { label: 'Drift', value: '0%' },
        ],
    },
];

const architectureFeatures = [
    { icon: '⚡', title: 'Low Latency', desc: 'Co-located infrastructure with direct market access' },
    { icon: '🔒', title: 'Secure', desc: 'End-to-end encryption with hardware security modules' },
    { icon: '🌐', title: 'Global', desc: 'Distributed across 8 data centers worldwide' },
    { icon: '📊', title: 'Observable', desc: 'Full-stack observability with real-time dashboards' },
    { icon: '🔄', title: 'Resilient', desc: 'Automatic failover with zero-downtime deployments' },
    { icon: '🧠', title: 'Intelligent', desc: 'ML-powered optimization of execution parameters' },
];

export default function TechnologyClient() {
    return (
        <main className="relative min-h-screen bg-black overflow-x-hidden">

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="relative h-screen flex items-center px-6 md:px-12 max-w-[1800px] mx-auto overflow-hidden">
                {/* Background Fluid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <FluidBackground />
                </div>

                <div className="relative z-10 w-full">
                    <FadeIn>
                        <span className="text-xs text-white/30 uppercase tracking-widest block mb-6">Technology</span>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-normal tracking-tighter leading-[1.1] text-white mb-8 max-w-4xl">
                            Engineering the future of <span className="text-white/40">systematic trading.</span>
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-lg md:text-xl font-light text-white/40 max-w-2xl leading-relaxed mb-10">
                            Every component of our infrastructure is purpose-built for speed, reliability, and scale. From data ingestion to order execution, we control the entire stack.
                        </p>
                    </FadeIn>
                    <FadeIn delay={0.3}>
                        <div className="flex items-center gap-3 text-sm text-white/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            All systems operational
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* ── Tech Stack Cards ──────────────────────────────── */}
            <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto">
                <div className="space-y-8 md:space-y-12">
                    {techStack.map((tech, i) => (
                        <FadeIn key={tech.number} delay={i * 0.05}>
                            <Card className="p-0 bg-black/40 border-white/5 hover:border-white/10 transition-all duration-500 group" noPadding>
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                    {/* Left: Number + Title */}
                                    <div className="lg:col-span-4 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-white/5">
                                        <span className="text-xs text-[#0055FF] font-mono mb-4 block">{tech.number}</span>
                                        <h3 className="text-3xl md:text-4xl font-light text-white mb-3 group-hover:text-[#0055FF] transition-colors duration-500">{tech.title}</h3>
                                        <p className="text-sm text-white/40">{tech.subtitle}</p>
                                    </div>

                                    {/* Middle: Description */}
                                    <div className="lg:col-span-5 p-8 md:p-12 flex items-center border-b lg:border-b-0 lg:border-r border-white/5">
                                        <p className="text-white/50 font-light leading-relaxed">{tech.description}</p>
                                    </div>

                                    {/* Right: Stats */}
                                    <div className="lg:col-span-3 p-8 md:p-12 flex flex-col justify-center gap-6">
                                        {tech.stats.map((stat) => (
                                            <div key={stat.label} className="flex justify-between items-baseline">
                                                <span className="text-xs text-white/30 uppercase tracking-wider">{stat.label}</span>
                                                <span className="text-xl font-mono text-white">{stat.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ── Architecture Grid ─────────────────────────────── */}
            <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="mb-16">
                    <span className="text-xs text-white/30 uppercase tracking-widest block mb-4">Architecture</span>
                    <h2 className="text-4xl md:text-5xl font-light text-white mb-4">Built for performance.</h2>
                    <p className="text-white/40 max-w-xl">Every design decision optimized for one outcome: consistent, reliable execution at scale.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {architectureFeatures.map((feature, i) => (
                        <FadeIn key={feature.title} delay={i * 0.05}>
                            <Card className="p-8 bg-black/40 border-white/5 hover:border-white/10 transition-all duration-300 group h-full" noPadding>
                                <div className="text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                                <h4 className="text-lg font-medium text-white mb-2">{feature.title}</h4>
                                <p className="text-sm text-white/40 font-light leading-relaxed">{feature.desc}</p>
                            </Card>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ── System Metrics ────────────────────────────────── */}
            <section className="relative py-24 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                    {[
                        { value: '99.99%', label: 'Uptime SLA' },
                        { value: '<1ms', label: 'Avg Latency' },
                        { value: '$2.1B+', label: 'Volume Processed' },
                        { value: '24/7', label: 'Monitoring' },
                    ].map((metric, i) => (
                        <FadeIn key={metric.label} delay={i * 0.1}>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-mono font-light text-white mb-3">{metric.value}</div>
                                <div className="text-xs text-white/30 uppercase tracking-widest">{metric.label}</div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="relative py-32 px-6 md:px-12 max-w-[1800px] mx-auto border-t border-white/5 text-center">
                <FadeIn>
                    <h2 className="text-4xl md:text-6xl font-light text-white mb-8">Ready to build?</h2>
                    <p className="text-white/40 max-w-lg mx-auto mb-12 font-light">
                        Our infrastructure is ready. Let us show you what systematic intelligence can do for your trading.
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <Link href="/contact">
                            <button className="px-8 py-4 rounded-full bg-white text-black text-sm uppercase tracking-widest hover:bg-white/90 transition-all duration-300">
                                Get in Touch
                            </button>
                        </Link>
                        <Link href="/markets" className="text-sm text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                            View Markets →
                        </Link>
                    </div>
                </FadeIn>
            </section>

            {/* ── Footer ──────────────────────────────────────── */}
            <footer className="py-16 px-6 md:px-12 border-t border-white/5">
                <div className="max-w-[1800px] mx-auto flex justify-between items-end">
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">
                        © {new Date().getFullYear()} FinnSays AG
                    </div>
                    <Link href="/" className="text-xs text-white/30 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </footer>
        </main>
    );
}
