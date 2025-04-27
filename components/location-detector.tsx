'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RiMapPinLine } from '@remixicon/react';

interface LocationDetectorProps {
    currentLocation: string | null;
    onLocationChange: (location: string) => void;
}

export function LocationDetector({ currentLocation, onLocationChange }: LocationDetectorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [tempLocation, setTempLocation] = useState(currentLocation || '');

    useEffect(() => {
        if (!currentLocation) {
            // Fetch location using geoip-lite in an API route
            fetch('/api/detect-location')
                .then((res) => res.json())
                .then((data) => {
                    if (data.location) {
                        onLocationChange(data.location);
                    }
                })
                .catch((error) => {
                    console.error('Failed to detect location:', error);
                });
        }
    }, [currentLocation, onLocationChange]);

    const handleSaveLocation = () => {
        if (tempLocation.trim()) {
            onLocationChange(tempLocation.trim());
            setIsEditing(false);
        }
    };

    return (
        <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <RiMapPinLine />
                    {currentLocation || 'Detecting location...'}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="space-y-4">
                    <h4 className="font-medium leading-none">Update Location</h4>
                    <p className="text-sm text-muted-foreground">
                        Enter your location to see relevant opportunities
                    </p>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Enter city, state, or country"
                            value={tempLocation}
                            onChange={(e) => setTempLocation(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSaveLocation();
                                }
                            }}
                        />
                        <Button onClick={handleSaveLocation}>Save</Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}