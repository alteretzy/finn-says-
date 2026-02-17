
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-white/[0.04] overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-14">
                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                    {/* Brand */}
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
                            </div>
                            <span className="text-[12px] font-light tracking-[0.15em] uppercase text-white/50">
                                FinnSays
                            </span>
                        </div>
                        <p className="text-[13px] text-white/25 font-light leading-relaxed">
                            Institutional-grade market intelligence. Real-time data
                            for stocks, cryptocurrencies, metals & commodities.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-16">
                        <div>
                            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4 font-light">
                                Markets
                            </p>
                            <ul className="space-y-2.5">
                                {[
                                    { label: 'All Markets', href: '/markets' },
                                    { label: 'Stocks', href: '/markets?type=stocks' },
                                    { label: 'Crypto', href: '/markets?type=crypto' },
                                    { label: 'Metals', href: '/markets?type=metals' },
                                    { label: 'Commodities', href: '/markets?type=commodities' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-[13px] font-light text-white/25 hover:text-white/60 transition-colors duration-300"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <p className="text-[10px] tracking-[0.3em] uppercase text-white/20 mb-4 font-light">
                                Legal
                            </p>
                            <ul className="space-y-2.5">
                                <li>
                                    <span className="text-[13px] font-light text-white/25">Privacy</span>
                                </li>
                                <li>
                                    <span className="text-[13px] font-light text-white/25">Terms</span>
                                </li>
                                <li>
                                    <span className="text-[13px] font-light text-white/25">Risk Disclosure</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-[11px] text-white/15 font-light">
                        © {new Date().getFullYear()} FinnSays. All rights reserved.
                    </p>
                    <p className="text-[11px] text-white/10 font-light">
                        Market data by Yahoo Finance + CoinGecko. Not financial advice.
                    </p>
                </div>
            </div>

            {/* Giant brand watermark */}
            <div className="relative w-full flex justify-center -mb-[40px] md:-mb-[60px] pointer-events-none select-none overflow-hidden">
                <span
                    className="text-[80px] md:text-[120px] lg:text-[160px] font-bold uppercase tracking-[0.1em] text-transparent leading-none transition-all duration-700 ease-out hover:drop-shadow-[0_0_30px_rgba(0,85,255,0.4)]"
                    style={{
                        WebkitTextStroke: '1px rgba(255,255,255,0.03)',
                    }}
                >
                    FINNSAYS
                </span>
                {/* Glow layer overlay for hover effect */}
                <span
                    className="absolute inset-0 text-center text-[80px] md:text-[120px] lg:text-[160px] font-bold uppercase tracking-[0.1em] text-[#0055FF] leading-none opacity-0 hover:opacity-10 transition-opacity duration-700"
                >
                    FINNSAYS
                </span>
            </div>
        </footer>
    );
}
