export interface YahooNewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number;
    type: string;
    thumbnail?: {
        resolutions: { url: string; width: number; height: number }[];
    };
    relatedTickers?: string[];
}

const BASE_URL = 'https://query2.finance.yahoo.com/v1/finance/search';

export async function searchYahooNews(query: string, count: number = 4): Promise<YahooNewsItem[]> {
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(query)}&newsCount=${count}&enableFuzzyQuery=false&quotesCount=0&enableCb=false`;

        const res = await fetch(url, { next: { revalidate: 300 } }); // Cache for 5 mins

        if (!res.ok) {
            console.error(`Yahoo Finance API error: ${res.status}`);
            return [];
        }

        const data = await res.json();
        const news = data.news || [];

        return news.map((item: any) => ({
            uuid: item.uuid,
            title: item.title,
            publisher: item.publisher,
            link: item.link,
            providerPublishTime: item.providerPublishTime,
            type: item.type,
            thumbnail: item.thumbnail,
            relatedTickers: item.relatedTickers,
        }));
    } catch (error) {
        console.error('Failed to fetch Yahoo news:', error);
        return [];
    }
}
