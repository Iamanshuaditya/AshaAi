import {
    RiFileTextLine,
    RiLightbulbLine,
    RiGroupLine,
    RiCalendarEventLine,
    RiQuestionLine,
} from "@remixicon/react";

export interface Assistant {
    id: string;
    name: string;
    description: string;
    icon: typeof RiFileTextLine;
    primaryColor: string;
    secondaryColor: string;
    capabilities: string[];
    sampleQuestions: string[];
}

export const assistants: Assistant[] = [
    {
        id: "resume-architect",
        name: "Resume Architect",
        description: "Expert in crafting tailored resumes that highlight your unique strengths and experiences, with a focus on women's professional achievements.",
        icon: RiFileTextLine,
        primaryColor: "oklch(0.6 0.15 145)",
        secondaryColor: "oklch(0.7 0.15 145)",
        capabilities: [
            "Detailed resume analysis and feedback",
            "Achievement-focused content optimization",
            "Industry-specific keyword optimization",
            "Gender bias mitigation in language",
            "ATS-friendly formatting guidance"
        ],
        sampleQuestions: [
            "Can you review my resume and suggest improvements?",
            "How can I highlight my career break positively?",
            "What skills should I emphasize for a tech leadership role?",
            "How do I showcase my achievements without sounding boastful?",
            "Can you help me tailor my resume for a specific job posting?"
        ],
    },
    {
        id: "career-coach",
        name: "Career Coach",
        description: "Your personal guide for career development, professional growth, and workplace navigation, specializing in women's career advancement.",
        icon: RiLightbulbLine,
        primaryColor: "oklch(0.6 0.18 45)",
        secondaryColor: "oklch(0.7 0.18 45)",
        capabilities: [
            "Personalized career planning",
            "Leadership development guidance",
            "Negotiation and advocacy strategies",
            "Work-life balance coaching",
            "Professional networking advice"
        ],
        sampleQuestions: [
            "How can I prepare for a leadership role in tech?",
            "What strategies can help me negotiate a promotion?",
            "How do I build a strong professional network?",
            "What skills should I develop for career advancement?",
            "How can I maintain work-life balance while pursuing growth?"
        ],
    },
    {
        id: "community-connector",
        name: "Community Connector",
        description: "Connecting you with mentorship opportunities, networking events, and professional communities focused on women's empowerment.",
        icon: RiGroupLine,
        primaryColor: "oklch(0.6 0.18 300)",
        secondaryColor: "oklch(0.7 0.18 300)",
        capabilities: [
            "Mentorship program matching",
            "Professional community recommendations",
            "Networking event suggestions",
            "Industry-specific group connections",
            "Women's leadership community access"
        ],
        sampleQuestions: [
            "What mentorship programs are available in tech?",
            "Are there any upcoming women in leadership events?",
            "How can I find a mentor in my industry?",
            "What professional communities should I join?",
            "Can you suggest networking events for women in tech?"
        ],
    },
    {
        id: "event-planner",
        name: "Event Planner",
        description: "Your guide to career-focused events, workshops, and professional development opportunities tailored for women professionals.",
        icon: RiCalendarEventLine,
        primaryColor: "oklch(0.6 0.18 180)",
        secondaryColor: "oklch(0.7 0.18 180)",
        capabilities: [
            "Career event recommendations",
            "Workshop and training suggestions",
            "Conference planning assistance",
            "Professional development tracking",
            "Event calendar management"
        ],
        sampleQuestions: [
            "What career development events are happening this month?",
            "Are there any upcoming leadership workshops?",
            "Can you find tech conferences with women speakers?",
            "What skill-building workshops are available?",
            "How can I track relevant industry events?"
        ],
    },
    {
        id: "career-explorer",
        name: "Career Explorer",
        description: "Helping you discover and navigate new career paths, opportunities, and transitions with a focus on women's professional growth.",
        icon: RiQuestionLine,
        primaryColor: "oklch(0.6 0.18 0)",
        secondaryColor: "oklch(0.7 0.18 0)",
        capabilities: [
            "Career transition guidance",
            "Industry trend analysis",
            "Skill gap assessment",
            "Job market insights",
            "Alternative career path exploration"
        ],
        sampleQuestions: [
            "What are emerging career opportunities in tech?",
            "How can I transition to a new industry?",
            "What skills are in demand for my field?",
            "Should I consider a career pivot?",
            "What are the growth areas in my industry?"
        ],
    }
];