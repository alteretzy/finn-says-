import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'FinnSays — Real-Time Stock, Crypto & Commodity Tracker',
  description:
    'Track 100+ global stocks, cryptocurrencies, precious metals and commodities with real-time data, advanced charts, and institutional-grade analytics. Free forever.',
  keywords: [
    'stock market dashboard',
    'real-time stock prices',
    'cryptocurrency tracker',
    'commodity prices',
    'gold price live',
    'bitcoin price',
    'market data',
    'trading dashboard',
  ],
  openGraph: {
    title: 'FinnSays — Institutional-Grade Market Intelligence',
    description:
      'Track 100+ global assets with real-time data and advanced analytics',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinnSays — Real-Time Market Intelligence',
    description:
      'Track stocks, crypto, metals & commodities with real-time analytics',
  },
  alternates: {
    canonical: '/',
  },
};

export const revalidate = 60;

export default async function HomePage() {
  return <HomeClient />;
}
