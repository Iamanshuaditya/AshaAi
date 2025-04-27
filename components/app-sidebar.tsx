"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  RiBriefcase2Line,
  RiCalendarEventLine,
  RiUserStarLine,
  RiFileTextLine,
  RiCodeLine,
  RiTeamLine,
  RiCustomerService2Line,
  RiSettings4Line,
  RiAddLine,
  RiHistoryLine,
  RiCalendarLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "@remixicon/react";
import { Button } from "@/components/ui/button";

// This is sample data.
const data = {
  teams: [
    {
      name: "Asha AI by JobsForHer",
      logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345635/logo-01_upxvqe.png",
    },
    {
      name: "Acme Corp.",
      logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345635/logo-01_upxvqe.png",
    },
    {
      name: "Evil Corp.",
      logo: "https://res.cloudinary.com/dlzlfasou/image/upload/v1741345635/logo-01_upxvqe.png",
    },
  ],
  chatHistory: [
    {
      title: "Job Query  ",
      url: "#",
    },
    {
      title: "Signup Help",
      url: "#",
    },
    {
      title: "Career Advice",
      url: "#",
    },
    {
      title: "Mentorship Question",
      url: "#",
    },
  ],
  navMain: [
    {
      title: "ASHA AI",
      url: "#",
      items: [
        {
          title: "Prev Chats",
          url: "#",
          icon: RiHistoryLine,
          isActive: true,
          isCollapsible: true,
        },
        {
          title: "Job & Event Feed",
          url: "#",
          icon: RiBriefcase2Line,
        },
        {
          title: "Assistants",
          url: "/assistants",
          icon: RiUserStarLine,
        },
        {
          title: "Ethics & Feedback",
          url: "#",
          icon: RiFileTextLine,
        },
        {
          title: "Documentation",
          url: "#",
          icon: RiCodeLine,
        },
      ],
    },
    {
      title: "More",
      url: "#",
      items: [
        {
          title: "Community",
          url: "#",
          icon: RiTeamLine,
        },
        {
          title: "Help Centre",
          url: "#",
          icon: RiCustomerService2Line,
        },
        {
          title: "Settings",
          url: "#",
          icon: RiSettings4Line,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = React.useState<{ [key: string]: boolean }>({
    "Prev Chats": true
  });

  const toggleExpand = (itemTitle: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemTitle]: !prev[itemTitle]
    }));
  };

  const handleNavigation = (url: string) => {
    if (url !== "#") {
      router.push(url);
    }
  };

  return (
    <Sidebar {...props} className="dark !border-none">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <div className="px-2 mt-2">
          <Button className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            <RiAddLine size={18} />
            <span>New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50 hover:">
            {data.navMain[0]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[0]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.isCollapsible ? (
                    <>
                      <SidebarMenuButton
                        className="group/menu-button font-medium gap-3 h-9 rounded-md data-[active=true]:hover:bg-sidebar-primary/30 data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto hover:bg-sidebar-primary/10 transition-all"
                        isActive={item.isActive}
                        onClick={() => toggleExpand(item.title)}
                      >
                        {item.icon && (
                          <item.icon
                            className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                            size={22}
                            aria-hidden="true"
                          />
                        )}
                        <span>{item.title}</span>
                        <span className="ml-auto">
                          {expandedItems[item.title] ? (
                            <RiArrowDownSLine
                              className="text-sidebar-foreground/60"
                              size={18}
                              aria-hidden="true"
                            />
                          ) : (
                            <RiArrowRightSLine
                              className="text-sidebar-foreground/60"
                              size={18}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                      </SidebarMenuButton>

                      {expandedItems[item.title] && (
                        <SidebarMenuSub>
                          {data.chatHistory.map((chat) => (
                            <SidebarMenuSubItem key={chat.title}>
                              <SidebarMenuSubButton
                                className="pl-2 gap-2 hover:bg-sidebar-primary/10 transition-all"
                                onClick={() => handleNavigation(chat.url)}
                              >
                                <span>{chat.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      )}
                    </>
                  ) : (
                    <SidebarMenuButton
                      className="group/menu-button font-medium gap-3 h-9 rounded-md data-[active=true]:hover:bg-sidebar-primary/30 data-[active=true]:bg-gradient-to-b data-[active=true]:from-sidebar-primary data-[active=true]:to-sidebar-primary/70 data-[active=true]:shadow-[0_1px_2px_0_rgb(0_0_0/.05),inset_0_1px_0_0_rgb(255_255_255/.12)] [&>svg]:size-auto hover:bg-sidebar-primary/10 transition-all"
                      isActive={item.isActive}
                      onClick={() => handleNavigation(item.url)}
                    >
                      {item.icon && (
                        <item.icon
                          className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-sidebar-foreground"
                          size={22}
                          aria-hidden="true"
                        />
                      )}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase text-sidebar-foreground/50">
            {data.navMain[1]?.title}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {data.navMain[1]?.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="group/menu-button font-medium gap-3 h-9 rounded-md [&>svg]:size-auto hover:bg-sidebar-primary/10 transition-all"
                    isActive={item.isActive}
                    onClick={() => handleNavigation(item.url)}
                  >
                    {item.icon && (
                      <item.icon
                        className="text-sidebar-foreground/50 group-data-[active=true]/menu-button:text-primary"
                        size={22}
                        aria-hidden="true"
                      />
                    )}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
