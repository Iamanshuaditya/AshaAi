import React from 'react';
import { cn } from "@/lib/utils";
import {
    RiCalendarEventLine,
    RiMapPinLine,
    RiGlobalLine,
    RiTimeLine,
    RiGroupLine,
    RiExternalLinkLine
} from "@remixicon/react";

export interface Event {
    id: string;
    title: string;
    organizer: string | null;
    eventType: string;
    format: string; // "Virtual" | "In-person" | "Hybrid"
    date: string;
    time: string | null;
    location: string | null;
    description: string | null;
    registrationUrl: string;
    isWomenFocused?: boolean;
}

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    return (
        <div className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
            {/* Event Type Badge */}
            <div className="flex items-center justify-between mb-2">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {event.eventType}
                </span>
                {event.isWomenFocused && (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                        Women-Focused
                    </span>
                )}
            </div>

            {/* Title and Organizer */}
            <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
            {event.organizer && (
                <p className="text-sm text-muted-foreground mb-3">
                    <RiGroupLine className="inline-block mr-1" size={16} />
                    {event.organizer}
                </p>
            )}

            {/* Date and Time */}
            <div className="flex items-start gap-4 mb-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                    <RiCalendarEventLine className="mr-1" size={16} />
                    {event.date}
                </div>
                {event.time && (
                    <div className="flex items-center text-muted-foreground">
                        <RiTimeLine className="mr-1" size={16} />
                        {event.time}
                    </div>
                )}
            </div>

            {/* Format and Location */}
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                {event.format === "Virtual" ? (
                    <div className="flex items-center">
                        <RiGlobalLine className="mr-1" size={16} />
                        Virtual Event
                    </div>
                ) : (
                    event.location && (
                        <div className="flex items-center">
                            <RiMapPinLine className="mr-1" size={16} />
                            {event.location}
                        </div>
                    )
                )}
            </div>

            {/* Description */}
            {event.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {event.description}
                </p>
            )}

            {/* Registration Link */}
            <div className="mt-auto">
                <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-primary hover:text-primary/90 font-medium"
                >
                    Register Now
                    <RiExternalLinkLine className="ml-1" size={16} />
                </a>
            </div>
        </div>
    );
} 