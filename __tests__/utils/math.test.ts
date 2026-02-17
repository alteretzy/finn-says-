import { formatPrice, formatChange, formatPercent } from '../../lib/utils/formatters';

describe('Math & Formatting Utils', () => {
    describe('formatPrice', () => {
        it('formats prices >= 1 with 2 decimals by default', () => {
            expect(formatPrice(1234.567)).toBe('1,234.57');
        });

        it('handles sub-dollar values with higher precision', () => {
            expect(formatPrice(0.001234, 2)).toBe('0.0012');
            expect(formatPrice(0.001234, 6)).toBe('0.001234');
        });
    });

    describe('formatChange', () => {
        it('adds a plus sign for positive changes', () => {
            expect(formatChange(1.23)).toBe('+1.23');
        });

        it('keeps the minus sign for negative changes', () => {
            expect(formatChange(-1.23)).toBe('-1.23');
        });
    });

    describe('formatPercent', () => {
        it('formats and adds % suffix', () => {
            expect(formatPercent(5.678)).toBe('+5.68%');
            expect(formatPercent(-1.2)).toBe('-1.20%');
        });
    });
});
