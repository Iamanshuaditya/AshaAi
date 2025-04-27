export interface JobFilters {
    industry: string[];
    experienceLevel: string[];
    jobType: string[];
    keywords: string[];
}

export interface EventFilters {
    category: string[];
    date: string[];
    type: string[];
    keywords: string[];
}

export type FeedFilters = {
    jobs: JobFilters;
    events: EventFilters;
}; 