
import { useState, useMemo } from 'react';
import { MarketAsset } from '@/lib/finnhub/types';

interface UseMarketDataOptions {
    data: MarketAsset[];
    pageSize?: number;
}

export function useMarketTable({ data, pageSize = 20 }: UseMarketDataOptions) {
    const [search, setSearch] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [sortKey, setSortKey] = useState<keyof MarketAsset>('marketCap');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and Sort
    const filteredData = useMemo(() => {
        let result = [...data];

        // Search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (asset) =>
                    asset.symbol.toLowerCase().includes(q) ||
                    asset.name.toLowerCase().includes(q)
            );
        }

        // Filter by Type
        if (selectedTypes.length > 0) {
            result = result.filter((asset) => selectedTypes.includes(asset.type));
        }

        // Sort
        result.sort((a, b) => {
            const aValue = a[sortKey];
            const bValue = b[sortKey];

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }
            return 0;
        });

        return result;
    }, [data, search, selectedTypes, sortKey, sortDirection]);

    // Pagination
    const totalResults = filteredData.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: keyof MarketAsset) => {
        if (sortKey === key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('desc');
        }
    };

    return {
        search,
        setSearch,
        selectedTypes,
        setSelectedTypes,
        sortKey,
        sortDirection,
        handleSort,
        currentPage,
        setCurrentPage,
        totalPages,
        paginatedData,
        totalResults,
    };
}
