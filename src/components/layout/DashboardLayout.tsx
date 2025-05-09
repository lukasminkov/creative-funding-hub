
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Compass, Home, Layers, MessageSquare, Settings, User, LogOut, Moon, Sun, Plus, ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail, useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [{
  title: "Home",
  path: "/dashboard",
  icon: Home
}, {
  title: "Explore",
  path: "/dashboard/explore",
  icon: Compass
}, {
  title: "Campaigns",
  path: "/dashboard/campaigns",
  icon: Layers
}, {
  title: "Creators",
  path: "/dashboard/creators",
  icon: User
}, {
  title: "Payments",
  path: "/dashboard/payments",
  icon: CreditCard
}, {
  title: "Chats",
  path: "/dashboard/messages",
  icon: MessageSquare
}, {
  title: "Settings",
  path: "/dashboard/settings",
  icon: Settings
}];

const SidebarToggle = () => {
  const {
    toggleSidebar,
    state
  } = useSidebar();
  return <Button variant="ghost" size="icon" onClick={toggleSidebar} className={cn("h-8 w-8 z-50", state === "expanded" ? "absolute top-4 right-3" // Inside when expanded
  : "fixed left-[calc(var(--sidebar-width-icon)+0.25rem)] top-5" // Moved down to align with logo
  )}>
      {state === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>;
};

export default function DashboardLayout({
  children
}: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const {
    theme,
    setTheme
  } = useTheme();
  const {
    state
  } = useSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <div className="flex h-screen w-full bg-background dark:bg-background">
      <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r border-border/10 dark:bg-zinc-900 bg-zinc-50">
        <SidebarHeader className="relative">
          <div className={cn("flex h-16 items-center px-4", state === "expanded" ? "justify-start gap-2" : "justify-center")}>
            <div className={cn("flex h-10 w-10 min-w-10 items-center justify-center rounded-md bg-primary text-primary-foreground", state === "collapsed" && "mx-auto")}>
              <BarChart3 className="h-6 w-6" />
            </div>
            {state === "expanded" && <span className="text-lg font-semibold">Payper</span>}
          </div>
          {state === "expanded" && <SidebarToggle />}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="pt-4 px-[16px] py-[150px]">
            {menuItems.map(item => {
            const isActive = location.pathname === item.path || item.path !== "/dashboard" && location.pathname.startsWith(item.path);
            return <SidebarMenuItem key={item.title} className="mb-2">
                  <SidebarMenuButton tooltip={item.title} asChild isActive={isActive} className={cn("transition-all duration-200 h-10 rounded-md flex items-center", isActive ? "bg-primary text-white font-medium" : "hover:bg-accent", "group-data-[collapsible=icon]:h-10", "group-data-[collapsible=icon]:w-10", "group-data-[collapsible=icon]:flex", "group-data-[collapsible=icon]:items-center", "group-data-[collapsible=icon]:justify-center", "dark:hover:bg-zinc-800")}>
                    <Link to={item.path} className={cn("w-full flex items-center", state === "collapsed" ? "justify-center" : "justify-start")}>
                      <item.icon className={cn("h-7 w-7", state === "collapsed" ? "mx-auto" : "ml-3 mr-3")} />
                      <span className={cn(state === "collapsed" ? "sr-only" : "ml-2")}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>;
          })}
          </SidebarMenu>
          
          <div className="px-2 mt-auto mb-4">
            <Button asChild className={cn("w-full rounded-md h-10 bg-primary hover:bg-primary/90 transition-all", "group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10", "group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:mx-auto", state === "collapsed" ? "flex justify-center" : "flex justify-start", "group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center")}>
              <Link to="/dashboard/campaigns/create" className={cn("flex items-center w-full h-full", state === "collapsed" ? "justify-center" : "justify-center lg:justify-start")}>
                <Plus className={cn("h-7 w-7", state === "collapsed" ? "mx-auto" : "ml-0 mr-2")} />
                <span className={state === "collapsed" ? "sr-only" : ""}>
                  Create Campaign
                </span>
              </Link>
            </Button>
          </div>
        </SidebarContent>
        <SidebarFooter className="p-2 space-y-2 border-t border-border/10 mt-auto">
          <div className="flex items-center justify-between w-full px-2">
            <div className={cn("flex items-center gap-3", state === "collapsed" ? "justify-center w-full" : "")}>
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
                <AvatarFallback>AH</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">ad hoc gaming GmbH</span>
                <span className="text-xs text-muted-foreground">Business</span>
              </div>
            </div>
          </div>
          <div className={cn("flex w-full px-2", state === "collapsed" ? "justify-center" : "justify-between")}>
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-8 w-8 rounded-full">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {state === "expanded" && <Button variant="ghost" size="sm" className={cn("rounded-md h-8 w-8", "flex items-center justify-center", "dark:hover:bg-zinc-800")}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>}
          </div>
        </SidebarFooter>
      </Sidebar>
      {state === "collapsed" && <SidebarToggle />}
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>;
}
