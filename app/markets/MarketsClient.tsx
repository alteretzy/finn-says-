
'use client';

import Link from 'next/link';
import FadeIn from '@/components/animations/FadeIn';
import SearchBar from '@/components/data/SearchBar';
import FilterChips from '@/components/data/FilterChips';
import DataTable from '@/components/data/DataTable';
import Pagination from '@/components/ui/Pagination';
import Badge from '@/components/ui/Badge';
import Sparkline from '@/components/charts/Sparkline';
import MarketIndices from '@/components/data/MarketIndices';
import SectorHeatmap from '@/components/data/SectorHeatmap';
import { useMarketTable } from '@/hooks/useMarketTable';
import { useMarkets } from '@/hooks/useMarkets';
import { formatMarketCap, formatVolume } from '@/lib/utils/formatters';
import { ASSET_TYPES } from '@/lib/utils/constants';
import { MarketAsset } from '@/lib/finnhub/types'; // Assuming types are still here, or I should update types?
import MobileAssetCard from '@/components/data/MobileAssetCard';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const columns = [
    {
        key: 'symbol',
        label: 'Asset',
        render: (_: any, row: MarketAsset) => (
            <Link href={`/asset/${row.symbol}`} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-xs font-light text-white/50">
                    {row.symbol.charAt(0)}
                </div>
                <div>
                    <p className="text-sm font-light text-white/80 group-hover:text-white transition-colors">
                        {row.symbol}
                    </p>
                    <p className="text-xs text-white/30 font-light">{row.name}</p>
                </div>
            </Link>
        ),
    },
    {
        key: 'type',
        label: 'Type',
        render: (value: any) => (
            <Badge>
                {value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Unknown'}
            </Badge>
        ),
    },
    {
        key: 'price',
        label: 'Price',
        align: 'right' as const,
        render: (value: number) => (
            <span className="font-medium text-white tabular-nums">
                ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
        ),
    },
    {
        key: 'change24h',
        label: '24h Change',
        align: 'right' as const,
        render: (value: number) => (
            <span className={`tabular-nums ${value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {value > 0 ? '+' : ''}{value.toFixed(2)}%
            </span>
        ),
    },
    {
        key: 'volume',
        label: 'Volume',
        align: 'right' as const,
        render: (value: number) => (
            <span className="text-white/40 tabular-nums font-light">{formatVolume(value)}</span>
        ),
    },
    {
        key: 'marketCap',
        label: 'Market Cap',
        align: 'right' as const,
        render: (value: number) => (
            <span className="text-white/40 tabular-nums font-light">{formatMarketCap(value)}</span>
        ),
    },
    {
        key: 'sparkline',
        label: '7D',
        align: 'right' as const,
        width: '120px',
        render: (value: any, row: MarketAsset) => (
            <div className="w-[100px] ml-auto">
                <Sparkline data={value || []} height={28} color={(row as any).change24h >= 0 ? '#10B981' : '#EF4444'} />
            </div>
        ),
    },
];

interface MarketsClientProps {
    initialType?: string;
}

export default function MarketsClient({ initialType = 'All' }: MarketsClientProps) {
    const { assets, loading: apiLoading } = useMarkets(initialType as any);

    // Cast assets to MarketAsset[] if needed, or ensure compatibility
    // The new Asset type in useMarkets matches MarketAsset mostly
    const {
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
    } = useMarketTable({ data: assets as unknown as MarketAsset[], pageSize: 10 });

    const isLoading = apiLoading && assets.length === 0;

    return (
        <ErrorBoundary>
            <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-28">
                {/* Page Header */}
                <FadeIn>
                    <div className="mb-8">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3 font-light">
                            Market Intelligence
                        </p>
                        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4">
                            All Markets
                        </h1>
                        <p className="text-sm text-white/30 font-light max-w-xl leading-relaxed">
                            Real-time prices, trends, and analytics across
                            stocks, cryptocurrencies, precious metals & commodities.
                        </p>
                    </div>
                </FadeIn>

                {/* Indices */}
                <FadeIn delay={0.05}>
                    <MarketIndices />
                </FadeIn>

                {/* Sector Heatmap */}
                <FadeIn delay={0.1}>
                    {(!selectedTypes.length || selectedTypes.includes('stock')) && assets.length > 0 && (
                        <SectorHeatmap assets={assets as unknown as MarketAsset[]} />
                    )}
                </FadeIn>

                {/* Search + Filters */}
                <FadeIn delay={0.15}>
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
                        <SearchBar value={search} onChange={setSearch} />
                        <FilterChips
                            options={[...ASSET_TYPES]}
                            selected={selectedTypes}
                            onChange={setSelectedTypes}
                            multiSelect={false}
                        />
                    </div>
                </FadeIn>

                {/* Results count */}
                <FadeIn delay={0.2}>
                    <p className="text-[11px] text-white/20 mb-4 font-light">
                        {totalResults} asset{totalResults !== 1 ? 's' : ''} found
                    </p>
                </FadeIn>

                {/* Loading State */}
                {isLoading ? (
                    <div className="py-20 text-center">
                        <div className="inline-block w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin mb-4" />
                        <p className="text-white/30 text-sm font-light">Loading market data...</p>
                    </div>
                ) : (
                    <>
                        {/* Table (Desktop) */}
                        <FadeIn delay={0.15}>
                            <div className="hidden md:block">
                                <DataTable
                                    data={paginatedData}
                                    columns={columns}
                                    onSort={(key) => handleSort(key as 'symbol' | 'price' | 'change24h' | 'volume' | 'marketCap')}
                                    sortKey={sortKey}
                                    sortDirection={sortDirection}
                                    onRowClick={(row) => {
                                        window.location.href = `/asset/${row.symbol}`;
                                    }}
                                />
                            </div>
                        </FadeIn>

                        {/* Vertical Cards (Mobile) */}
                        <div className="md:hidden space-y-4">
                            {paginatedData.map((asset) => (
                                <MobileAssetCard key={asset.symbol} asset={asset} />
                            ))}
                            {paginatedData.length === 0 && (
                                <div className="py-12 text-center text-white/30 text-sm border border-white/5 rounded-xl bg-white/[0.02]">
                                    No assets found.
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Pagination */}
                {totalPages > 1 && !isLoading && (
                    <FadeIn delay={0.2}>
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </FadeIn>
                )}
            </main>
        </ErrorBoundary>
    );
}
