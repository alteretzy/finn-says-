import { Metadata } from 'next';
import { getMarketData } from '@/lib/data/market-data';
import PortfolioClient from '@/components/data/PortfolioClient';

export const metadata: Metadata = {
    title: 'Portfolio | finn.io',
    description: 'Track your wealth and performance across markets.',
};

export const revalidate = 60;

export default async function PortfolioPage() {
    const marketData = await getMarketData();

    return <PortfolioClient initialData={marketData} />;
}
