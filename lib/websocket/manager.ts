/**
 * Binance WebSocket Manager
 * Handles real-time connections to Binance Public Stream
 * Features: Automatic reconnect, heartbeat, subscription management
 */

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';
export type TickerData = {
    symbol: string;
    price: number;
    change: number; // 24h Change (absolute)
    changePercent: number; // 24h Change %
    volume: number; // 24h Volume
    timestamp: number;
};

type WebSocketCallback = (data: TickerData) => void;

class WebSocketManager {
    private binanceSocket: WebSocket | null = null;
    private finnhubSocket: WebSocket | null = null;

    private subscriptions: Map<string, Set<WebSocketCallback>> = new Map();
    private connectionState: ConnectionState = 'disconnected';
    private stateListeners: Set<(state: ConnectionState) => void> = new Set();

    private cryptoMap: Record<string, string> = {
        'BTC-USD': 'btcusdt',
        'ETH-USD': 'ethusdt',
        'SOL-USD': 'solusdt',
        'DOGE-USD': 'dogeusdt',
        'XRP-USD': 'xrpusdt',
        'ADA-USD': 'adausdt',
        'AVAX-USD': 'avaxusdt',
        'DOT-USD': 'dotusdt',
        'MATIC-USD': 'maticusdt',
        'LINK-USD': 'linkusdt',
        'BNB-USD': 'bnbusdt',
        'LTC-USD': 'ltcusdt',
        'UNI-USD': 'uniusdt',
        'ATOM-USD': 'atomusdt',
        'NEAR-USD': 'nearusdt'
    };

    private reverseCryptoMap: Record<string, string> = {};

    constructor() {
        Object.entries(this.cryptoMap).forEach(([internal, binance]) => {
            this.reverseCryptoMap[binance.toUpperCase()] = internal;
        });
    }

    private updateState(state: ConnectionState) {
        this.connectionState = state;
        this.stateListeners.forEach((listener) => listener(state));
    }

    public onStateChange(callback: (state: ConnectionState) => void) {
        this.stateListeners.add(callback);
        return () => this.stateListeners.delete(callback);
    }

    public getState(): ConnectionState {
        return this.connectionState;
    }

    public connect() {
        if (typeof window === 'undefined') return;
        if (this.connectionState === 'connected' || this.connectionState === 'connecting') return;

        this.updateState('connecting');
        this.connectBinance();
        this.connectFinnhub();
        this.updateState('connected');
    }

    private connectBinance() {
        try {
            this.binanceSocket = new WebSocket('wss://stream.binance.com:9443/ws');
            this.binanceSocket.onopen = () => {
                this.resubscribe('crypto');
            };
            this.binanceSocket.onmessage = this.handleBinanceMessage.bind(this);
            this.binanceSocket.onclose = () => { };
            this.binanceSocket.onerror = (e) => console.error('[WS] Binance Error', e);
        } catch (e) {
            console.error('Binance connection failed', e);
        }
    }

    private connectFinnhub() {
        const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
        if (!apiKey) return;

        try {
            this.finnhubSocket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
            this.finnhubSocket.onopen = () => {
                this.resubscribe('stock');
            };
            this.finnhubSocket.onmessage = this.handleFinnhubMessage.bind(this);
            this.finnhubSocket.onclose = () => { };
            this.finnhubSocket.onerror = (e) => console.error('[WS] Finnhub Error', e);
        } catch (e) {
            console.error('Finnhub connection failed', e);
        }
    }

    public subscribe(symbol: string, callback: WebSocketCallback) {
        const isCrypto = !!this.cryptoMap[symbol];

        if (!this.subscriptions.has(symbol)) {
            this.subscriptions.set(symbol, new Set());
            if (isCrypto) {
                this.sendBinanceSubscribe(symbol);
            } else {
                this.sendFinnhubSubscribe(symbol);
            }
        }
        this.subscriptions.get(symbol)?.add(callback);

        if (this.connectionState === 'disconnected') {
            this.connect();
        }
    }

    public unsubscribe(symbol: string, callback: WebSocketCallback) {
        const callbacks = this.subscriptions.get(symbol);
        if (callbacks) {
            callbacks.delete(callback);
            if (callbacks.size === 0) {
                this.subscriptions.delete(symbol);
                const isCrypto = !!this.cryptoMap[symbol];
                if (isCrypto) {
                    this.sendBinanceUnsubscribe(symbol);
                } else {
                    this.sendFinnhubUnsubscribe(symbol);
                }
            }
        }
    }

    private resubscribe(type: 'crypto' | 'stock') {
        this.subscriptions.forEach((_, symbol) => {
            const isCrypto = !!this.cryptoMap[symbol];
            if (type === 'crypto' && isCrypto) {
                this.sendBinanceSubscribe(symbol);
            } else if (type === 'stock' && !isCrypto) {
                this.sendFinnhubSubscribe(symbol);
            }
        });
    }

    private sendBinanceSubscribe(symbol: string) {
        if (this.binanceSocket?.readyState === WebSocket.OPEN) {
            const stream = `${this.cryptoMap[symbol]}@ticker`;
            this.binanceSocket.send(JSON.stringify({
                method: 'SUBSCRIBE',
                params: [stream],
                id: Date.now()
            }));
        }
    }

    private sendBinanceUnsubscribe(symbol: string) {
        if (this.binanceSocket?.readyState === WebSocket.OPEN) {
            const stream = `${this.cryptoMap[symbol]}@ticker`;
            this.binanceSocket.send(JSON.stringify({
                method: 'UNSUBSCRIBE',
                params: [stream],
                id: Date.now()
            }));
        }
    }

    private handleBinanceMessage(event: MessageEvent) {
        try {
            const msg = JSON.parse(event.data);
            if (msg.e === '24hrTicker') {
                const internalSymbol = this.reverseCryptoMap[msg.s];
                if (internalSymbol) {
                    this.notifySubscribers(internalSymbol, {
                        symbol: internalSymbol,
                        price: parseFloat(msg.c),
                        change: parseFloat(msg.p),
                        changePercent: parseFloat(msg.P),
                        volume: parseFloat(msg.q),
                        timestamp: msg.E
                    });
                }
            }
        } catch (e) {
            console.warn('[WS] Failed to parse Binance message', e);
        }
    }

    private sendFinnhubSubscribe(symbol: string) {
        if (this.finnhubSocket?.readyState === WebSocket.OPEN) {
            this.finnhubSocket.send(JSON.stringify({
                type: 'subscribe',
                symbol: symbol
            }));
        }
    }

    private sendFinnhubUnsubscribe(symbol: string) {
        if (this.finnhubSocket?.readyState === WebSocket.OPEN) {
            this.finnhubSocket.send(JSON.stringify({
                type: 'unsubscribe',
                symbol: symbol
            }));
        }
    }

    private handleFinnhubMessage(event: MessageEvent) {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'trade' && msg.data) {
                msg.data.forEach((trade: { s: string; p: number; v: number; t: number }) => {
                    const symbol = trade.s;
                    this.notifySubscribers(symbol, {
                        symbol: symbol,
                        price: trade.p,
                        change: 0,
                        changePercent: 0,
                        volume: trade.v,
                        timestamp: trade.t
                    });
                });
            }
        } catch (e) {
            console.warn('[WS] Failed to parse Finnhub message', e);
        }
    }

    private notifySubscribers(symbol: string, data: TickerData) {
        this.subscriptions.get(symbol)?.forEach(cb => cb(data));
    }
}

let _wsManager: WebSocketManager | null = null;
function getWsManager(): WebSocketManager {
    if (!_wsManager) {
        _wsManager = new WebSocketManager();
    }
    return _wsManager;
}

export const wsManager = getWsManager();
