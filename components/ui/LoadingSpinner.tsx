export default function LoadingSpinner({ size = 40 }: { size?: number }) {
    return (
        <div className="flex items-center justify-center">
            <div
                className="rounded-full border-4 border-white/10 border-t-[#0066FF] animate-spin"
                style={{ width: size, height: size }}
                role="status"
                aria-label="Loading"
            />
        </div>
    );
}
