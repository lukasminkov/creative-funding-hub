
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
    title: "Explore",
    path: "/dashboard/explore",
    icon: Compass,
  },
  {
    title: "Home",
    path: "/dashboard",
    icon: Home,
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background dark:bg-background">
        <Sidebar variant="floating" collapsible="icon" className="border-r border-border/10 bg-sidebar dark:bg-sidebar">
          <SidebarHeader>
            <div className="flex h-16 items-center gap-2 px-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold">CreatorCRM</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                      (item.path !== "/dashboard" && location.pathname.startsWith(item.path));
                    
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          asChild
                          isActive={isActive}
                          className={cn(
                            "transition-all duration-200",
                            isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-primary/5"
                          )}
                        >
                          <Link to={item.path}>
                            <item.icon className={cn(
                              "h-5 w-5 transition-colors",
                              isActive && "text-primary"
                            )} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup className="mt-4">
              <SidebarGroupLabel>Create New</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild
                      className="bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                    >
                      <Link to="/dashboard/campaigns/create">
                        <Plus className="h-5 w-5" />
                        <span>Create Campaign</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4 border-t border-border/10 mt-auto">
            <div className="flex items-center justify-between w-full px-2">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                  <AvatarFallback>AH</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">ad hoc gaming GmbH</span>
                  <span className="text-xs text-muted-foreground">Business</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="ml-auto h-8 w-8"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
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
