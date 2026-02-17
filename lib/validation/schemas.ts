/**
 * Zod Validation Schemas for Financial Data
 * Wall Street-grade data validation — zero tolerance for bad data
 */

// Lightweight validation without external Zod dependency
// Uses runtime type checking with descriptive errors

import { DataValidationError } from '@/lib/errors/handler';

// ── Types ─────────────────────────────────────────

export interface ValidatedQuote {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: number;
    source: string;
}

export interface ValidatedCandle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

// ── Validators ────────────────────────────────────

function assertString(value: unknown, field: string): string {
    if (typeof value !== 'string' || value.length === 0) {
        throw new DataValidationError(`Expected non-empty string for ${field}`, field, value);
    }
    return value;
}

function assertPositiveNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || !isFinite(value) || value <= 0) {
        throw new DataValidationError(`Expected positive number for ${field}`, field, value);
    }
    return value;
}

function assertNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || !isFinite(value)) {
        throw new DataValidationError(`Expected number for ${field}`, field, value);
    }
    return value;
}

function assertNonNegativeNumber(value: unknown, field: string): number {
    if (typeof value !== 'number' || !isFinite(value) || value < 0) {
        throw new DataValidationError(`Expected non-negative number for ${field}`, field, value);
    }
    return value;
}

/**
 * Validate a quote from any data source
 */
export function validateQuote(data: Record<string, unknown>): ValidatedQuote {
    return {
        symbol: assertString(data.symbol, 'symbol'),
        price: assertPositiveNumber(data.price, 'price'),
        change: assertNumber(data.change, 'change'),
        changePercent: assertNumber(data.changePercent, 'changePercent'),
        volume: assertNonNegativeNumber(data.volume ?? 0, 'volume'),
        high: assertPositiveNumber(data.high, 'high'),
        low: assertPositiveNumber(data.low, 'low'),
        open: assertPositiveNumber(data.open, 'open'),
        previousClose: assertPositiveNumber(data.previousClose, 'previousClose'),
        timestamp: assertPositiveNumber(data.timestamp, 'timestamp'),
        source: assertString(data.source, 'source'),
    };
}

/**
 * Validate quote data loosely (allows zeros for some fields like change)
 * Used for API responses where some fields may be zero legitimately
 */
export function validateQuoteLoose(data: Record<string, unknown>): ValidatedQuote {
    return {
        symbol: assertString(data.symbol, 'symbol'),
        price: assertPositiveNumber(data.price, 'price'),
        change: assertNumber(data.change ?? 0, 'change'),
        changePercent: assertNumber(data.changePercent ?? 0, 'changePercent'),
        volume: assertNonNegativeNumber(data.volume ?? 0, 'volume'),
        high: assertPositiveNumber(data.high ?? data.price, 'high'),
        low: assertPositiveNumber(data.low ?? data.price, 'low'),
        open: assertPositiveNumber(data.open ?? data.price, 'open'),
        previousClose: assertPositiveNumber(data.previousClose ?? data.price, 'previousClose'),
        timestamp: typeof data.timestamp === 'number' && data.timestamp > 0
            ? data.timestamp
            : Date.now(),
        source: assertString(data.source ?? 'unknown', 'source'),
    };
}

/**
 * Validate candle data array
 */
export function validateCandles(data: Record<string, unknown>[]): ValidatedCandle[] {
    return data.map((candle, i) => ({
        timestamp: assertPositiveNumber(candle.timestamp, `candles[${i}].timestamp`),
        open: assertPositiveNumber(candle.open, `candles[${i}].open`),
        high: assertPositiveNumber(candle.high, `candles[${i}].high`),
        low: assertPositiveNumber(candle.low, `candles[${i}].low`),
        close: assertPositiveNumber(candle.close, `candles[${i}].close`),
        volume: assertNonNegativeNumber(candle.volume ?? 0, `candles[${i}].volume`),
    }));
}

/**
 * Safe parse — returns null on validation failure instead of throwing
 */
export function safeValidateQuote(data: Record<string, unknown>): ValidatedQuote | null {
    try {
        return validateQuoteLoose(data);
    } catch {
        return null;
    }
}
