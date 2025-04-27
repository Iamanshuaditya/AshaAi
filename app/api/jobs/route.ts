import { NextResponse } from 'next/server';
import Exa from 'exa-js';

// Initialize Exa client with API key from environment variable
const exa = new Exa(process.env.EXASEARCH_API_KEY || process.env.EXA_API_KEY);

interface JobFilters {
    industry: string[];
    experienceLevel: string[];
    jobType: string[];
    keywords: string[];
}

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
    salary?: string;
    url: string;
}

export async function POST(request: Request) {
    if (!process.env.EXASEARCH_API_KEY && !process.env.EXA_API_KEY) {
        console.error('Exa API key not configured');
        return NextResponse.json(
            { error: 'Search service not configured' },
            { status: 500 }
        );
    }

    try {
        const { location, filters } = await request.json();
        const { industry, experienceLevel, jobType, keywords } = filters as JobFilters;

        // Build search query based on filters
        const searchTerms = [
            'job opportunities',
            'career openings',
            location,
            ...industry,
            ...experienceLevel,
            ...jobType,
            ...keywords,
            'women careers', // Add focus on women's careers
        ].filter(Boolean);

        // Add job-specific terms based on filters
        if (jobType.includes('Remote')) {
            searchTerms.push('remote work', 'work from home');
        }
        if (jobType.includes('Hybrid')) {
            searchTerms.push('hybrid work');
        }

        const searchQuery = searchTerms.join(' ');
        console.log('Job search query:', searchQuery);

        // Use Exa SDK to search with proper configuration
        const searchResults = await exa.searchAndContents(searchQuery, {
            numResults: 20,
            useAutoprompt: true,
            text: { includeHtmlTags: false, maxCharacters: 1000 }
        });

        console.log(`Found ${searchResults.results.length} job results`);

        // Transform and enhance job listings
        const jobs: Job[] = searchResults.results.map((result) => {
            const resultText = result.text || '';
            const resultTitle = result.title || 'Job Position';

            // Extract salary if available in the text
            const salaryMatch = resultText.match(/(?:₹|RS|INR)\s*[\d,.]+ ?(?:L|Lakhs?|LPA|Crores?|K|k|,000)/i);
            const salary = salaryMatch ? salaryMatch[0] : undefined;

            // Extract experience requirement
            const expMatch = resultText.match(/(\d+(?:\.\d+)?)\s*(?:\+|plus)?\s*years?(?:\s+of)?\s+experience/i);
            const experience = expMatch
                ? `${expMatch[1]}+ years`
                : experienceLevel.length > 0
                    ? experienceLevel[0]
                    : 'Not specified';

            const jobData = {
                id: Math.random().toString(36).substr(2, 9),
                title: resultTitle,
                company: extractCompany(resultText) || 'Company Name Not Available',
                location: location,
                type: extractJobType(resultText, jobType) || 'Full Time',
                experience: experience,
                description: resultText.substring(0, 500) || 'No description available',
                requirements: extractRequirements(resultText),
                postedDate: new Date().toISOString().split('T')[0],
                salary: salary,
                url: result.url
            };

            console.log('Processed job:', {
                title: jobData.title,
                company: jobData.company,
                type: jobData.type
            });

            return jobData;
        });

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return NextResponse.json(
            { error: 'Failed to fetch jobs' },
            { status: 500 }
        );
    }
}

// Helper functions for data extraction
function extractCompany(text: string): string | null {
    const companyPatterns = [
        /(?:at|by|with|for)\s+([A-Z][A-Za-z0-9\s&]+?)(?:\sin|,|\.|$)/,
        /^([A-Z][A-Za-z0-9\s&]+?)\s+is\s+(?:looking|hiring|seeking)/
    ];

    for (const pattern of companyPatterns) {
        const match = text?.match(pattern);
        if (match?.[1]) {
            return match[1].trim();
        }
    }
    return null;
}

function extractJobType(text: string, preferredTypes: string[]): string | null {
    if (!text) return null;

    const textLower = text.toLowerCase();
    const typePatterns = {
        'Full Time': /(full[- ]time|permanent)/i,
        'Part Time': /(part[- ]time)/i,
        'Contract': /(contract|temporary|freelance)/i,
        'Remote': /(remote|work from home|wfh)/i,
        'Hybrid': /(hybrid|flexible location)/i
    } as const;

    // First check preferred types
    for (const type of preferredTypes) {
        const pattern = typePatterns[type as keyof typeof typePatterns];
        if (pattern?.test(textLower)) {
            return type;
        }
    }

    // Then check all types
    for (const [type, pattern] of Object.entries(typePatterns)) {
        if (pattern.test(textLower)) {
            return type;
        }
    }

    return null;
}

function extractRequirements(text: string): string[] {
    if (!text) return [];

    const requirements = new Set<string>();

    // Extract skills
    const skillsMatch = text.match(/(?:required|requirements|qualifications|skills|expertise|proficiency in)[:;]\s*([^.]*)/i);
    if (skillsMatch?.[1]) {
        const skills = skillsMatch[1]
            .split(/[,;]/)
            .map(skill => skill.trim())
            .filter(skill => skill.length > 2);
        skills.forEach(skill => requirements.add(skill));
    }

    // Extract years of experience
    const expMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:\+|plus)?\s*years?(?:\s+of)?\s+experience/i);
    if (expMatch) {
        requirements.add(`${expMatch[1]}+ years of experience`);
    }

    // Extract education
    const eduMatch = text.match(/(?:degree|graduate|graduation|B\.?Tech|M\.?Tech|MBA|PhD)(?:\s+in\s+[^.,:]*)?/i);
    if (eduMatch) {
        requirements.add(eduMatch[0].trim());
    }

    return Array.from(requirements);
}