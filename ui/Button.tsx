import { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'relative inline-flex items-center justify-center font-light uppercase tracking-widest transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0055FF]/30';

    const variants = {
        primary:
            'bg-[#0055FF] hover:bg-[#0044CC] text-white shadow-[0_0_20px_rgba(0,85,255,0.3)] hover:shadow-[0_0_30px_rgba(0,85,255,0.5)] border border-transparent',
        outline:
            'bg-transparent border border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/[0.02]',
        ghost:
            'bg-transparent text-white/40 hover:text-white border border-transparent hover:bg-white/[0.02]',
    };

    const sizes = {
        sm: 'px-5 py-2.5 text-[10px]',
        md: 'px-7 py-3.5 text-xs',
        lg: 'px-9 py-4 text-sm',
    };

    if (variant === 'outline') {
        return (
            <div className="group relative inline-flex rounded-full">
                {/* Rotating conic-gradient glow */}
                <div
                    className="absolute -inset-[1px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px]"
                    style={{
                        background: 'conic-gradient(from 95deg, transparent 0deg, #0055FF 40deg, transparent 80deg)',
                    }}
                >
                    <div
                        className="absolute inset-0 rounded-full transition-transform duration-[2000ms] ease-linear group-hover:rotate-[360deg]"
                        style={{
                            background: 'conic-gradient(from 95deg, transparent 0deg, #0055FF 40deg, transparent 80deg)',
                        }}
                    />
                </div>
                <button
                    className={`${baseStyles} ${variants[variant]} ${sizes[size]} relative z-10 bg-black ${className}`}
                    {...props}
                >
                    {children}
                </button>
            </div>
        );
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
