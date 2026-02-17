import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AssetHeader from '../components/data/AssetHeader';
import { MarketAsset } from '../lib/finnhub/types';

// Mock child components to isolate unit test
jest.mock('../components/ui/Button', () => ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>);
jest.mock('../components/ui/Badge', () => ({ children }: any) => <div>{children}</div>);
jest.mock('../components/animations/FadeIn', () => ({ children }: any) => <div>{children}</div>);
jest.mock('../hooks/useWatchlist', () => ({
    useWatchlist: () => ({
        isInWatchlist: (symbol: string) => false,
        toggleWatchlist: jest.fn()
    })
}));

describe('AssetHeader', () => {
    const mockAsset: MarketAsset = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        price: 150.00,
        change: 2.50,
        changePercent: 1.5,
        volume: 1000000,
        marketCap: 2000000000,
        sparklineData: []
    };

    it('renders asset name and symbol', () => {
        render(<AssetHeader
            symbol="AAPL"
            asset={mockAsset}
            currentPrice={150.00}
            priceChange={2.50}
            percentChange={1.5}
        />);

        expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
        expect(screen.getByText('AAPL')).toBeInTheDocument();
    });

    it('displays correct price formatting', () => {
        render(<AssetHeader
            symbol="AAPL"
            asset={mockAsset}
            currentPrice={1234.56}
            priceChange={10.00}
            percentChange={0.8}
        />);

        expect(screen.getByText('$1,234.56')).toBeInTheDocument();
    });

    it('applies positive styling for gainers', () => {
        render(<AssetHeader
            symbol="AAPL"
            asset={mockAsset}
            currentPrice={150.00}
            priceChange={5.00}
            percentChange={1.0}
        />);

        // Check for green color class substring logic or specific text content
        const changeText = screen.getByText('+5.00');
        expect(changeText).toHaveClass('text-emerald-400');
    });

    it('applies negative styling for losers', () => {
        render(<AssetHeader
            symbol="AAPL"
            asset={mockAsset}
            currentPrice={140.00}
            priceChange={-5.00}
            percentChange={-1.0}
        />);

        const changeText = screen.getByText('-5.00');
        expect(changeText).toHaveClass('text-red-400');
    });
});
