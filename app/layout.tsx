import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import '../styles/water-ball.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
import { generateOrganizationSchema } from '@/lib/seo/schema';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { CommandPalette } from '@/components/ui/CommandPalette';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with actual ID

export const metadata: Metadata = {
  metadataBase: new URL('https://finnsays.vercel.app'),
  title: {
    default: 'FinnSays | Institutional-Grade Market Intelligence',
    template: '%s | FinnSays',
  },
  description:
    'Track 100+ global stocks, cryptocurrencies, precious metals & commodities with real-time data, advanced charts, and institutional-grade analytics.',
  keywords: [
    'stock market',
    'cryptocurrency',
    'trading',
    'financial data',
    'real-time quotes',
    'market analysis',
    'precious metals',
    'commodities',
    'gold',
    'bitcoin',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'FinnSays',
    description: 'Track 100+ global stocks, cryptocurrencies, precious metals & commodities with real-time institutional-grade analytics.',
  },
  twitter: {
    card: 'summary_large_image',
    description: 'Track 100+ global stocks, cryptos, metals & commodities with real-time analytics.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} bg-black text-white font-sans antialiased selection:bg-[#0066FF] selection:text-white relative before:pointer-events-none before:fixed before:inset-0 before:z-[-1] before:bg-[radial-gradient(circle_at_bottom_left,rgba(0,85,255,0.08),transparent_40%),radial-gradient(circle_at_top_right,rgba(0,85,255,0.08),transparent_40%)]`}>
        <AuthProvider>
          <a
            href="#main-content"
            className="skip-link"
          >
            Skip to main content
          </a>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main id="main-content" className="flex-grow">{children}</main>
            <Footer />
            <CommandPalette />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
