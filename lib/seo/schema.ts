import { AssetData } from '@/lib/finnhub/types';
import { SITE_NAME, SITE_URL } from '@/lib/utils/constants';

export function generateAssetSchema(asset: AssetData) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FinancialProduct',
        name: asset.name,
        identifier: asset.symbol,
        description: asset.description || `Live price and market data for ${asset.name} (${asset.symbol})`,
        offers: {
            '@type': 'Offer',
            price: asset.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
            priceValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0],
        },
        provider: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        description:
            'Institutional-grade market intelligence. Track 100+ global stocks, cryptocurrencies, precious metals & commodities with real-time precision.',
    };
}

export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}
