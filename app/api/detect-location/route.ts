import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    try {
        const response = await fetch('https://ipapi.co/json/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Asha AI Bot/1.0)',
                'Accept': 'application/json',
                'Referer': 'https://jobsforher.com/'
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            console.error('Location API error:', {
                status: response.status,
                statusText: response.statusText
            });
            // Fallback to India if API fails
            return NextResponse.json({
                location: 'India',
                details: {
                    country: 'India',
                    country_code: 'IN'
                }
            });
        }

        const data = await response.json();
        console.log('Location data:', data);

        const location = data.city
            ? `${data.city}, ${data.country_name}`
            : data.country_name;

        return NextResponse.json({
            location,
            details: {
                city: data.city,
                region: data.region,
                country: data.country_name,
                country_code: data.country_code,
                latitude: data.latitude,
                longitude: data.longitude,
                timezone: data.timezone
            }
        });
    } catch (error) {
        console.error('Error detecting location:', error);
        // Fallback to India if any error occurs
        return NextResponse.json({
            location: 'India',
            details: {
                country: 'India',
                country_code: 'IN'
            }
        });
    }
}