'use client';

import { useEffect } from 'react';

import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('[Error Boundary]', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red-400">
                        <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="text-2xl font-light text-white mb-2">Something went wrong</h2>
                <p className="text-sm text-white/40 mb-8 leading-relaxed">
                    An unexpected error occurred. Our trading algorithms are recalibrating.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="px-6 py-3 bg-[#0055FF]/20 border border-[#0055FF]/30 text-[#0055FF] text-xs uppercase tracking-widest rounded-full hover:bg-[#0055FF]/30 transition-all"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white/[0.03] border border-white/10 text-white/60 text-xs uppercase tracking-widest rounded-full hover:text-white hover:border-white/20 transition-all"
                    >
                        Go Home
                    </Link>
                </div>

                {/* Error digest */}
                {error.digest && (
                    <p className="mt-8 text-[10px] text-white/20 font-mono">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
