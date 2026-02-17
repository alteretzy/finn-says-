export default function Loading() {
    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Animated logo placeholder */}
                <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#0066FF] animate-spin" />
                <p className="text-xs text-white/40 tracking-widest uppercase">
                    Loading
                </p>
            </div>
        </div>
    );
}
