import { Metadata } from 'next';
import MarketsClient from '../markets/MarketsClient';


export const metadata: Metadata = {
    title: 'Stocks Market — Institutional-Grade Analytics | FinnSays',
    description: 'Track global stocks with real-time data, advanced charts, and technical indicators. Monitor Apple, Microsoft, Tesla, and more mega-cap growth stocks.',
};

export const revalidate = 60;

export default function StocksPage() {
    return <MarketsClient initialType="Stocks" />;
}
