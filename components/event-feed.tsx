'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
    RiCalendarEventLine,
    RiMapPinLine,
    RiTimeLine,
    RiBookmarkLine,
    RiBookmarkFill,
    RiShareLine,
    RiGroupLine,
    RiMoneyDollarCircleLine,
    RiRefreshLine,
} from '@remixicon/react';
import { useCachedFetch } from '@/hooks/use-cached-fetch';
import { CACHE_KEYS } from '@/lib/cache-utils';
import { EventCardSkeleton } from '@/components/ui/skeleton';

interface Event {
    id: string;
    title: string;
    organizer: string;
    location: string;
    type: string;
    format: string;
    description: string;
    date: string;
    time: string;
    price: string;
    registrationDeadline?: string;
    maxParticipants?: number;
    currentParticipants?: number;
    category: string;
    url: string;
    imageUrl?: string;
}

interface EventFeedProps {
    location: string | null;
    filters: {
        category: string[];
        date: string[];
        type: string[];
        keywords: string[];
    };
    isLoading?: boolean;
}

export function EventFeed({ location, filters }: EventFeedProps) {
    const fetchEvents = async () => {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location, filters })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        return data.events as Event[];
    };

    const [{ data: events, isLoading, isError, error, isRefreshing }, refresh] = useCachedFetch(
        fetchEvents,
        {
            cacheKey: CACHE_KEYS.EVENTS,
            expirationMinutes: 30, // Cache for 30 minutes
            version: '1.0.0'
        }
    );

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-destructive mb-4">
                    {error?.message || 'Failed to load events. Please try again.'}
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
                    <EventCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (!events?.length) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <p className="text-muted-foreground mb-4">
                    No events found matching your criteria.
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
                    Found {events.length} events matching your criteria
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

            {events.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <div className="flex gap-2 text-sm text-muted-foreground mb-2">
                        <span>{event.organizer}</span>
                        {event.location && (
                            <>
                                <span>•</span>
                                <span>{event.location}</span>
                            </>
                        )}
                    </div>
                    <p className="text-sm mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                            {event.category}
                        </span>
                        <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                            {event.type}
                        </span>
                        <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                            {event.date}
                        </span>
                        {event.time && (
                            <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs">
                                {event.time}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <a
                            href={event.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                        >
                            View Event →
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}