interface CacheConfig {
    expirationMinutes: number;
    version: string;
}

interface CachedData<T> {
    data: T;
    timestamp: number;
    version: string;
}

const DEFAULT_CONFIG: CacheConfig = {
    expirationMinutes: 60, // 1 hour default
    version: '1.0.0'
};

export function setCache<T>(key: string, data: T, config: Partial<CacheConfig> = {}): void {
    const { expirationMinutes, version } = { ...DEFAULT_CONFIG, ...config };

    const cacheData: CachedData<T> = {
        data,
        timestamp: Date.now(),
        version
    };

    try {
        localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
        console.error('Error setting cache:', error);
    }
}

export function getCache<T>(key: string, config: Partial<CacheConfig> = {}): T | null {
    const { expirationMinutes, version } = { ...DEFAULT_CONFIG, ...config };

    try {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const cacheData: CachedData<T> = JSON.parse(cached);

        // Check version
        if (cacheData.version !== version) {
            localStorage.removeItem(key);
            return null;
        }

        // Check expiration
        const expirationMs = expirationMinutes * 60 * 1000;
        if (Date.now() - cacheData.timestamp > expirationMs) {
            localStorage.removeItem(key);
            return null;
        }

        return cacheData.data;
    } catch (error) {
        console.error('Error getting cache:', error);
        return null;
    }
}

export function clearCache(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
}

export const CACHE_KEYS = {
    JOBS: 'cached_jobs',
    EVENTS: 'cached_events',
} as const; 