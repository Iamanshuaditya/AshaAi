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
            <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6 lg:px-8 bg-sidebar text-sidebar-foreground border-b">
              <SidebarTrigger className="-ms-2" />
              <div className="flex items-center gap-8 ml-auto">
                <UserDropdown />
              </div>
            </header>
            <main className="flex-1 flex min-h-0">
              <Chat className="flex-1" />
              <SettingsPanel />
            </main>
          </div>
        </div>
      </SettingsPanelProvider>
    </SidebarProvider>
  );
}
