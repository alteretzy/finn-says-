import React from 'react';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'success' | 'error' | 'warning' | 'neutral';
    size?: 'sm' | 'md';
    className?: string;
}

export default function Badge({
    children,
    variant = 'neutral',
    size = 'md',
    className = ''
}: BadgeProps) {
    const variants = {
        success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
        error: 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        neutral: 'bg-white/[0.03] text-white/40 border-white/[0.08]'
    };

    const sizes = {
        sm: 'px-1.5 py-0.5 text-[10px]',
        md: 'px-2 py-1 text-xs'
    };

    return (
        <span className={`
            inline-flex items-center justify-center font-medium rounded border tracking-wide
            ${variants[variant]}
            ${sizes[size]}
            ${className}
        `}>
            {children}
        </span>
    );
}
