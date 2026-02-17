import { metadata as homeMetadata } from '@/app/page';
import { metadata as newsMetadata } from '@/app/news/page';
import { metadata as screenerMetadata } from '@/app/screener/page';
import { metadata as watchlistMetadata } from '@/app/watchlist/page';
import { metadata as marketsMetadata } from '@/app/markets/page';

describe('SEO Metadata Validation', () => {

    const checkMetadata = (name: string, meta: any) => {
        test(`${name} has title`, () => {
            expect(meta.title).toBeDefined();
            expect(typeof meta.title === 'string' || typeof meta.title?.default === 'string').toBeTruthy();
        });

        test(`${name} has description`, () => {
            expect(meta.description).toBeDefined();
            expect(meta.description.length).toBeGreaterThan(10);
        });

        test(`${name} has keywords`, () => {
            expect(meta.keywords).toBeDefined();
            expect(Array.isArray(meta.keywords)).toBeTruthy();
            expect(meta.keywords.length).toBeGreaterThan(0);
        });

        test(`${name} has OpenGraph tags`, () => {
            expect(meta.openGraph).toBeDefined();
            expect(meta.openGraph.title).toBeDefined();
            expect(meta.openGraph.description).toBeDefined();
            expect(meta.openGraph.type).toBe('website');
        });

        test(`${name} has Twitter card`, () => {
            expect(meta.twitter).toBeDefined();
            expect(meta.twitter.card).toBe('summary_large_image');
            expect(meta.twitter.title).toBeDefined();
            expect(meta.twitter.description).toBeDefined();
        });

        test(`${name} has canonical URL`, () => {
            expect(meta.alternates).toBeDefined();
            expect(meta.alternates.canonical).toBeDefined();
        });
    };

    checkMetadata('Home Page', homeMetadata);
    checkMetadata('News Page', newsMetadata);
    checkMetadata('Screener Page', screenerMetadata);
    checkMetadata('Watchlist Page', watchlistMetadata);
    checkMetadata('Markets Page', marketsMetadata);

});
