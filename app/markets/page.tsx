
import { Metadata } from 'next';
import MarketsClient from './MarketsClient';

export const metadata: Metadata = {
    title: 'All Markets — Stocks, Crypto, Metals & Commodities',
    description:
        'Explore real-time market data for stocks, cryptocurrencies, precious metals and commodities. Sort, filter, and analyze 100+ assets with institutional-grade tools.',
};

export default function MarketsPage() {
    return <MarketsClient />;
}
