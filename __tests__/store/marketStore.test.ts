import { useMarketStore } from '../../store/marketStore';

describe('MarketStore', () => {
    beforeEach(() => {
        // Reset store before each test
        const state = useMarketStore.getState();
        // Since we can't easily reset a real store, we'll just test the logic manually
    });

    it('calculates change percent correctly when missing from ticker', () => {
        const store = useMarketStore.getState();

        // 1. Manually set a previous close
        useMarketStore.setState({ previousCloses: { 'AAPL': 150 } });

        // 2. Trigger an update with no changePercent (Finnhub trade style)
        useMarketStore.getState().updateFromTicker({
            symbol: 'AAPL',
            price: 165,
            change: 15,
            changePercent: 0, // Finnhub often sends 0 for trades
            volume: 1000,
            timestamp: Date.now()
        });

        // 3. Verify that change was calculated: ((165 - 150) / 150) * 100 = 10%
        const updatedState = useMarketStore.getState();
        expect(updatedState.prices['AAPL']).toBe(165);
        expect(updatedState.changes['AAPL']).toBe(10);
    });

    it('respects change percent when provided by ticker', () => {
        useMarketStore.setState({ previousCloses: { 'BTC': 50000 } });

        useMarketStore.getState().updateFromTicker({
            symbol: 'BTC',
            price: 55000,
            change: 2500,
            changePercent: 5, // Ticker specifically says 5%
            volume: 1,
            timestamp: Date.now()
        });

        const updatedState = useMarketStore.getState();
        expect(updatedState.changes['BTC']).toBe(5);
    });
});
