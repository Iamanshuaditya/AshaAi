'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    RiBuilding2Line,
    RiMapPinLine,
    RiTimeLine,
    RiBookmarkLine,
    RiBookmarkFill,
    RiShareLine,
    RiRefreshLine,
} from '@remixicon/react';
import { useCachedFetch } from '@/hooks/use-cached-fetch';
import { CACHE_KEYS } from '@/lib/cache-utils';
import { JobCardSkeleton } from '@/components/ui/skeleton';

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    description: string;
    requirements: string[];
    postedDate: string;
    deadline?: string;
    salary?: string;
    url: string;
}

interface JobFeedProps {
    location: string | null;
    filters: {
        industry: string[];
        experienceLevel: string[];
        jobType: string[];
        keywords: string[];
    };
    isLoading?: boolean;
}

function cleanDescription(description: string): string {
    // Remove HTML tags
    let cleaned = description.replace(/<[^>]*>/g, '');

    // Remove URLs and their text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '');

    // Remove special characters and normalize spaces
    cleaned = cleaned.replace(/[|[\]]/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ');

    // Remove "Company Name Not Available" if it appears in description
    cleaned = cleaned.replace(/Company Name Not Available/g, '');

    return cleaned.trim();
}

export function JobFeed({ location, filters }: JobFeedProps) {
    const fetchJobs = async () => {
        const response = await fetch('/api/jobs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, filters })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        return data.jobs as Job[];
    };

    const [{ data: jobs, isLoading, isError, error, isRefreshing }, refresh] = useCachedFetch(
        fetchJobs,
        {
            cacheKey: CACHE_KEYS.JOBS,
            expirationMinutes: 30, // Cache for 30 minutes
            version: '1.0.0'
        }
    );

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-destructive mb-4">
                    {error?.message || 'Failed to load jobs. Please try again.'}
                </p>
                <Button onClick={refresh} variant="outline" size="sm">
                    <RiRefreshLine className="mr-2" />
                    Retry
                </Button>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!jobs?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground mb-4">
                    No jobs found matching your criteria.
                </p>
                <Button onClick={refresh} variant="outline" size="sm">
                    <RiRefreshLine className="mr-2" />
                    Refresh
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">
                    Found {jobs.length} jobs matching your criteria
                </p>
                <Button
                    onClick={refresh}
                    variant="outline"
                    size="sm"
                    disabled={isRefreshing}
                >
                    <RiRefreshLine className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
            </div>

            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="group p-4 border rounded-lg bg-card transition-all duration-200 hover:bg-accent/10 hover:border-accent"
                >
                    <div className="flex flex-col space-y-3">
                        {/* Title and Company Info */}
                        <div>
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <RiBuilding2Line className="shrink-0 size-4" />
                                <span>{job.company !== 'Company Name Not Available' ? job.company : 'Company Not Specified'}</span>
                                <span className="text-muted-foreground/50">•</span>
                                <RiMapPinLine className="shrink-0 size-4" />
                                <span>{job.location}</span>
                            </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {job.type}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                {job.experience}
                            </span>
                            {job.salary && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {job.salary}
                                </span>
                            )}
                        </div>

                        {/* Description */}
                        {job.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                                {cleanDescription(job.description)}
                            </p>
                        )}

                        {/* Requirements */}
                        {job.requirements.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {job.requirements.map((req, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs"
                                    >
                                        {req}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <RiTimeLine className="size-4" />
                                <span>Posted {job.postedDate}</span>
                            </div>
                            <a
                                href={job.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                            >
                                View Details
                                <span className="sr-only">about {job.title}</span>
                                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}