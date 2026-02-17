import { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    as?: 'div' | 'section' | 'main';
}

export default function Container({
    children,
    className = '',
    as: Component = 'div',
}: ContainerProps) {
    return (
        <Component
            className={`max-w-[1800px] mx-auto w-full px-4 md:px-8 lg:px-12 ${className}`}
        >
            {children}
        </Component>
    );
}
