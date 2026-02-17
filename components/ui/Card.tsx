import { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    noPadding?: boolean;
}

export default function Card({ children, className = '', noPadding = false }: CardProps) {
    return (
        <div className={`
            group relative overflow-hidden rounded-xl 
            bg-[#0A0A0E]/60 backdrop-blur-xl 
            border border-white/[0.08] 
            shadow-[0_8px_32px_rgba(0,0,0,0.4)]
            transition-all duration-500 ease-out
            hover:border-white/[0.12] hover:bg-[#0A0A0E]/80
            hover:shadow-[0_12px_48px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,255,0.02)]
            ${noPadding ? '' : 'p-6'}
            ${className}
        `}>
            {/* Glossy top edge */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Subtle inner noise/texture could go here if assets were available, using gradient for now */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
