
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Compass,
  Home, 
  Layers, 
  MessageSquare, 
  Search,
  Settings, 
  User, 
  LogOut
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
    title: "Messages",
    path: "/dashboard/messages",
    icon: MessageSquare,
  },
  {
    title: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-900">
        <Sidebar variant="floating" collapsible="icon">
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
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
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
                        >
                          <Link to={item.path}>
                            <item.icon className={cn(
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
          </SidebarContent>
          <SidebarFooter className="p-4 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">ad hoc gaming GmbH</span>
                <span className="text-xs text-muted-foreground">Business</span>
              </div>
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
              
              <div className="flex items-center gap-3">
                <div className="relative w-64 lg:w-80">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search..."
                    className="h-9 w-full rounded-md border border-input bg-background pl-8 pr-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </div>
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
