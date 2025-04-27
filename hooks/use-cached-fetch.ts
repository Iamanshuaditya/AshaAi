import { useState, useEffect } from 'react';
import { getCache, setCache } from '@/lib/cache-utils';

interface FetchState<T> {
    data: T | null;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    isRefreshing: boolean;
}

interface UseCachedFetchOptions {
    cacheKey: string;
    expirationMinutes?: number;
    version?: string;
}

export function useCachedFetch<T>(
    fetchFn: () => Promise<T>,
    options: UseCachedFetchOptions
): [FetchState<T>, () => Promise<void>] {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
        isRefreshing: false,
    });

    const fetchData = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setState(prev => ({ ...prev, isRefreshing: true }));
            }

            const result = await fetchFn();

            // Cache the new data
            setCache(options.cacheKey, result, {
                expirationMinutes: options.expirationMinutes,
                version: options.version,
            });

            setState(prev => ({
                data: result,
                isLoading: false,
                isError: false,
                error: null,
                isRefreshing: false,
            }));
        } catch (error) {
            setState(prev => ({
                ...prev,
                isError: true,
                error: error as Error,
                isLoading: false,
                isRefreshing: false,
            }));
        }
    };

    const refresh = () => fetchData(true);

    useEffect(() => {
        // Try to get cached data first
        const cachedData = getCache<T>(options.cacheKey, {
            expirationMinutes: options.expirationMinutes,
            version: options.version,
        });

        if (cachedData) {
            // If we have cached data, show it immediately
            setState({
                data: cachedData,
                isLoading: false,
                isError: false,
                error: null,
                isRefreshing: false,
            });

            // Then fetch fresh data in the background
            fetchData(true);
        } else {
            // If no cached data, fetch fresh data
            fetchData(false);
        }
    }, [options.cacheKey]);

    return [state, refresh];
} 