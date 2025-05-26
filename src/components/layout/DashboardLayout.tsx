
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, Compass, Home, Layers, MessageSquare, 
  LogOut, Moon, Sun, Plus, Menu, X, CreditCard, Bell, Settings
} from "lucide-react";
import { 
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, 
  SidebarGroupContent, SidebarHeader, SidebarMenu, 
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, useSidebar 
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTheme } from "@/providers/theme-provider";
import CampaignFormDialog from "@/components/dashboard/CampaignFormDialog";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { title: "Home", path: "/dashboard", icon: Home },
  { title: "Explore", path: "/dashboard/explore", icon: Compass },
  { title: "My Campaigns", path: "/dashboard/campaigns", icon: Layers },
  { title: "Chat", path: "/dashboard/messages", icon: MessageSquare },
  { title: "Finances", path: "/dashboard/finances", icon: CreditCard }
];

const ModernSidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="h-9 w-9 fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-md border shadow-md hover:shadow-lg transition-all"
    >
      {state === "expanded" ? (
        <X className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  );
};

function DashboardLayoutContent({ children }: DashboardLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
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
    <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar 
        side="left" 
        variant="sidebar" 
        collapsible="icon" 
        className="border-none bg-white/95 dark:bg-black/60 backdrop-blur-xl shadow-xl"
      >
        <SidebarHeader className="border-b border-border/50 pb-4">
          <div className={cn(
            "flex items-center px-4 py-6",
            state === "expanded" ? "justify-start gap-3" : "justify-center"
          )}>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg">
              <BarChart3 className="h-7 w-7" />
            </div>
            {state === "expanded" && (
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  Payper
                </span>
                <span className="text-xs text-muted-foreground">Creator Platform</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
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
                          "h-12 rounded-xl transition-all duration-200 group",
                          isActive 
                            ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg scale-[1.02]" 
                            : "hover:bg-accent/50 hover:scale-[1.02] hover:shadow-md"
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-3 px-4">
                          <item.icon className={cn(
                            "h-5 w-5 transition-transform group-hover:scale-110",
                            state === "collapsed" && "mx-auto"
                          )} />
                          {state === "expanded" && (
                            <span className="font-medium">{item.title}</span>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Create Campaign Button */}
          <div className="mt-8 px-1">
            <Button 
              onClick={() => setShowCreateCampaign(true)}
              className={cn(
                "w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]",
                state === "collapsed" ? "p-0" : ""
              )}
            >
              <Plus className={cn("h-5 w-5", state === "collapsed" && "mx-auto")} />
              {state === "expanded" && <span className="font-semibold">Create Campaign</span>}
            </Button>
          </div>
        </SidebarContent>

        <SidebarFooter className="border-t border-border/50 p-4">
          {/* User Profile */}
          <div className={cn(
            "flex items-center gap-3 mb-4",
            state === "collapsed" ? "justify-center" : ""
          )}>
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                AH
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">ad hoc gaming GmbH</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Business</Badge>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className={cn(
            "flex gap-2",
            state === "collapsed" ? "justify-center" : "justify-between"
          )}>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg hover:bg-accent/50"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {state === "expanded" && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                  className="h-9 w-9 rounded-lg hover:bg-accent/50"
                >
                  <Link to="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-accent/50">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-accent/50">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      {state === "collapsed" && <ModernSidebarToggle />}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Campaign Creation Modal */}
      <CampaignFormDialog
        open={showCreateCampaign}
        onOpenChange={setShowCreateCampaign}
      />
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
}
