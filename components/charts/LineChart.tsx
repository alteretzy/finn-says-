'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, LineData, Time } from 'lightweight-charts';

interface LineChartProps {
    data: Array<{
        time: string;
        value: number;
    }>;
    height?: number;
    color?: string;
}

export default function LineChart({
    data,
    height = 400,
    color = '#0066FF',
}: LineChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current || data.length === 0) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: '#000000' },
                textColor: 'rgba(255, 255, 255, 0.6)',
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
            },
            grid: {
                vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
                horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
            },
            width: chartContainerRef.current.clientWidth,
            height,
            crosshair: {
                mode: 0,
                vertLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0066FF',
                },
                horzLine: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    width: 1,
                    style: 3,
                    labelBackgroundColor: '#0066FF',
                },
            },
            timeScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
                timeVisible: true,
            },
            rightPriceScale: {
                borderColor: 'rgba(255, 255, 255, 0.1)',
            },
        });

        const lineSeries = chart.addAreaSeries({
            lineColor: color,
            topColor: `${color}33`,
            bottomColor: `${color}05`,
            lineWidth: 2,
        });

        lineSeries.setData(data as LineData<Time>[]);
        chart.timeScale().fitContent();
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data, height, color]);

    return (
        <div className="bg-black border border-white/10 rounded-2xl p-4 md:p-6">
            <div ref={chartContainerRef} />
        </div>
    );
}

