
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Compass,
  Home, 
  Layers, 
  MessageSquare, 
  Settings, 
  User, 
  LogOut,
  Moon,
  Sun,
  Plus
} from "lucide-react";
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
  SidebarProvider, 
  SidebarRail,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Home",
    path: "/dashboard",
    icon: Home,
  },
  {
    title: "Explore",
    path: "/dashboard/explore",
    icon: Compass,
  },
  {
    title: "Campaigns",
    path: "/dashboard/campaigns",
    icon: Layers,
  },
  {
    title: "Creators",
    path: "/dashboard/creators",
    icon: User,
  },
  {
    title: "Chats",
    path: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background dark:bg-background">
        <Sidebar variant="floating" collapsible="icon" className="border-r border-border/10">
          <SidebarHeader>
            <div className="flex h-16 items-center gap-2 px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">CreatorCRM</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-2 pt-4">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                
                return (
                  <SidebarMenuItem key={item.title} className="mb-2">
                    <SidebarMenuButton 
                      tooltip={item.title}
                      asChild
                      isActive={isActive}
                      className={cn(
                        "transition-all duration-200 h-10 rounded-xl flex items-center",
                        isActive 
                          ? "bg-primary text-white font-medium" 
                          : "hover:bg-accent",
                        // Make the button icon-centric when collapsed, centered vertically
                        "group-data-[collapsible=icon]:h-10",
                        "group-data-[collapsible=icon]:w-10",
                        "group-data-[collapsible=icon]:flex",
                        "group-data-[collapsible=icon]:items-center",
                        "group-data-[collapsible=icon]:justify-center"
                      )}
                    >
                      <Link to={item.path} className="w-full flex items-center">
                        <item.icon className={cn(
                          "h-5 w-5",
                          // Adjust the icon positioning for expanded/collapsed states
                          "group-data-[collapsible=icon]:mx-auto",
                          "group-data-[state=expanded]:ml-3 group-data-[state=expanded]:mr-3"
                        )} />
                        <span className="group-data-[collapsible=icon]:sr-only">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
            
            <div className="px-4 mt-8">
              <Button 
                asChild
                className={cn(
                  "w-full justify-start rounded-xl h-10 bg-primary hover:bg-primary/90 transition-all",
                  "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10",
                  "group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:min-w-10",
                  "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center",
                  "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
                )}
              >
                <Link to="/dashboard/campaigns/create" className="flex items-center w-full justify-center">
                  <Plus className={cn(
                    "h-5 w-5",
                    "group-data-[collapsible=icon]:mx-auto",
                    "group-data-[state=expanded]:ml-0 group-data-[state=expanded]:mr-2"
                  )} />
                  <span className="group-data-[collapsible=icon]:sr-only">
                    Create Campaign
                  </span>
                </Link>
              </Button>
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4 border-t border-border/10 mt-auto">
            <div className="flex items-center justify-between w-full px-2">
              <div className={cn(
                "flex items-center gap-3",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full"
              )}>
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-medium">ad hoc gaming GmbH</span>
                  <span className="text-xs text-muted-foreground">Business</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={cn(
                  "ml-auto h-8 w-8 rounded-full",
                  "group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:absolute group-data-[collapsible=icon]:bottom-20 group-data-[collapsible=icon]:left-1/2 group-data-[collapsible=icon]:transform group-data-[collapsible=icon]:-translate-x-1/2"
                )}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "w-full justify-start rounded-xl",
                "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-8",
                "group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:min-w-10",
                "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center",
                "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto"
              )}
            >
              <LogOut className={cn(
                "h-4 w-4",
                "group-data-[collapsible=icon]:mx-auto",
                "group-data-[state=expanded]:mr-2"
              )} />
              <span className="group-data-[collapsible=icon]:sr-only">
                Log out
              </span>
            </Button>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <div className="flex-1 overflow-auto bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-background/95 px-6 backdrop-blur">
            <SidebarTrigger />
            <div className="flex w-full items-center justify-between">
              <h1 className="text-xl font-semibold">
                {menuItems.find(item => item.path === location.pathname || 
                  (item.path !== "/dashboard" && location.pathname.startsWith(item.path)))?.title || "Dashboard"}
              </h1>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
