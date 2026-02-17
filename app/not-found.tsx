import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen bg-black flex items-center justify-center px-6">
            <div className="text-center max-w-md">
                <p className="text-8xl font-light animate-shimmer mb-6">404</p>
                <h1 className="text-2xl font-light tracking-tight mb-3">
                    Page Not Found
                </h1>
                <p className="text-sm text-white/50 font-light leading-relaxed mb-8">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#0066FF] hover:bg-[#0052CC] text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                    ← Back to Home
                </Link>
            </div>
        </main>
    );
}
