"use client";

import { SettingsPanelTrigger } from "@/components/settings-panel";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  RiShareLine,
  RiShareCircleLine,
  RiShining2Line,
  RiEyeLine,
  RiQuestionLine,
  RiUserFollowLine,
  RiSendPlaneFill,
  RiFileChartLine,
  RiCalendarEventLine,
  RiFileList3Line,
  RiUserStarLine,
  RiWomenLine,
  RiQrScan2Line,
  RiAlertLine,
  RiSettings4Line,
} from "@remixicon/react";
import { ChatMessage } from "@/components/chat-message";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { JobCard } from "./job-card";
import { EventCard, type Event } from "./event-card";
import { useChat } from "@/hooks/use-chat";
import { toast } from "sonner";

// Define message type including optional job listings and events
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  jobListings?: any[];
  events?: Event[];
}

interface ChatProps {
  className?: string;
  assistantId?: string;
  sampleQuestions?: string[];
}

interface ChatResponse {
  response: string;
  jobListings?: any[];
  events?: Event[];
}

export default function Chat({ className, assistantId, sampleQuestions }: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSelected, setChatSelected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { messages: chatMessages, input, handleInputChange, handleSubmit, isLoading: aiLoading } = useChat({
    api: "/api/chat",
    body: {
      assistantId: assistantId
    },
    onResponse: (response: ChatResponse) => {
      // Handle response
      if (response.jobListings) {
        // Handle job listings
      }
      if (response.events) {
        // Handle events
      }
    },
    onError: (error: Error) => {
      console.error("Chat error:", error);
      toast.error(error.message || "An error occurred while processing your request");
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      jobListings: [],
      events: [],
    };
    setMessages(prev => [...prev, newMessage]);
    setChatSelected(true);
    const currentInput = inputValue;
    setInputValue('');

    setIsLoading(true);
    setError(null);

    const historyForApi = messages.slice(-8).map(msg => ({ text: msg.text, isUser: msg.isUser }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          history: historyForApi,
          assistantId,
        }),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Add AI response, including job listings and events if present
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.response,
          isUser: false,
          jobListings: data.jobListings,
          events: data.events,
        }
      ]);

    } catch (err: any) {
      console.error("Failed to fetch AI response:", err);
      setIsLoading(false);
      setError(err.message || "Failed to get response from EatSmart.");
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: `Error: ${err.message || "Could not connect"}`,
          isUser: false,
        }
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  return (
    <ScrollArea className="flex-1 [&>div>div]:h-full w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-[#2D3B55]">
      <div className="h-full flex flex-col px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="py-5 bg-[#172033] sticky top-0 z-10 before:absolute before:inset-x-0 before:bottom-0 before:h-px before:bg-gradient-to-r before:from-black/[0.06] before:via-black/10 before:to-black/[0.06]">
          <div className="flex items-center justify-between gap-2">
            <Breadcrumb>
              <BreadcrumbList className="sm:gap-1.5">
                <BreadcrumbItem>
                  <BreadcrumbPage>EatSmart Chatbot</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-1 -my-2 -me-2">

              <Button variant="ghost" className="px-2 hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all">
                <RiShareLine
                  className="text-muted-foreground sm:text-muted-foreground/70 size-5"
                  size={20}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Share</span>
              </Button>
              <Button variant="ghost" className="px-2 hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all">
                <RiShareCircleLine
                  className="text-muted-foreground sm:text-muted-foreground/70 size-5"
                  size={20}
                  aria-hidden="true"
                />
                <span className="max-sm:sr-only">Export</span>
              </Button>
              <SettingsPanelTrigger />
            </div>
          </div>
        </div>
        {/* Chat */}
        <div className="relative grow">
          {!chatSelected && messages.length === 0 ? (
            <div className="max-w-3xl mx-auto mt-6 flex flex-col items-center justify-center h-[calc(100%-120px)]">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold mb-6">How can I help you eat smarter today?</h1>
                <p className="text-muted-foreground">
                  EatSmart helps you scan packaged foods and get personalized health insights.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-14 px-4 hover:bg-background/80 hover:border-primary/50 transition-all hover:text-white"
                  onClick={() => handleSuggestionClick("Start a new scan")}
                >
                  <RiQrScan2Line className="text-primary" size={20} />
                  <span>New Scan</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-14 px-4 hover:bg-background/80 hover:border-primary/50 transition-all hover:text-white"
                  onClick={() => handleSuggestionClick("Show my alerts")}
                >
                  <RiAlertLine className="text-primary" size={20} />
                  <span>View Alerts</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-2 h-14 px-4 hover:bg-background/80 hover:border-primary/50 transition-all hover:text-white col-span-1 md:col-span-2"
                  onClick={() => handleSuggestionClick("Open settings")}
                >
                  <RiSettings4Line className="text-primary" size={20} />
                  <span>Settings</span>
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto mt-6 space-y-6">
              {chatSelected && (
                <div className="text-center my-8">
                  <div className="inline-flex items-center bg-white rounded-full border border-black/[0.08] shadow-xs text-xs font-medium py-1 px-3 text-foreground/80">
                    <RiShining2Line
                      className="me-1.5 text-muted-foreground/70 -ms-1"
                      size={14}
                      aria-hidden="true"
                    />
                    Today
                  </div>
                </div>
              )}

              {/* Display all messages, including job cards and events */}
              {messages.map((message, index) => (
                <ChatMessage key={index} isUser={message.isUser}>
                  {message.text}
                  {/* Render job listings if present */}
                  {message.jobListings && message.jobListings.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.jobListings.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                  )}
                  {/* Render events if present */}
                  {message.events && message.events.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {message.events.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </ChatMessage>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-start gap-4">
                  <img
                    className="rounded-full border border-black/[0.08] shadow-sm"
                    src="https://res.cloudinary.com/dlzlfasou/image/upload/v1741345634/user-01_i5l7tp.png"
                    alt="EatSmart"
                    width={40}
                    height={40}
                  />
                  <div className="flex space-x-1 px-4 py-3 items-center">
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce animation-delay-100"></div>
                    <div className="h-2 w-2 bg-primary rounded-full animate-bounce animation-delay-200"></div>
                  </div>
                </div>
              )}

              {/* Display Error Message if any */}
              {error && (
                <ChatMessage isUser={false}>
                  <p className="text-red-600">Error: {error}</p>
                </ChatMessage>
              )}

              <div ref={messagesEndRef} aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 pt-4 md:pt-8 z-50">
          <div className="max-w-3xl mx-auto bg-[#2D3B55] rounded-[20px] pb-4 md:pb-8">
            <div className="relative rounded-[20px] border border-transparent bg-muted transition-colors focus-within:bg-muted/50 focus-within:border-input has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 [&:has(input:is(:disabled))_*]:pointer-events-none">
              <textarea
                className="flex sm:min-h-[84px] w-full bg-transparent px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none [resize:none]"
                placeholder="Ask me anything..."
                aria-label="Enter your prompt"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {/* Textarea buttons */}
              <div className="flex items-center justify-between gap-2 p-3">
                {/* Left buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-none hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all"
                  >
                    <RiQrScan2Line
                      className="text-muted-foreground/70 size-4 mr-1"
                      aria-hidden="true"
                    />
                    <span>New Scan</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-none hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all"
                  >
                    <RiAlertLine
                      className="text-muted-foreground/70 size-4 mr-1"
                      aria-hidden="true"
                    />
                    <span>View Alerts</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-none hover:bg-background/80 hover:text-foreground hover:shadow-sm transition-all"
                  >
                    <RiSettings4Line
                      className="text-muted-foreground/70 size-4 mr-1"
                      aria-hidden="true"
                    />
                    <span>Settings</span>
                  </Button>
                </div>
                {/* Right buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-full h-8 gap-2 hover:bg-primary/90 transition-colors"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading} // Disable while typing
                  >
                    <span>Ask EatSmart</span>
                    <RiSendPlaneFill size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
