
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, Users, Building2, Layers, Settings, LogOut, 
  Moon, Sun, ChevronLeft, ChevronRight, ShieldAlert, CreditCard,
  Bell, MessageSquare, TrendingUp
} from "lucide-react";
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, 
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader, 
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import { ViewAsButton } from "@/components/admin/ViewAsButton";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: BarChart3
  }, 
  {
    title: "Analytics",
    path: "/admin/analytics",
    icon: TrendingUp
  },
  {
    title: "Users",
    path: "/admin/users",
    icon: Users
  }, 
  {
    title: "Brands",
    path: "/admin/brands",
    icon: Building2
  }, 
  {
    title: "Campaigns",
    path: "/admin/campaigns",
    icon: Layers
  }, 
  {
    title: "Payments",
    path: "/admin/payments",
    icon: CreditCard
  },
  {
    title: "Notifications",
    path: "/admin/notifications",
    icon: Bell
  },
  {
    title: "Messages",
    path: "/admin/messages",
    icon: MessageSquare
  },
  {
    title: "Settings",
    path: "/admin/settings",
    icon: Settings
  }
];

const SidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className={cn(
        "h-8 w-8 z-50", 
        state === "expanded" 
          ? "absolute top-4 right-3" // Inside when expanded
          : "fixed left-[calc(var(--sidebar-width-icon)+0.25rem)] top-5" // Moved down to align with logo
      )}
    >
      {state === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen w-full bg-background dark:bg-background">
      <Sidebar 
        side="left" 
        variant="sidebar" 
        collapsible="icon" 
        className="border-r border-border/10 dark:bg-zinc-900 bg-zinc-50"
      >
        <SidebarHeader className="relative">
          <div className={cn(
            "flex h-16 items-center px-4", 
            state === "expanded" ? "justify-start gap-2" : "justify-center"
          )}>
            <div className={cn(
              "flex h-10 w-10 min-w-10 items-center justify-center rounded-md bg-red-600 text-primary-foreground", 
              state === "collapsed" && "mx-auto"
            )}>
              <ShieldAlert className="h-6 w-6" />
            </div>
            {state === "expanded" && <span className="text-lg font-semibold">Admin Portal</span>}
          </div>
          {state === "expanded" && <SidebarToggle />}
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu className="pt-4 px-[16px] py-[150px]">
            {menuItems.map(item => {
              const isActive = location.pathname === item.path || 
                (item.path !== "/admin" && location.pathname.startsWith(item.path));
                
              return (
                <SidebarMenuItem key={item.title} className="mb-2">
                  <SidebarMenuButton 
                    tooltip={item.title} 
                    asChild 
                    isActive={isActive} 
                    className={cn(
                      "transition-all duration-200 h-10 rounded-md flex items-center", 
                      isActive ? "bg-red-600 text-white font-medium" : "hover:bg-accent", 
                      "group-data-[collapsible=icon]:h-10",
                      "group-data-[collapsible=icon]:w-10",
                      "group-data-[collapsible=icon]:flex",
                      "group-data-[collapsible=icon]:items-center",
                      "group-data-[collapsible=icon]:justify-center",
                      "dark:hover:bg-zinc-800"
                    )}
                  >
                    <Link 
                      to={item.path} 
                      className={cn(
                        "w-full flex items-center", 
                        state === "collapsed" ? "justify-center" : "justify-start"
                      )}
                    >
                      <item.icon className={cn(
                        "h-7 w-7", 
                        state === "collapsed" ? "mx-auto" : "ml-3 mr-3"
                      )} />
                      <span className={cn(state === "collapsed" ? "sr-only" : "ml-2")}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
          
          {state === "expanded" && (
            <div className="px-4 mb-6">
              <ViewAsButton />
            </div>
          )}
        </SidebarContent>
        
        <SidebarFooter className="p-2 space-y-2 border-t border-border/10 mt-auto">
          <div className="flex items-center justify-between w-full px-2">
            <div className={cn(
              "flex items-center gap-3", 
              state === "collapsed" ? "justify-center w-full" : ""
            )}>
              <Avatar className="h-9 w-9 border-2 border-red-600/20">
                <AvatarImage src="https://github.com/shadcn.png" alt="@admin" />
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">Super Admin</span>
                <span className="text-xs text-muted-foreground">System Owner</span>
              </div>
            </div>
          </div>
          
          <div className={cn(
            "flex w-full px-2", 
            state === "collapsed" ? "justify-center" : "justify-between"
          )}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
              className="h-8 w-8 rounded-full"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {state === "expanded" && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn(
                  "rounded-md h-8 w-8", 
                  "flex items-center justify-center", 
                  "dark:hover:bg-zinc-800"
                )}
              >
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Log out</span>
              </Button>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {state === "collapsed" && <SidebarToggle />}
      
      <div className="flex-1 flex flex-col overflow-auto">
        <header className="border-b border-border p-4 flex items-center justify-between bg-background/90 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold">Admin Portal</h1>
          
          {state === "collapsed" && (
            <div className="flex items-center gap-2">
              <ViewAsButton />
            </div>
          )}
        </header>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
