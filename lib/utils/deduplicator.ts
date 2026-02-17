/**
 * Request Deduplication Utility
 * Prevents duplicate in-flight API requests for the same key
 */

class RequestDeduplicator {
    private pending: Map<string, Promise<unknown>>;

    constructor() {
        this.pending = new Map();
    }

    /**
     * If a request with the same key is already in-flight, return that promise.
     * Otherwise, execute the function and track it.
     */
    async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
        if (this.pending.has(key)) {
            return this.pending.get(key) as Promise<T>;
        }

        const promise = fn().finally(() => {
            this.pending.delete(key);
        });

        this.pending.set(key, promise);
        return promise;
    }

    /** Number of currently in-flight requests */
    get size(): number {
        return this.pending.size;
    }
}

export const deduplicator = new RequestDeduplicator();
