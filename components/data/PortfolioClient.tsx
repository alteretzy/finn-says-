'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePortfolio, PortfolioItem } from '@/hooks/usePortfolio';
import FadeIn from '@/components/animations/FadeIn';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPrice, formatPercent } from '@/lib/utils/formatters';
import { MarketAsset } from '@/lib/finnhub/types';
import MobileAssetCard from './MobileAssetCard';
import { useMarketStore } from '@/store/marketStore';
import { wsManager } from '@/lib/websocket/manager';

interface PortfolioClientProps {
    initialData: MarketAsset[];
}

export default function PortfolioClient({ initialData }: PortfolioClientProps) {
    const { portfolio, addHolding, removeHolding, updateHolding } = usePortfolio();
    const { prices, changes, setPreviousClose, updateFromTicker } = useMarketStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

    // Form state
    const [selectedSymbol, setSelectedSymbol] = useState(initialData[0]?.symbol || '');
    const [quantity, setQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');

    // Initialize previous closes and subscribe to WebSocket
    useEffect(() => {
        if (portfolio.length === 0) return;

        portfolio.forEach(item => {
            const initial = initialData.find(d => d.symbol === item.symbol);
            if (initial) {
                // Calculate previous close from initial price and change
                const pc = initial.price - initial.change;
                setPreviousClose(item.symbol, pc);
            }

            wsManager.subscribe(item.symbol, updateFromTicker);
        });

        return () => {
            portfolio.forEach(item => {
                wsManager.unsubscribe(item.symbol, updateFromTicker);
            });
        };
    }, [portfolio, initialData, setPreviousClose, updateFromTicker]);

    const portfolioData = useMemo(() => {
        return portfolio.map(item => {
            const marketData = initialData.find(d => d.symbol === item.symbol);
            if (!marketData) return null;

            const currentPrice = prices[item.symbol] || marketData.price;
            const currentChangePercent = changes[item.symbol] || marketData.changePercent;

            const value = item.quantity * currentPrice;
            const costBasis = item.quantity * item.avgBuyPrice;
            const pnl = value - costBasis;
            const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

            // For day change, we need to know the price at start of day
            const startOfDayPrice = currentPrice / (1 + (currentChangePercent / 100));
            const dayChange = (currentPrice - startOfDayPrice) * item.quantity;

            return {
                ...item,
                marketData: {
                    ...marketData,
                    price: currentPrice,
                    changePercent: currentChangePercent
                },
                currentPrice,
                value,
                costBasis,
                pnl,
                pnlPercent,
                dayChange
            };
        }).filter((item): item is NonNullable<typeof item> => item !== null);
    }, [portfolio, initialData, prices, changes]);

    const totals = useMemo(() => {
        return portfolioData.reduce((acc, item) => ({
            value: acc.value + item.value,
            costBasis: acc.costBasis + item.costBasis,
            dayChange: acc.dayChange + item.dayChange,
        }), { value: 0, costBasis: 0, dayChange: 0 });
    }, [portfolioData]);

    const totalPnl = totals.value - totals.costBasis;
    const totalPnlPercent = totals.costBasis > 0 ? (totalPnl / totals.costBasis) * 100 : 0;
    const totalDayChangePercent = (totals.value - totals.dayChange) > 0
        ? (totals.dayChange / (totals.value - totals.dayChange)) * 100
        : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const qty = parseFloat(quantity);
        const price = parseFloat(buyPrice);

        if (isNaN(qty) || isNaN(price) || qty <= 0 || price < 0) return;

        if (editingItem) {
            updateHolding(editingItem.symbol, qty, price);
        } else {
            addHolding(selectedSymbol, qty, price);
        }

        closeModal();
    };

    const openAddModal = () => {
        setEditingItem(null);
        setSelectedSymbol(initialData[0]?.symbol || '');
        setQuantity('');
        setBuyPrice('');
        setIsModalOpen(true);
    };

    const openEditModal = (item: PortfolioItem) => {
        setEditingItem(item);
        setSelectedSymbol(item.symbol);
        setQuantity(item.quantity.toString());
        setBuyPrice(item.avgBuyPrice.toString());
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const sortedAssets = [...initialData].sort((a, b) => a.symbol.localeCompare(b.symbol));

    return (
        <main className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 md:py-28 relative">
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <p className="text-[10px] tracking-[0.3em] uppercase text-white/25 mb-3 font-light">
                            Wealth Tracker
                        </p>
                        <h1 className="text-3xl md:text-5xl font-extralight tracking-tight mb-4">
                            My Portfolio
                        </h1>
                    </div>
                    <Button onClick={openAddModal} className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                        Add Asset
                    </Button>
                </div>
            </FadeIn>

            {/* Summary Cards */}
            <FadeIn delay={0.1}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-sm text-white/40 font-light mb-1">Total Balance</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-light tracking-tight">${formatPrice(totals.value)}</span>
                            <Badge variant={totalDayChangePercent >= 0 ? 'success' : 'error'}>
                                {totalDayChangePercent > 0 ? '+' : ''}{formatPercent(totalDayChangePercent)} (24h)
                            </Badge>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-sm text-white/40 font-light mb-1">Total Profit/Loss</p>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-3xl font-light tracking-tight ${totalPnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {totalPnl >= 0 ? '+' : '-'}${formatPrice(Math.abs(totalPnl))}
                            </span>
                            <span className={`text-sm ${totalPnlPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {totalPnlPercent > 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                        <p className="text-sm text-white/40 font-light mb-1">Holdings Count</p>
                        <span className="text-3xl font-light tracking-tight text-white/80">{portfolio.length}</span>
                    </div>
                </div>
            </FadeIn>

            {/* Holdings Table */}
            <FadeIn delay={0.2}>
                {portfolioData.length > 0 ? (
                    <>
                        <div className="hidden md:block overflow-x-auto rounded-xl border border-white/[0.05] bg-white/[0.01]">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/[0.05]">
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider">Asset</th>
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Price</th>
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Holdings</th>
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Value</th>
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Net P&L</th>
                                        <th className="p-4 text-xs font-medium text-white/50 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.05]">
                                    {portfolioData.map((item) => (
                                        <tr key={item.symbol} className="group hover:bg-white/[0.02] transition-colors">
                                            <td className="p-4">
                                                <Link href={`/asset/${item.symbol}`} className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-[10px]">
                                                        {item.symbol[0]}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white/90">{item.symbol}</div>
                                                        <div className="text-xs text-white/40">{item.marketData.name}</div>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="text-white/80">${formatPrice(item.currentPrice)}</div>
                                                <div className={`text-xs ${item.marketData.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {formatPercent(item.marketData.changePercent)}
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="text-white/80">{item.quantity}</div>
                                                <div className="text-xs text-white/50">Avg: ${formatPrice(item.avgBuyPrice)}</div>
                                            </td>
                                            <td className="p-4 text-right font-medium text-white/90">
                                                ${formatPrice(item.value)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className={item.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                                                    {item.pnl >= 0 ? '+' : '-'}${formatPrice(Math.abs(item.pnl))}
                                                </div>
                                                <div className={`text-xs ${item.pnlPercent >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {item.pnlPercent.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-white/10 rounded-md text-white/50 hover:text-white">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                                    </button>
                                                    <button onClick={() => removeHolding(item.symbol)} className="p-1.5 hover:bg-red-500/10 rounded-md text-white/50 hover:text-red-400">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="md:hidden space-y-4">
                            {portfolioData.map((item) => (
                                <div key={item.symbol} className="relative">
                                    <MobileAssetCard
                                        asset={item.marketData}
                                        extraDetail={{
                                            label: 'Net P&L',
                                            value: `${item.pnl >= 0 ? '+' : '-'}$${formatPrice(Math.abs(item.pnl))}`
                                        }}
                                    />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <button onClick={() => openEditModal(item)} className="p-1 bg-white/5 rounded">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-24 border border-white/5 rounded-xl bg-white/[0.02]">
                        <p className="text-white/40 mb-4 font-light">Your portfolio is empty.</p>
                        <Button onClick={openAddModal}>Add Your First Asset</Button>
                    </div>
                )
                }
            </FadeIn >

            {/* Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
                        <div className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-light text-white">
                                    {editingItem ? 'Edit Holding' : 'Add New Asset'}
                                </h2>
                                <button onClick={closeModal} className="text-white/40 hover:text-white transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Asset</label>
                                    <select
                                        value={selectedSymbol}
                                        onChange={(e) => setSelectedSymbol(e.target.value)}
                                        disabled={!!editingItem}
                                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors disabled:opacity-50"
                                    >
                                        {sortedAssets.map(asset => (
                                            <option key={asset.symbol} value={asset.symbol} className="bg-neutral-900">
                                                {asset.symbol} - {asset.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Quantity</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Avg Buy Price ($)</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={buyPrice}
                                        onChange={(e) => setBuyPrice(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-white/[0.03] border border-white/[0.1] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                                        required
                                    />
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" onClick={closeModal} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button type="submit" className="flex-1">
                                        {editingItem ? 'Update' : 'Add Asset'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </main >
    );
}
