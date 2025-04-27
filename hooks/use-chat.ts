import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface Message {
    id: string;
    text: string;
    isUser: boolean;
    jobListings?: any[];
    events?: any[];
}

interface ChatResponse {
    response: string;
    jobListings?: any[];
    events?: any[];
}

interface UseChatOptions {
    api: string;
    body?: Record<string, any>;
    onResponse?: (response: ChatResponse) => void;
    onError?: (error: Error) => void;
}

interface UseChatResult {
    messages: Message[];
    input: string;
    isLoading: boolean;
    error: Error | null;
    handleInputChange: (value: string) => void;
    handleSubmit: () => Promise<void>;
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function useChat({
    api,
    body = {},
    onResponse,
    onError,
}: UseChatOptions): UseChatResult {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const handleInputChange = useCallback((value: string) => {
        setInput(value);
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!input.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: input,
            isUser: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const historyForApi = messages.slice(-8).map(msg => ({
                text: msg.text,
                isUser: msg.isUser,
            }));

            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    history: historyForApi,
                    ...body,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data: ChatResponse = await response.json();

            const aiMessage: Message = {
                id: Date.now().toString(),
                text: data.response,
                isUser: false,
                jobListings: data.jobListings,
                events: data.events,
            };

            setMessages(prev => [...prev, aiMessage]);
            onResponse?.(data);

        } catch (err) {
            const error = err instanceof Error ? err : new Error('An error occurred');
            console.error('Chat error:', error);
            setError(error);
            onError?.(error);
            toast.error(error.message || 'Failed to get response');
        } finally {
            setIsLoading(false);
        }
    }, [api, body, input, messages, onResponse, onError]);

    return {
        messages,
        input,
        isLoading,
        error,
        handleInputChange,
        handleSubmit,
        setMessages,
    };
} 