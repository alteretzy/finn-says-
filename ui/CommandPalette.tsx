'use client';

import * as React from 'react';
import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();

    // Toggle with Cmd+K
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = React.useCallback((command: () => void) => {
        setOpen(false);
        command();
    }, []);

    // Basic list of assets to search (enrich this later with a full asset list)
    // For now, we use keys from the store + some defaults
    const knownAssets = [
        { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Stock' },
        { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
        { symbol: 'AMD', name: 'Advanced Micro Devices', type: 'Stock' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
        { symbol: 'COIN', name: 'Coinbase Global', type: 'Stock' },
        { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin', type: 'Crypto' },
        { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum', type: 'Crypto' },
        { symbol: 'BINANCE:SOLUSDT', name: 'Solana', type: 'Crypto' },
    ];

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-[#0A0A0E]/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
        >
            <div className="flex items-center border-b border-white/5 px-4">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/40 mr-3">
                    <path d="M10.6126 10.6126C8.80786 12.4173 5.88173 12.4173 4.07702 10.6126C2.27231 8.80786 2.27231 5.88173 4.07702 4.07702C5.88173 2.27231 8.80786 2.27231 10.6126 4.07702C12.4173 5.88173 12.4173 8.80786 10.6126 10.6126ZM10.5976 11.6582C8.58316 13.4385 5.51878 13.3912 3.54668 11.4191C1.49747 9.36988 1.49747 6.04718 3.54668 3.99797C5.59588 1.94876 8.91858 1.94876 10.9678 3.99797C12.9399 5.97007 12.9872 9.03444 11.2069 11.0489L13.7803 13.6223C13.9268 13.7688 13.9268 14.0062 13.7803 14.1527C13.6339 14.2991 13.3965 14.2991 13.25 14.1527L10.5976 11.6582Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
                <Command.Input
                    placeholder="Type a command or search..."
                    className="w-full h-14 bg-transparent text-white placeholder-white/30 text-sm outline-none font-light"
                />
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2">
                <Command.Empty className="py-6 text-center text-sm text-white/20">No results found.</Command.Empty>

                <Command.Group heading="Navigation" className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-2 px-2 mt-2">
                    <CommandItem onSelect={() => runCommand(() => router.push('/'))}>
                        <span className="opacity-50 mr-2">🏠</span> Home
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/markets'))}>
                        <span className="opacity-50 mr-2">📊</span> Markets
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/watchlist'))}>
                        <span className="opacity-50 mr-2">⭐</span> Watchlist
                    </CommandItem>
                </Command.Group>

                <Command.Group heading="Assets" className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-2 px-2 mt-2">
                    {knownAssets.map((asset) => (
                        <CommandItem
                            key={asset.symbol}
                            onSelect={() => runCommand(() => {
                                // Handle mapping logic for unified symbols vs route symbols needs
                                const routeSymbol = asset.symbol.startsWith('BINANCE:') ? asset.symbol.replace('BINANCE:', '').replace('USDT', '-USD') : asset.symbol;
                                router.push(`/asset/${routeSymbol}`);
                            })}
                        >
                            <div className="flex justify-between w-full items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-medium w-12">{asset.symbol.replace('BINANCE:', '').replace('USDT', '')}</span>
                                    <span className="text-white/40 text-xs">{asset.name}</span>
                                </div>
                                <span className="text-[10px] text-white/20 border border-white/10 px-1.5 py-0.5 rounded uppercase">{asset.type}</span>
                            </div>
                        </CommandItem>
                    ))}
                </Command.Group>

                <Command.Group heading="System" className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-2 px-2 mt-2">
                    <CommandItem onSelect={() => runCommand(() => window.location.reload())}>
                        <span className="opacity-50 mr-2">🔄</span> Reload Application
                    </CommandItem>
                </Command.Group>
            </Command.List>

            <div className="border-t border-white/5 px-4 py-2 flex justify-between items-center text-[10px] text-white/50">
                <span>Search anything...</span>
                <div className="flex gap-2">
                    <span className="bg-white/5 border border-white/10 px-1.5 rounded">↑↓</span>
                    <span>to navigate</span>
                    <span className="bg-white/5 border border-white/10 px-1.5 rounded">↵</span>
                    <span>to select</span>
                </div>
            </div>
        </Command.Dialog>
    );
}

function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex items-center h-10 px-3 rounded-lg text-sm text-white/70 aria-selected:bg-[#0055FF]/20 aria-selected:text-white cursor-pointer transition-colors"
        >
            {children}
        </Command.Item>
    );
}
