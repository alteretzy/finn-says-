'use client';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function SearchBar({
    value,
    onChange,
    placeholder = 'Search assets...',
}: SearchBarProps) {
    return (
        <div className="relative w-full md:w-[400px]">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 bg-white/5 border border-white/10 rounded-full px-5 pr-12 text-sm text-white placeholder:text-white/40 focus:border-[#0066FF] focus:outline-none transition-colors duration-200"
                aria-label="Search assets"
            />
            <svg
                className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
}
