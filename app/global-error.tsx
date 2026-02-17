'use client';

import { useEffect } from 'react';
import './globals.css';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className="bg-black text-white font-sans antialiased">
                <div className="min-h-screen flex items-center justify-center px-6">
                    <div className="max-w-md w-full text-center">
                        <h2 className="text-2xl font-light text-white mb-4">Critical System Error</h2>
                        <p className="text-sm text-white/40 mb-8 leading-relaxed">
                            A critical error occurred in the application root.
                        </p>
                        <button
                            onClick={() => reset()}
                            className="px-6 py-3 bg-[#0055FF] text-white text-sm font-medium rounded-full hover:bg-[#0044CC] transition-colors"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
