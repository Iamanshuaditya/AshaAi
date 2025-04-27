// API Keys
export const EXA_API_KEY = process.env.NEXT_PUBLIC_EXA_API_KEY || '';
export const TAVILY_API_KEY = process.env.NEXT_PUBLIC_TAVILY_API_KEY || '';

// Cache durations (in milliseconds)
export const CACHE_DURATIONS = {
    JOBS: 24 * 60 * 60 * 1000, // 24 hours
    EVENTS: 12 * 60 * 60 * 1000, // 12 hours
    LOCATION: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// API endpoints
export const API_ENDPOINTS = {
    EXA: 'https://api.exa.ai/search',
    TAVILY: 'https://api.tavily.com/v1/search',
};

// Default values
export const DEFAULTS = {
    ITEMS_PER_PAGE: 20,
    LOCATION: 'Remote',
};

// Feature flags
export const FEATURES = {
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_CACHING: process.env.NEXT_PUBLIC_ENABLE_CACHING !== 'false',
};