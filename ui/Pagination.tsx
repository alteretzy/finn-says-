'use client';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    let displayPages: number[];
    if (totalPages <= 7) {
        displayPages = pages;
    } else if (currentPage <= 4) {
        displayPages = [...pages.slice(0, 5), -1, totalPages];
    } else if (currentPage >= totalPages - 3) {
        displayPages = [1, -1, ...pages.slice(totalPages - 5)];
    } else {
        displayPages = [1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages];
    }

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Previous page"
            >
                ←
            </button>

            {/* Page Numbers */}
            {displayPages.map((page, index) =>
                page === -1 ? (
                    <span key={`ellipsis-${index}`} className="px-2 text-white/40">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-all duration-200 ${currentPage === page
                                ? 'bg-[#0066FF] text-white font-medium'
                                : 'border border-white/10 text-white/60 hover:bg-white/5'
                            }`}
                        aria-label={`Page ${page}`}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-lg border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                aria-label="Next page"
            >
                →
            </button>
        </div>
    );
}
