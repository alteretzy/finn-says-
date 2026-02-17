'use client';

import { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol: string;
    theme?: 'light' | 'dark';
    autosize?: boolean;
    interval?: string;
    timezone?: string;
    style?: string;
    locale?: string;
    toolbar_bg?: string;
    enable_publishing?: boolean;
    hide_top_toolbar?: boolean;
    hide_legend?: boolean;
    save_image?: boolean;
    container_id?: string;
    hide_side_toolbar?: boolean;
    allow_symbol_change?: boolean;
    details?: boolean;
    calendar?: boolean;
    show_popup_button?: boolean;
    popup_width?: string;
    popup_height?: string;
}

function TradingViewWidget({ symbol }: { symbol: string }) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!container.current) return;

        // Clear previous script if any (though React should handle cleanup, script injection is manual)
        container.current.innerHTML = '';

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;

        // Map our symbols to TradingView symbols
        // Example: 'BTC-USD' -> 'BITSTAMP:BTCUSD' or 'COINBASE:BTCUSD'
        // Example: 'AAPL' -> 'NASDAQ:AAPL'
        // Example: 'GC=F' -> 'TVC:GOLD' or 'COMEX:GC1!'
        let tvSymbol = symbol;
        if (symbol.includes('-USD')) {
            // Crypto
            tvSymbol = `COINBASE:${symbol.replace('-USD', 'USD')}`;
        } else if (symbol.includes('=F')) {
            // Futures / Commodities (Basic mapping)
            if (symbol === 'GC=F') tvSymbol = 'COMEX:GC1!'; // Gold
            else if (symbol === 'SI=F') tvSymbol = 'COMEX:SI1!'; // Silver
            else if (symbol === 'CL=F') tvSymbol = 'NYMEX:CL1!'; // Crude Oil
            else if (symbol === 'NG=F') tvSymbol = 'NYMEX:NG1!'; // Nat Gas
            else tvSymbol = symbol.replace('=F', ''); // Fallback
        } else {
            // Stocks (default to NASDAQ/NYSE implicitly by symbol, or add prefix if needed)
            tvSymbol = symbol;
        }

        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": tvSymbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": "dark",
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true, // User requested full access/functionality
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "calc(100% - 32px)", width: "100%" }}></div>
            <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">Track all markets on TradingView</span></a></div>
        </div>
    );
}

export default memo(TradingViewWidget);
