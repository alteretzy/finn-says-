'use client';

interface FilterChipsProps {
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    multiSelect?: boolean;
}

export default function FilterChips({
    options,
    selected,
    onChange,
    multiSelect = true,
}: FilterChipsProps) {
    const handleClick = (option: string) => {
        if (multiSelect) {
            const newSelected = selected.includes(option)
                ? selected.filter((s) => s !== option)
                : [...selected, option];
            onChange(newSelected);
        } else {
            onChange([option]);
        }
    };

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {options.map((option) => {
                const isSelected = selected.includes(option);
                return (
                    <button
                        key={option}
                        onClick={() => handleClick(option)}
                        className={`px-4 py-2 rounded-2xl text-sm font-light whitespace-nowrap transition-all duration-200 ${isSelected
                                ? 'bg-[#0066FF]/10 border border-[#0066FF] text-white'
                                : 'bg-white/5 border border-white/10 text-white/60 hover:border-white/20'
                            }`}
                    >
                        {option}
                    </button>
                );
            })}
        </div>
    );
}
