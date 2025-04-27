import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { tool } from 'ai'; // Import the tool helper
import { z } from 'zod'; // Import Zod for schema definition
import Exa from 'exa-js'; // Import Exa
import { tavily } from '@tavily/core'; // Import Exa
import { NextResponse } from 'next/server';

import { assistantPrompts } from '@/lib/assistant-prompts';

const MODEL_NAME = "gemini-1.5-flash"; // Or your preferred Gemini model
const API_KEY = process.env.GEMINI_API_KEY;
const EXA_API_KEY = process.env.EXA_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

const exa = new Exa(EXA_API_KEY);
// Initialize Tavily client
const tvly = tavily({ apiKey: TAVILY_API_KEY });

// Define the structure for a job listing
interface JobListing {
    id: string; // Unique ID (e.g., from URL or API)
    title: string;
    company: string | null;
    location: string | null;
    description: string | null; // Short snippet
    url: string;
    // Indicate the source API
    // Add other relevant fields if available from APIs (e.g., publishedDate, salaryRange)
}

// Add Event interface
interface Event {
    id: string;
    title: string;
    organizer: string | null;
    eventType: string;
    format: string;
    date: string;
    time: string | null;
    location: string | null;
    description: string | null;
    registrationUrl: string;
    isWomenFocused?: boolean;
}

// Function to get the system prompt
function getSystemPrompt(assistantId?: string): string {
    try {
        if (assistantId && assistantId in assistantPrompts) {
            return assistantPrompts[assistantId];
        }

        // Default system prompt if no assistant ID is provided or if the ID doesn't exist
        return "You are Asha AI, a helpful and empathetic assistant focused on women's career empowerment.";
    } catch (error) {
        console.error("Error getting system prompt:", error);
        return "You are Asha AI, a helpful and empathetic assistant focused on women's career empowerment.";
    }
}

// --- Define the Job Search Tool using Vercel AI SDK Helper --- 
const jobSearchTool = tool({
    description: "Searches for job listings based on user criteria like role, location, industry, and experience. Use this when the user expresses intent to find a job.",
    parameters: z.object({
        role: z.string().describe("The desired job title or role (e.g., 'Software Engineer', 'Marketing Manager')."),
        location: z.string().describe("The desired location (e.g., 'Bangalore', 'Remote', 'Hybrid in Mumbai')."),
        industry: z.string().optional().describe("Optional: The specific industry (e.g., 'Tech', 'Finance', 'Healthcare')."),
        experience: z.string().optional().describe("Optional: The desired experience level (e.g., 'Entry-level', 'Mid-level', 'Senior')."),
        keywords: z.string().optional().describe("Optional: Additional keywords to refine the search (e.g., 'Python', 'React', 'women in tech', 'flexible work').")
    }),
    execute: async ({
        role,
        location,
        industry,
        experience,
        keywords
    }: {
        role: string;
        location: string;
        industry?: string;
        experience?: string;
        keywords?: string;
    }): Promise<JobListing[]> => {
        console.log(`Executing job search: Role=${role}, Location=${location}, Industry=${industry}, Exp=${experience}, Keywords=${keywords}`);
        const combinedResults: JobListing[] = [];
        const seenUrls = new Set<string>();
        let baseQuery = `${experience || ''} ${role} jobs ${industry ? `in ${industry} industry` : ''} ${location === 'Remote' ? 'remote' : `in ${location}`}`.trim().replace(/\s+/g, ' ');
        if (keywords) {
            baseQuery += ` ${keywords}`;
        }
        const tavilyQuery = baseQuery;
        const exaQuery = `Find job listings for: ${baseQuery}. Prioritize recent postings.`;
        try {
            console.log(`Tavily Query: ${tavilyQuery}`);
            // Use the new Tavily client
            const tavilyResponse = await tvly.search(tavilyQuery, {
                searchDepth: "advanced",
                maxResults: 7,
            });
            console.log(`Tavily found ${tavilyResponse.results?.length || 0} results.`);
            tavilyResponse.results?.forEach((result: any) => {
                if (result.url && !seenUrls.has(result.url)) {
                    combinedResults.push({
                        id: `tavily-${result.url}`,
                        title: result.title || role,
                        company: result.metadata?.companyName || result.company || null,
                        location: location,
                        description: result.content?.substring(0, 200) + '...' || 'No description available.',
                        url: result.url,

                    });
                    seenUrls.add(result.url);
                }
            });
            console.log(`Exa Query: ${exaQuery}`);

            const exaResponse = await exa.searchAndContents(exaQuery, {
                numResults: 7,
                text: { includeHtmlTags: false, maxCharacters: 500 },
                type: 'keyword',
            });
            console.log(`Exa found ${exaResponse.results?.length || 0} results.`);
            exaResponse.results?.forEach((result: any) => {
                if (result.url && !seenUrls.has(result.url)) {
                    combinedResults.push({
                        id: `exa-${result.id || result.url}`,
                        title: result.title || role,
                        company: result.author || null,
                        location: location,
                        description: result.text?.substring(0, 200) + '...' || 'No description available.',
                        url: result.url,

                    });
                    seenUrls.add(result.url);
                }
            });
            console.log(`Combined ${combinedResults.length} unique job results.`);
            return combinedResults;
        } catch (searchError) {
            console.error("Error during job search execution:", searchError);
            return [];
        }
    }
});

// Add event search tool
const eventSearchTool = tool({
    description: "Searches for community events based on user criteria like event type, format, location, and timeframe.",
    parameters: z.object({
        eventType: z.string().describe("The type of event (e.g., 'Hackathon', 'Workshop', 'Webinar', 'Networking')."),
        format: z.string().describe("The event format (e.g., 'Virtual', 'In-person', 'Hybrid')."),
        topic: z.string().optional().describe("Optional: The event topic or industry focus (e.g., 'Tech', 'Leadership', 'Career Development')."),
        timeframe: z.string().optional().describe("Optional: The preferred timeframe (e.g., 'This weekend', 'Next month', 'Upcoming')."),
        location: z.string().optional().describe("Optional: The location for in-person/hybrid events."),
    }),
    execute: async ({
        eventType,
        format,
        topic,
        timeframe,
        location
    }: {
        eventType: string;
        format: string;
        topic?: string;
        timeframe?: string;
        location?: string;
    }): Promise<Event[]> => {
        console.log(`Executing event search: Type=${eventType}, Format=${format}, Topic=${topic}, Time=${timeframe}, Location=${location}`);
        const combinedResults: Event[] = [];
        const seenUrls = new Set<string>();

        let baseQuery = `${eventType} ${format} events`;
        if (topic) baseQuery += ` ${topic}`;
        if (location) baseQuery += ` in ${location}`;
        if (timeframe) baseQuery += ` ${timeframe}`;
        baseQuery += " women career professional development";

        try {
            // Search using Tavily
            const tavilyResponse = await tvly.search(baseQuery, {
                searchDepth: "advanced",
                maxResults: 7,
            });

            tavilyResponse.results?.forEach((result: any) => {
                if (result.url && !seenUrls.has(result.url)) {
                    // Extract date and time from content if possible
                    const dateTimeInfo = extractDateTimeInfo(result.content);

                    combinedResults.push({
                        id: `tavily-${result.url}`,
                        title: result.title,
                        organizer: extractOrganizer(result.content),
                        eventType: eventType,
                        format: format,
                        date: dateTimeInfo.date || "Date TBA",
                        time: dateTimeInfo.time,
                        location: format === "Virtual" ? null : (location || extractLocation(result.content)),
                        description: result.content?.substring(0, 200) + '...',
                        registrationUrl: result.url,
                        isWomenFocused: isWomenFocused(result.content)
                    });
                    seenUrls.add(result.url);
                }
            });

            // Search using Exa
            const exaQuery = `Find ${eventType} events: ${baseQuery}. Focus on upcoming events.`;
            const exaResponse = await exa.searchAndContents(exaQuery, {
                numResults: 7,
                text: { includeHtmlTags: false, maxCharacters: 500 },
                type: 'keyword',
            });

            exaResponse.results?.forEach((result: any) => {
                if (result.url && !seenUrls.has(result.url)) {
                    const dateTimeInfo = extractDateTimeInfo(result.text);

                    combinedResults.push({
                        id: `exa-${result.id || result.url}`,
                        title: result.title,
                        organizer: extractOrganizer(result.text),
                        eventType: eventType,
                        format: format,
                        date: dateTimeInfo.date || "Date TBA",
                        time: dateTimeInfo.time,
                        location: format === "Virtual" ? null : (location || extractLocation(result.text)),
                        description: result.text?.substring(0, 200) + '...',
                        registrationUrl: result.url,
                        isWomenFocused: isWomenFocused(result.text)
                    });
                    seenUrls.add(result.url);
                }
            });

            return combinedResults;
        } catch (searchError) {
            console.error("Error during event search execution:", searchError);
            return [];
        }
    }
});

// Helper functions for event data extraction
function extractDateTimeInfo(content: string): { date: string | null; time: string | null } {
    // Basic date/time extraction - enhance this based on your needs
    const datePattern = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}(?:st|nd|rd|th)?,? \d{4}\b/i;
    const timePattern = /\b(?:1[0-2]|0?[1-9])(?::[0-5][0-9])?\s*(?:AM|PM)\b/i;

    const dateMatch = content.match(datePattern);
    const timeMatch = content.match(timePattern);

    return {
        date: dateMatch ? dateMatch[0] : null,
        time: timeMatch ? timeMatch[0] : null
    };
}

function extractOrganizer(content: string): string | null {
    // Basic organizer extraction - enhance based on your needs
    const organizerPatterns = [
        /(?:hosted|organized|presented) by\s+([^.,:]+)/i,
        /([^.,:]+)\s+(?:presents|hosts|organizing)/i
    ];

    for (const pattern of organizerPatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
            return match[1].trim();
        }
    }
    return null;
}

function extractLocation(content: string): string | null {
    // Basic location extraction - enhance based on your needs
    const locationPattern = /(?:location|venue|place):\s*([^.,:]+)/i;
    const match = content.match(locationPattern);
    return match ? match[1].trim() : null;
}

function isWomenFocused(content: string): boolean {
    const womenKeywords = [
        'women', 'woman', 'female', 'gender diversity', 'women in tech',
        'women professionals', 'women leaders', 'women entrepreneurs'
    ];
    const contentLower = content.toLowerCase();
    return womenKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()));
}

// --- Define the tool schema specifically for Google's API --- 
const googleTools: FunctionDeclaration[] = [
    {
        name: "job_search",
        description: "Searches for job listings based on user criteria like role, location, industry, and experience. Use this when the user expresses intent to find a job.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                role: { type: SchemaType.STRING, description: "The desired job title or role (e.g., 'Software Engineer', 'Marketing Manager')." },
                location: { type: SchemaType.STRING, description: "The desired location (e.g., 'Bangalore', 'Remote', 'Hybrid in Mumbai')." },
                industry: { type: SchemaType.STRING, description: "Optional: The specific industry (e.g., 'Tech', 'Finance', 'Healthcare')." },
                experience: { type: SchemaType.STRING, description: "Optional: The desired experience level (e.g., 'Entry-level', 'Mid-level', 'Senior')." },
                keywords: { type: SchemaType.STRING, description: "Optional: Additional keywords to refine the search (e.g., 'Python', 'React', 'women in tech', 'flexible work')." }
            },
            required: ["role", "location"]
        }
    },
    {
        name: "event_search",
        description: "Searches for community events based on user criteria like event type, format, location, and timeframe.",
        parameters: {
            type: SchemaType.OBJECT,
            properties: {
                eventType: { type: SchemaType.STRING, description: "The type of event (e.g., 'Hackathon', 'Workshop', 'Webinar', 'Networking')." },
                format: { type: SchemaType.STRING, description: "The event format (e.g., 'Virtual', 'In-person', 'Hybrid')." },
                topic: { type: SchemaType.STRING, description: "Optional: The event topic or industry focus (e.g., 'Tech', 'Leadership', 'Career Development')." },
                timeframe: { type: SchemaType.STRING, description: "Optional: The preferred timeframe (e.g., 'This weekend', 'Next month', 'Upcoming')." },
                location: { type: SchemaType.STRING, description: "Optional: The location for in-person/hybrid events." }
            },
            required: ["eventType", "format"]
        }
    }
];

export async function POST(request: Request) {
    if (!API_KEY || !EXA_API_KEY || !TAVILY_API_KEY) {
        console.error("One or more API keys (GEMINI, EXA, TAVILY) are not set.");
        return NextResponse.json({ error: 'API keys not configured.' }, { status: 500 });
    }

    try {
        const { message, history, systemPrompt: customSystemPrompt, assistantId } = await request.json();

        // Add logging
        console.log('Received assistantId:', assistantId);
        console.log('Looking for prompt file:', assistantId ? `${assistantId}.md` : 'default prompt');

        if (!message) {
            return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
        }

        // Use custom prompt, assistant-specific prompt, or default prompt in that order
        const systemPrompt = customSystemPrompt || getSystemPrompt(assistantId);

        // Log the system prompt being used
        console.log('Using system prompt:', systemPrompt.substring(0, 100) + '...');

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
        });

        const generationConfig = {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
        };

        const safetySettings = [
            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ];

        const historyLimit = 8;
        const relevantHistory = (history || []).slice(-historyLimit);
        const chatHistory: Content[] = relevantHistory.map((msg: { text: string; isUser: boolean }) => ({
            role: msg.isUser ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const contents: Content[] = [
            { role: "user", parts: [{ text: `System Instructions:\n${systemPrompt}` }] },
            { role: "model", parts: [{ text: "Understood. I am Asha AI, ready to assist following these instructions." }] },
            ...chatHistory,
            { role: "user", parts: [{ text: message }] },
        ];

        const result = await model.generateContent({
            contents: contents,
            generationConfig,
            safetySettings,
            tools: [{ functionDeclarations: googleTools }],
        });

        const response = result.response;
        if (!response?.candidates?.[0]) {
            console.error('Gemini API Error: No response or candidates found.', response);
            const blockReason = response?.promptFeedback?.blockReason;
            let errorMessage = 'Sorry, I encountered an issue generating a response.';
            if (blockReason) {
                errorMessage = `My response was blocked potentially due to safety filters (${blockReason}). Please rephrase your request or try a different topic.`;
                console.warn(`Gemini response blocked. Reason: ${blockReason}`);
            }
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }

        const firstCandidate = response.candidates[0];
        const functionCalls = firstCandidate.content?.parts
            ?.filter(part => !!part.functionCall)
            ?.map(part => part.functionCall);

        if (functionCalls && functionCalls.length > 0) {
            console.log("Gemini requested tool call:", functionCalls[0].name);
            const call = functionCalls[0];

            if (!firstCandidate.content?.parts) {
                return NextResponse.json({ error: 'Invalid response format from Gemini.' }, { status: 500 });
            }

            if (call.name === 'job_search') {
                // @ts-ignore
                const jobListings = await jobSearchTool.execute(call.args);

                const result2 = await model.generateContent({
                    contents: [
                        ...contents,
                        { role: 'model', parts: firstCandidate.content.parts },
                        { role: "function", parts: [{ functionResponse: { name: "job_search", response: { jobListings } } }] }
                    ],
                    generationConfig,
                    safetySettings,
                });

                if (!result2.response?.candidates?.[0]) {
                    console.error('Gemini API Error: No response after tool execution.', result2.response);
                    const blockReason = result2.response?.promptFeedback?.blockReason;
                    let errorMessage = 'Sorry, I encountered an issue processing the job search results.';
                    if (blockReason) {
                        errorMessage = `My response was blocked potentially due to safety filters (${blockReason}) after processing results.`;
                        console.warn(`Gemini response blocked after tool call. Reason: ${blockReason}`);
                    }
                    return NextResponse.json({ error: errorMessage }, { status: 500 });
                }

                const finalResponseText = result2.response.candidates[0].content.parts[0].text || "Here are the job listings I found:";
                return NextResponse.json({ response: finalResponseText, jobListings: jobListings });
            }
            else if (call.name === 'event_search') {
                // @ts-ignore
                const events = await eventSearchTool.execute(call.args);

                const result2 = await model.generateContent({
                    contents: [
                        ...contents,
                        { role: 'model', parts: firstCandidate.content.parts },
                        { role: "function", parts: [{ functionResponse: { name: "event_search", response: { events } } }] }
                    ],
                    generationConfig,
                    safetySettings,
                });

                if (!result2.response?.candidates?.[0]) {
                    console.error('Gemini API Error: No response after tool execution.', result2.response);
                    const blockReason = result2.response?.promptFeedback?.blockReason;
                    let errorMessage = 'Sorry, I encountered an issue processing the event search results.';
                    if (blockReason) {
                        errorMessage = `My response was blocked potentially due to safety filters (${blockReason}) after processing results.`;
                        console.warn(`Gemini response blocked after tool call. Reason: ${blockReason}`);
                    }
                    return NextResponse.json({ error: errorMessage }, { status: 500 });
                }

                const finalResponseText = result2.response.candidates[0].content.parts[0].text || "Here are the events I found:";
                return NextResponse.json({ response: finalResponseText, events: events });
            }
            else {
                console.warn(`Unhandled tool call requested: ${call.name}`);
                return NextResponse.json({ response: "I received a request I cannot fulfill right now." });
            }
        }

        // No tool call, just a regular text response
        const finishReason = firstCandidate.finishReason;
        if (finishReason && finishReason !== "STOP") {
            console.warn(`Gemini generation finished due to: ${finishReason}`);
        }

        const textParts = firstCandidate.content?.parts?.filter(part => part.text).map(part => part.text);
        const responseText = textParts?.join(' ') || "Sorry, I couldn't generate a text response.";

        return NextResponse.json({ response: responseText });

    } catch (error) {
        console.error("Error in API route:", error);
        return NextResponse.json({ error: 'An error occurred while processing your request.' }, { status: 500 });
    }
} 