"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Assistant, assistants } from "@/lib/assistants";
import Chat from "@/components/chat";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine } from "@remixicon/react";
import { SettingsPanelProvider } from "@/components/settings-panel";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AssistantChatPage() {
    const params = useParams();
    const [assistant, setAssistant] = useState<Assistant | null>(null);

    useEffect(() => {
        const found = assistants.find(a => a.id === params.assistantId);
        setAssistant(found || null);
    }, [params.assistantId]);

    if (!assistant) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Assistant Not Found</h1>
                <p className="text-muted-foreground mb-6">The assistant you're looking for doesn't exist.</p>
                <Link href="/assistants">
                    <Button>Return to Assistants Gallery</Button>
                </Link>
            </div>
        );
    }

    return (
        <SidebarProvider>
            <SettingsPanelProvider>
                <div className="flex h-screen w-full">
                    <AppSidebar className="w-[300px] shrink-0" />
                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex items-center gap-4 p-4 border-b">
                            <Link href="/assistants">
                                <Button variant="ghost" size="icon">
                                    <RiArrowLeftLine className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <assistant.icon className="w-8 h-8" style={{ color: assistant.primaryColor }} />
                                <div>
                                    <h1 className="text-lg font-semibold">{assistant.name}</h1>
                                    <p className="text-sm text-muted-foreground">{assistant.description}</p>
                                </div>
                            </div>
                        </div>

                        <Chat
                            className="flex-1"
                            assistantId={assistant.id}
                            sampleQuestions={assistant.sampleQuestions}
                        />
                    </div>
                </div>
            </SettingsPanelProvider>
        </SidebarProvider>
    );
} 