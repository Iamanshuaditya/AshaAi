'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

import { JobFilters, EventFilters } from '@/types/filters';

interface FilterOption {
    id: string;
    label: string;
}

const JOB_FILTERS = {
    industry: [
        { id: 'tech', label: 'Technology' },
        { id: 'healthcare', label: 'Healthcare' },
        { id: 'finance', label: 'Finance' },
        { id: 'education', label: 'Education' },
    ],
    experienceLevel: [
        { id: 'entry', label: 'Entry Level' },
        { id: 'mid', label: 'Mid Level' },
        { id: 'senior', label: 'Senior Level' },
        { id: 'lead', label: 'Leadership' },
    ],
    jobType: [
        { id: 'full-time', label: 'Full Time' },
        { id: 'part-time', label: 'Part Time' },
        { id: 'contract', label: 'Contract' },
        { id: 'remote', label: 'Remote' },
        { id: 'hybrid', label: 'Hybrid' },
    ],
};

const EVENT_FILTERS = {
    category: [
        { id: 'tech', label: 'Technology' },
        { id: 'leadership', label: 'Leadership' },
        { id: 'career', label: 'Career Development' },
        { id: 'networking', label: 'Networking' },
    ],
    date: [
        { id: 'this-week', label: 'This Week' },
        { id: 'this-month', label: 'This Month' },
        { id: 'next-month', label: 'Next Month' },
    ],
    type: [
        { id: 'workshop', label: 'Workshop' },
        { id: 'webinar', label: 'Webinar' },
        { id: 'conference', label: 'Conference' },
        { id: 'meetup', label: 'Meetup' },
    ],
};

interface FilterPanelProps {
    type: 'jobs' | 'events';
    filters: JobFilters | EventFilters;
    onChange: (filters: JobFilters | EventFilters) => void;
}

export function FilterPanel({ type, filters, onChange }: FilterPanelProps) {
    const handleFilterChange = (category: string, values: string[]) => {
        if (type === 'jobs') {
            onChange({
                ...(filters as JobFilters),
                [category]: values,
            });
        } else {
            onChange({
                ...(filters as EventFilters),
                [category]: values,
            });
        }
    };

    const renderCheckboxGroup = (category: string, options: FilterOption[]) => (
        <div className="space-y-2">
            <h4 className="text-sm font-medium">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <div className="space-y-1">
                {options.map((option) => (
                    <div key={option.id} className="flex items-center">
                        <Checkbox
                            id={`${category}-${option.id}`}
                            checked={type === 'jobs'
                                ? (filters as JobFilters)[category as keyof JobFilters].includes(option.id)
                                : (filters as EventFilters)[category as keyof EventFilters].includes(option.id)
                            }
                            onCheckedChange={(checked: boolean | 'indeterminate') => {
                                if (checked === 'indeterminate') return;
                                const currentValues = type === 'jobs'
                                    ? (filters as JobFilters)[category as keyof JobFilters]
                                    : (filters as EventFilters)[category as keyof EventFilters];

                                handleFilterChange(
                                    category,
                                    checked
                                        ? [...currentValues, option.id]
                                        : currentValues.filter(v => v !== option.id)
                                );
                            }}
                        />
                        <Label
                            htmlFor={`${category}-${option.id}`}
                            className="ml-2 text-sm font-normal"
                        >
                            {option.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );

    if (type === 'jobs') {
        return (
            <Card className="p-4">
                <h3 className="font-semibold mb-4">Filters</h3>
                <div className="space-y-6">
                    {renderCheckboxGroup('industry', JOB_FILTERS.industry)}
                    {renderCheckboxGroup('experienceLevel', JOB_FILTERS.experienceLevel)}
                    {renderCheckboxGroup('jobType', JOB_FILTERS.jobType)}
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-4">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-6">
                {renderCheckboxGroup('category', EVENT_FILTERS.category)}
                {renderCheckboxGroup('date', EVENT_FILTERS.date)}
                {renderCheckboxGroup('type', EVENT_FILTERS.type)}
            </div>
        </Card>
    );
}