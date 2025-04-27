import { NextResponse } from 'next/server';

interface EventFilters {
    category: string[];
    date: string[];
    type: string[];
    keywords: string[];
}

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    organizer: string;
    category: string;
    type: string;
    url: string;
    imageUrl?: string;
}

export async function POST(request: Request) {
    if (!process.env.TAVILY_API_KEY) {
        console.error('Tavily API key not configured');
        return NextResponse.json(
            { error: 'Search service not configured' },
            { status: 500 }
        );
    }

    try {
        const { location, filters } = await request.json();
        const { category = [], date = [], type = [], keywords = [] } = filters as EventFilters;

        // Validate arrays
        if (!Array.isArray(category) || !Array.isArray(date) || !Array.isArray(type) || !Array.isArray(keywords)) {
            throw new Error('Invalid filter format: expected arrays');
        }

        // Build search query based on filters
        const searchTerms = [
            'women events',
            'women conferences',
            location,
            ...(category || []),
            ...(type || []),
            ...(keywords || [])
        ].filter(Boolean);

        // Add date-specific terms
        if (date?.includes('This Week')) {
            searchTerms.push('this week');
        } else if (date?.includes('This Month')) {
            searchTerms.push('this month');
        }

        const searchQuery = searchTerms.join(' ');
        console.log('Event search query:', searchQuery);

        // Call Tavily API with proper configuration
        const response = await fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.TAVILY_API_KEY}`
            },
            body: JSON.stringify({
                query: searchQuery,
                search_depth: "advanced",
                include_domains: [
                    'eventbrite.com',
                    'meetup.com',
                    'townscript.com',
                    'allevents.in'
                ],
                exclude_domains: [
                    'wikipedia.org',
                    'youtube.com'
                ],
                max_results: 20
            })
        });

        if (!response.ok) {
            throw new Error(`Tavily API error: ${response.statusText}`);
        }

        const searchResults = await response.json();
        console.log(`Found ${searchResults.results?.length || 0} event results`);

        // Transform and enhance event listings
        const events: Event[] = (searchResults.results || []).map((result: any) => {
            const resultTitle = result.title || 'Event Title Not Available';
            const resultContent = result.content || '';

            // Extract date and time if available
            const dateMatch = resultContent.match(/(?:on|date:?)\s*([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?,?\s*\d{4})/i);
            const timeMatch = resultContent.match(/(?:at|time:?)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm))/i);

            const eventData = {
                id: Math.random().toString(36).substr(2, 9),
                title: resultTitle,
                description: resultContent.substring(0, 500) || 'No description available',
                date: dateMatch ? dateMatch[1] : (date[0] || 'Date TBA'),
                time: timeMatch ? timeMatch[1] : undefined,
                location: location,
                organizer: extractOrganizer(resultContent) || 'Organizer Not Available',
                category: category[0] || 'General',
                type: extractEventType(resultContent, type) || 'In Person',
                url: result.url,
                imageUrl: result.image
            };

            console.log('Processed event:', {
                title: eventData.title,
                date: eventData.date,
                type: eventData.type
            });

            return eventData;
        });

        return NextResponse.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// Helper function to extract organizer from content
function extractOrganizer(content: string): string | null {
    const organizerPatterns = [
        /organized by:?\s*([^.,:]+)/i,
        /hosted by:?\s*([^.,:]+)/i,
        /presenter:?\s*([^.,:]+)/i
    ];

    for (const pattern of organizerPatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }

    return null;
}

// Helper function to determine event type
function extractEventType(content: string, typeFilters: string[]): string | null {
    if (typeFilters.length > 0) {
        return typeFilters[0];
    }

    const content_lower = content.toLowerCase();
    if (content_lower.includes('virtual') || content_lower.includes('online') || content_lower.includes('zoom')) {
        return 'Virtual';
    } else if (content_lower.includes('hybrid')) {
        return 'Hybrid';
    }

    return 'In Person';
}