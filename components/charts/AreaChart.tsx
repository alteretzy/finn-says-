'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, AreaData, HistogramData, Time } from 'lightweight-charts';

interface CandleData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

type TimeRange = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL';

interface AreaChartProps {
    data: CandleData[];
    symbol?: string;
    height?: number;
    showRangeSelector?: boolean;
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

export default function AreaChart({
    data: initialData,
    symbol,
    height = 500,
    showRangeSelector = true,
}: AreaChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const areaSeriesRef = useRef<ISeriesApi<'Area'> | null>(null);

    const [activeRange, setActiveRange] = useState<TimeRange>('1M');
    const [chartData, setChartData] = useState<CandleData[]>(initialData);
    const [loading, setLoading] = useState(false);
    const [crosshairValue, setCrosshairValue] = useState<{ time: string; value: number } | null>(null);

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
            areaSeriesRef.current = null;
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
                mode: 1, // Magnet
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

        const areaSeries = chart.addAreaSeries({
            topColor: 'rgba(0, 85, 255, 0.4)',
            bottomColor: 'rgba(0, 85, 255, 0.0)',
            lineColor: '#0055FF',
            lineWidth: 2,
        });

        const data = chartData.map(d => ({ time: d.time, value: d.close }));
        areaSeries.setData(data as AreaData<Time>[]);
        areaSeriesRef.current = areaSeries;

        // Crosshair move handler
        chart.subscribeCrosshairMove((param) => {
            if (!param.time || !param.seriesData) {
                setCrosshairValue(null);
                return;
            }
            const value = param.seriesData.get(areaSeries);
            if (value && 'value' in value) {
                setCrosshairValue({
                    time: param.time as string,
                    value: (value as any).value,
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
    }, [chartData, height]);

    const lastPoint = chartData.length > 0 ? chartData[chartData.length - 1] : null;
    const displayValue = crosshairValue?.value ?? lastPoint?.close ?? 0;

    return (
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-light text-white tabular-nums">${Number.isFinite(displayValue) ? displayValue.toFixed(2) : '—'}</span>
                    {crosshairValue && <span className="text-xs text-white/40">{crosshairValue.time}</span>}
                </div>

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
