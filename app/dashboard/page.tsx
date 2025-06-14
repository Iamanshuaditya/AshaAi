import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EatSmart Chatbot",
};

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/user-dropdown";
import {
  SettingsPanelProvider,
  SettingsPanel,
} from "@/components/settings-panel";
import Chat from "@/components/chat";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <SettingsPanelProvider>
        <div className="flex h-screen w-full">
          <AppSidebar className="w-[300px] shrink-0" />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="flex h-16 shrink-0 items-center justify-between px-4 md:px-6 lg:px-8 bg-[#172033] border-b border-[#4B5EAA] text-white">
              <div className="flex items-center gap-2">
                <img
                  src="https://res.cloudinary.com/dlzlfasou/image/upload/v1741345635/logo-01_upxvqe.png"
                  alt="EatSmart logo"
                  width={20}
                  height={20}
                />
                <span className="font-bold text-lg">EatSmart Chatbot</span>
              </div>
              <div className="flex items-center gap-4">
                <UserDropdown />
                <Button variant="destructive" size="sm">Close</Button>
              </div>
            </header>
            <main className="flex-1 flex min-h-0 items-center justify-center bg-[#1E2A44]">
              <Chat className="shadow-lg" />
              <SettingsPanel />
            </main>
          </div>
        </div>
      </SettingsPanelProvider>
    </SidebarProvider>
  );
}
