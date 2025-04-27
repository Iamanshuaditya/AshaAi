"use client";

import { useState } from "react";
import { Assistant, assistants } from "@/lib/assistants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RiSearchLine } from "@remixicon/react";
import Link from "next/link";
import { AppSidebar } from "@/components/app-sidebar";
import { SettingsPanelProvider } from "@/components/settings-panel";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AssistantsPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredAssistants = assistants.filter(assistant =>
        assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assistant.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <SidebarProvider>
            <SettingsPanelProvider>
                <div className="flex h-screen w-full">
                    <AppSidebar className="w-[300px] shrink-0" />
                    <div className="flex-1 overflow-auto min-w-0">
                        <div className="container mx-auto px-4 py-8">
                            <div className="flex flex-col items-center mb-8">
                                <h1 className="text-3xl font-bold mb-4">Explore Specialized Assistants</h1>
                                <p className="text-muted-foreground text-center max-w-2xl mb-6">
                                    Discover our team of AI assistants, each specialized in different aspects of career development and professional growth.
                                </p>
                                <div className="relative w-full max-w-md">
                                    <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search assistants..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredAssistants.map((assistant) => (
                                    <AssistantCard key={assistant.id} assistant={assistant} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsPanelProvider>
        </SidebarProvider>
    );
}

function AssistantCard({ assistant }: { assistant: Assistant }) {
    return (
        <div className="bg-card rounded-lg shadow-lg overflow-hidden border border-border hover:border-primary/50 transition-colors">
            <div
                className="p-6"
                style={{
                    background: `linear-gradient(135deg, ${assistant.primaryColor || 'oklch(0.6 0.15 145)'}, ${assistant.secondaryColor || 'oklch(0.7 0.15 145)'})`
                }}
            >
                <assistant.icon className="w-12 h-12 text-white mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{assistant.name}</h3>
                <p className="text-white/90 text-sm">{assistant.description}</p>
            </div>

            <div className="p-6">
                <div className="mb-4">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Capabilities</h4>
                    <ul className="space-y-1">
                        {assistant.capabilities.slice(0, 3).map((capability, index) => (
                            <li key={index} className="text-sm flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-primary" />
                                {capability}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-muted-foreground mb-2">Sample Questions</h4>
                    <ul className="space-y-1">
                        {assistant.sampleQuestions.slice(0, 2).map((question, index) => (
                            <li key={index} className="text-sm text-muted-foreground">{question}</li>
                        ))}
                    </ul>
                </div>

                <Link href={`/assistants/${assistant.id}`}>
                    <Button className="w-full">Chat with {assistant.name}</Button>
                </Link>
            </div>
        </div>
    );
} 