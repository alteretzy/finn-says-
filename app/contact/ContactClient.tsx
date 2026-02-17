'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import FadeIn from '@/components/animations/FadeIn';

const FluidBackground = dynamic(() => import('@/components/effects/FluidBackground'), {
    ssr: false,
});

export default function ContactClient() {
    const [formData, setFormData] = useState({
        name: 'Aman',
        email: 'amanksharma@icloud.com',
        company: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate submission
        setSubmitted(true);
    };

    return (
        <main className="relative min-h-screen bg-black overflow-x-hidden">

            {/* Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <FluidBackground />
            </div>

            <div className="relative z-10 max-w-[1800px] mx-auto px-6 md:px-12">

                {/* Hero */}
                <section className="pt-32 pb-20">
                    <FadeIn>
                        <span className="text-xs text-white/30 uppercase tracking-widest block mb-6">Contact</span>
                    </FadeIn>
                    <FadeIn delay={0.1}>
                        <h1 className="text-5xl md:text-7xl font-normal tracking-tighter text-white mb-6">
                            Let&apos;s talk.
                        </h1>
                    </FadeIn>
                    <FadeIn delay={0.2}>
                        <p className="text-lg text-white/40 font-light max-w-xl leading-relaxed">
                            Whether you&apos;re interested in our technology, exploring partnership opportunities, or have a general inquiry — we&apos;d love to hear from you.
                        </p>
                    </FadeIn>
                </section>

                {/* Content Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pb-32">

                    {/* Contact Info */}
                    <div className="lg:col-span-4 space-y-12">
                        <FadeIn delay={0.1}>
                            <div>
                                <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">General Inquiries</h3>
                                <a href="mailto:amanksharma@icloud.com" className="text-lg text-white hover:text-[#0055FF] transition-colors">
                                    amanksharma@icloud.com
                                </a>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.15}>
                            <div>
                                <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">Partnerships</h3>
                                <a href="mailto:partnerships@finnsays.com" className="text-lg text-white hover:text-[#0055FF] transition-colors">
                                    partnerships@finnsays.com
                                </a>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.2}>
                            <div>
                                <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">Headquarters</h3>
                                <p className="text-white/50 font-light leading-relaxed">
                                    FinnSays<br />
                                    New Delhi<br />
                                    India
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.25}>
                            <div>
                                <h3 className="text-xs text-white/30 uppercase tracking-widest mb-4">Follow Us</h3>
                                <div className="flex gap-6">
                                    {['LinkedIn', 'Twitter', 'GitHub'].map(platform => (
                                        <a key={platform} href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                                            {platform}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-8">
                        {submitted ? (
                            <FadeIn>
                                <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                        className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-8"
                                    >
                                        <span className="text-2xl">✓</span>
                                    </motion.div>
                                    <h2 className="text-3xl font-light text-white mb-4">Message sent.</h2>
                                    <p className="text-white/40 font-light mb-8">We&apos;ll be in touch within 24 hours.</p>
                                    <Link href="/">
                                        <button className="text-xs text-white/40 hover:text-white uppercase tracking-widest transition-colors">
                                            ← Back to Home
                                        </button>
                                    </Link>
                                </div>
                            </FadeIn>
                        ) : (
                            <FadeIn delay={0.1}>
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Name */}
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-widest block mb-3">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-lg font-light focus:border-[#0055FF] focus:outline-none transition-colors placeholder:text-white/15"
                                                placeholder="Your name"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-widest block mb-3">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-lg font-light focus:border-[#0055FF] focus:outline-none transition-colors placeholder:text-white/15"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Company */}
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-widest block mb-3">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-lg font-light focus:border-[#0055FF] focus:outline-none transition-colors placeholder:text-white/15"
                                                placeholder="Company name"
                                            />
                                        </div>

                                        {/* Subject */}
                                        <div>
                                            <label className="text-xs text-white/30 uppercase tracking-widest block mb-3">
                                                Subject
                                            </label>
                                            <select
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-lg font-light focus:border-[#0055FF] focus:outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="" className="bg-black">Select topic</option>
                                                <option value="technology" className="bg-black">Technology Partnership</option>
                                                <option value="investment" className="bg-black">Investment Inquiries</option>
                                                <option value="careers" className="bg-black">Careers</option>
                                                <option value="general" className="bg-black">General Inquiry</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="text-xs text-white/30 uppercase tracking-widest block mb-3">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={6}
                                            value={formData.message}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/10 pb-3 text-white text-lg font-light focus:border-[#0055FF] focus:outline-none transition-colors placeholder:text-white/15 resize-none"
                                            placeholder="Tell us about your project or inquiry..."
                                        />
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center justify-between pt-4">
                                        <p className="text-xs text-white/20">* Required fields</p>
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="px-10 py-4 rounded-full bg-white text-black text-sm uppercase tracking-widest hover:bg-white/90 transition-colors"
                                        >
                                            Send Message
                                        </motion.button>
                                    </div>
                                </form>
                            </FadeIn>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="relative z-10 py-16 px-6 md:px-12 border-t border-white/5">
                <div className="max-w-[1800px] mx-auto flex justify-between items-end">
                    <div className="text-[10px] text-white/20 uppercase tracking-widest">
                        © {new Date().getFullYear()} FinnSays
                    </div>
                    <Link href="/" className="text-xs text-white/30 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </footer>
        </main>
    );
}
