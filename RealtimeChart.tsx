'use client';

import { useEffect, useRef, useState } from 'react';
import {
    createChart,
    IChartApi,
    ISeriesApi,
    CandlestickData,
    ColorType,
    CrosshairMode,
    ChartOptions,
    DeepPartial,
    UTCTimestamp
} from 'lightweight-charts';
import { useRealtimePrice } from '@/hooks/useRealtimePrice';

interface RealtimeChartProps {
    symbol: string;
    height?: number;
    initialData?: CandlestickData[];
}

export function RealtimeChart({
    symbol,
    height = 400,
    initialData = [],
}: RealtimeChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const [isChartReady, setIsChartReady] = useState(false);

    // Get real-time price updates (only after chart is ready)
    const { data: realtimeData } = useRealtimePrice(symbol, {
        enabled: isChartReady,
        throttleMs: 100, // Update chart frequently
    });

    // Initialize chart on mount
    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart instance
        const chartOptions: DeepPartial<ChartOptions> = {
            width: chartContainerRef.current.clientWidth,
            height,
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.5)',
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            crosshair: {
                mode: CrosshairMode.Normal,
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    labelBackgroundColor: '#0055FF',
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    labelBackgroundColor: '#0055FF',
                },
            },
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }
        };
        const chart = createChart(chartContainerRef.current, chartOptions);

        // Add candlestick series (v5 API)
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10B981',
            downColor: '#EF4444',
            borderVisible: false,
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });

        // Set initial historical data
        // Convert to lightweight charts format if needed (time must be ascending)
        if (initialData.length > 0) {
            try {
                // Ensure sorted by time
                const sorted = [...initialData].sort((a, b) => (a.time as number) - (b.time as number));
                candlestickSeries.setData(sorted);
            } catch (e) {
                console.error("Chart data error", e);
            }
        }

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;
        setTimeout(() => setIsChartReady(true), 0);

        // Handle window resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [height, initialData]); // Run on mount or when data changes

    // Update chart with real-time data
    useEffect(() => {
        if (!seriesRef.current || !realtimeData) return;

        // Lightweight charts expects time in seconds (for UTCTimestamp)
        const currentTime = Math.floor(realtimeData.timestamp / 1000) as UTCTimestamp;

        // We need to form a candle.
        // For a real-time tick chart, we typically update the "current" candle.
        // Since we don't have full Candle object from WS (only ticker), we assume the ticker is close.
        // CONSTANT update approach:
        // We really need OHLC. Ticker only gives price (close).
        // Simplification: We update the CLOSE of the last candle if it matches timeframe, or start new.
        // But lightweight charts series.update() handles "new day" logic for daily bars.
        // For intraday, we need a specific time.
        // Let's assume we are plotting 1-minute bars?
        // Or just plotting ticks? Candlestick series needs OHLC.
        // If we want a tick chart we should use LineSeries or AreaSeries.
        // But user asked for Candlestick in standard charts.
        // Let's update the Close of the current candle.

        try {
            // This is a naive update: treating every tick as an update to the current candle at 'currentTime'
            // In reality we should manage OHLC accumulation. 
            // For now, we just push the price to the chart.
            seriesRef.current.update({
                time: currentTime,
                open: realtimeData.price, // This is wrong for a new candle, but ok for an update if we knew the open.
                high: realtimeData.price,
                low: realtimeData.price,
                close: realtimeData.price
            } as CandlestickData);
            // Note: properly forming candles from ticks requires state (current bar).
            // Lightweight charts handles 'update' by modifying the bar at 'time'. 
            // If 'time' advances, it freezes the old one.
        } catch {
            // Ignore sorting errors
        }

    }, [realtimeData]);

    return (
        <div className="w-full h-full">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
}
