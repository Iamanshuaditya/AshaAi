'use client';

import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppSidebar } from '@/components/app-sidebar';
import { JobFeed } from '@/components/job-feed';
import { EventFeed } from '@/components/event-feed';
import { LocationDetector } from '@/components/location-detector';
import { FilterPanel } from '@/components/filter-panel';
import { Button } from '@/components/ui/button';
import { RiRefreshLine } from '@remixicon/react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { FeedFilters } from '@/types/filters';

export default function JobEventFeedPage() {
    const [location, setLocation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'jobs' | 'events'>('jobs');
    const [filters, setFilters] = useState<FeedFilters>({
        jobs: {
            industry: [],
            experienceLevel: [],
            jobType: [],
            keywords: [],
        },
        events: {
            category: [],
            date: [],
            type: [],
            keywords: [],
        },
    });

    useEffect(() => {
        // Load cached data and location from localStorage
        const cachedLocation = localStorage.getItem('userLocation');
        if (cachedLocation) {
            setLocation(JSON.parse(cachedLocation));
        }
        setIsLoading(false);
    }, []);

    const handleLocationChange = (newLocation: string) => {
        setLocation(newLocation);
        localStorage.setItem('userLocation', JSON.stringify(newLocation));
    };

    const handleRefresh = () => {
        setIsLoading(true);
        // Implement refresh logic here
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-background">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold">Opportunities Feed</h1>
                            <div className="flex items-center gap-4">
                                <LocationDetector
                                    currentLocation={location}
                                    onLocationChange={handleLocationChange}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isLoading}
                                >
                                    <RiRefreshLine className="mr-2" />
                                    Refresh Feed
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-3">
                                <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'jobs' | 'events')}>
                                    <TabsList className="mb-6">
                                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                                        <TabsTrigger value="events">Events</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="jobs">
                                        <JobFeed
                                            location={location}
                                            filters={filters.jobs}
                                            isLoading={isLoading}
                                        />
                                    </TabsContent>
                                    <TabsContent value="events">
                                        <EventFeed
                                            location={location}
                                            filters={filters.events}
                                            isLoading={isLoading}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                            <div className="lg:col-span-1">
                                <FilterPanel
                                    type={activeTab}
                                    filters={filters[activeTab]}
                                    onChange={(newFilters) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            [activeTab]: newFilters,
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}
