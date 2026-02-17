'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, HistogramData, LineData } from 'lightweight-charts';

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface CandlestickChartProps {
    data: CandleData[];
    symbol?: string;
    height?: number;
    showRangeSelector?: boolean;
    showIndicators?: boolean;
}

const RANGES: { key: TimeRange; label: string }[] = [
    { key: '1D', label: '1D' },
    { key: '1W', label: '1W' },
    { key: '1M', label: '1M' },
    { key: '3M', label: '3M' },
    { key: '6M', label: '6M' },
    { key: '1Y', label: '1Y' },
    { key: 'ALL', label: 'ALL' },
];

function computeSMA(data: CandleData[], period: number): { time: string; value: number }[] {
    const result: { time: string; value: number }[] = [];
    for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
            sum += data[i - j].close;
        }
        result.push({ time: data[i].time, value: sum / period });
    }
    return result;
}

export default function CandlestickChart({
    data: initialData,
    symbol,
    height = 500,
    showRangeSelector = true,
    showIndicators = true,
}: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [activeRange, setActiveRange] = useState<TimeRange>('1M');
    const [chartData, setChartData] = useState<CandleData[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [showSMA20, setShowSMA20] = useState(false);
    const [showSMA50, setShowSMA50] = useState(false);
    const [crosshairData, setCrosshairData] = useState<CandleData | null>(null);

    // Fetch candle data for time range
    const fetchRangeData = useCallback(async (range: TimeRange) => {
        if (!symbol) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/proxy/candles?symbol=${symbol}&range=${range}`);
            if (!res.ok) return;
            const json = await res.json();
            if (json.success && Array.isArray(json.data) && json.data.length > 0) {
                setChartData(json.data);
            }
        } catch (e) {
            console.error('Failed to fetch range data:', e);
        } finally {
            setLoading(false);
        }
    }, [symbol]);

    const handleRangeChange = useCallback((range: TimeRange) => {
        setActiveRange(range);
        fetchRangeData(range);
    }, [fetchRangeData]);

    // Keep in sync with external data
    useEffect(() => {
        if (initialData?.length > 0) {
            setChartData(initialData);
        }
    }, [initialData]);

    // Chart creation & updates
    useEffect(() => {
        if (!chartContainerRef.current || !chartData?.length) return;

        // Clean up previous chart
        if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
            candleSeriesRef.current = null;
        }

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: 'rgba(255, 255, 255, 0.5)',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.03)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.03)' },
            },
            width: chartContainerRef.current.clientWidth,
            height,
            crosshair: {
                mode: 0,
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0055FF',
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0055FF',
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.06)',
                timeVisible: true,
                secondsVisible: false,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.06)',
            },
        });

        // Candlestick series
        const candleSeries = chart.addCandlestickSeries({
            upColor: '#10B981',
            downColor: '#EF4444',
            borderUpColor: '#10B981',
            borderDownColor: '#EF4444',
            wickUpColor: '#10B981',
            wickDownColor: '#EF4444',
        });
        candleSeries.setData(chartData as CandlestickData[]);
        candleSeriesRef.current = candleSeries;

        // Volume histogram
        const volumeData = chartData
            .filter((d) => d.volume !== undefined && d.volume > 0)
            .map((d) => ({
                time: d.time,
                value: d.volume!,
                color: d.close >= d.open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            }));

        if (volumeData.length > 0) {
            const volumeSeries = chart.addHistogramSeries({
                priceFormat: { type: 'volume' },
                priceScaleId: 'volume',
            });
            volumeSeries.priceScale().applyOptions({
                scaleMargins: { top: 0.85, bottom: 0 },
            });
            volumeSeries.setData(volumeData as HistogramData[]);
        }

        // SMA overlays
        if (showSMA20 && chartData.length >= 20) {
            const sma20Data = computeSMA(chartData, 20);
            const sma20Series = chart.addLineSeries({
                color: '#3B82F6',
                lineWidth: 1,
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: false,
            });
            sma20Series.setData(sma20Data as LineData[]);
        }

        if (showSMA50 && chartData.length >= 50) {
            const sma50Data = computeSMA(chartData, 50);
            const sma50Series = chart.addLineSeries({
                color: '#F59E0B',
                lineWidth: 1,
                priceLineVisible: false,
                lastValueVisible: false,
                crosshairMarkerVisible: false,
            });
            sma50Series.setData(sma50Data as LineData[]);
        }

        // Crosshair move handler
        chart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.seriesData) {
                setCrosshairData(null);
                return;
            }
            const candleValue = param.seriesData.get(candleSeries) as CandlestickData;
            if (candleValue && 'open' in candleValue) {
                setCrosshairData({
                    time: param.time as string,
                    open: candleValue.open,
                    high: candleValue.high,
                    low: candleValue.low,
                    close: candleValue.close,
                });
            }
        });

        chart.timeScale().fitContent();
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
        };
    }, [chartData, height, showSMA20, showSMA50]);

    const displayCandle = crosshairData || (chartData.length > 0 ? chartData[chartData.length - 1] : null);

    return (
        <div className="bg-black/40 backdrop-blur-xl border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/[0.04]">
                {/* OHLC Display */}
                {displayCandle && (
                    <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-white/50">O <span className="text-white/60">{displayCandle.open != null ? displayCandle.open.toFixed(2) : '—'}</span></span>
                        <span className="text-white/50">H <span className="text-emerald-400/80">{displayCandle.high != null ? displayCandle.high.toFixed(2) : '—'}</span></span>
                        <span className="text-white/50">L <span className="text-red-400/80">{displayCandle.low != null ? displayCandle.low.toFixed(2) : '—'}</span></span>
                        <span className="text-white/50">C <span className="text-white/80">{displayCandle.close != null ? displayCandle.close.toFixed(2) : '—'}</span></span>
                    </div>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    {/* Indicator toggles */}
                    {showIndicators && (
                        <div className="flex items-center gap-1 mr-2">
                            <button
                                onClick={() => setShowSMA20(!showSMA20)}
                                className={`px-2 py-1 text-[10px] rounded-md border transition-all ${showSMA20
                                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                                    : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white/50'
                                    }`}
                            >
                                SMA20
                            </button>
                            <button
                                onClick={() => setShowSMA50(!showSMA50)}
                                className={`px-2 py-1 text-[10px] rounded-md border transition-all ${showSMA50
                                    ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                                    : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white/50'
                                    }`}
                            >
                                SMA50
                            </button>
                        </div>
                    )}

                    {/* Range selector */}
                    {showRangeSelector && symbol && (
                        <div className="flex items-center gap-1">
                            {RANGES.map((r) => (
                                <button
                                    key={r.key}
                                    onClick={() => handleRangeChange(r.key)}
                                    disabled={loading}
                                    className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-md border transition-all ${activeRange === r.key
                                        ? 'bg-[#0055FF]/20 border-[#0055FF]/30 text-[#0055FF]'
                                        : 'bg-white/[0.02] border-white/5 text-white/50 hover:text-white/50 hover:border-white/10'
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="relative p-2">
                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl">
                        <div className="w-6 h-6 border-2 border-[#0055FF]/30 border-t-[#0055FF] rounded-full animate-spin" />
                    </div>
                )}
                <div ref={chartContainerRef} />
            </div>
        </div>
    );
}
