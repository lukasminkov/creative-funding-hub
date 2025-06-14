
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, Home, MessageSquare, Compass, User, 
  LogOut, Moon, Sun, Menu, X, 
  Bell, Settings, Wrench, Building2
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

interface ProfileDashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { title: "Home", path: "/dashboard/profile", icon: Home },
  { title: "Workspace", path: "/dashboard/profile/workspace", icon: MessageSquare },
  { title: "Explore", path: "/dashboard/profile/explore", icon: Compass },
  { title: "Tools", path: "/dashboard/profile/tools", icon: Wrench },
  { title: "Profile", path: "/dashboard/profile/profile", icon: User }
];

const DashboardToggle = () => {
  const navigate = useNavigate();
  
  const switchToBusiness = () => {
    localStorage.setItem('selectedDashboardType', 'business');
    navigate('/dashboard/business');
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={switchToBusiness}
      className="h-8 px-3 bg-gray-700/50 hover:bg-gray-600 text-white text-xs font-medium border border-gray-600"
    >
      <Building2 className="h-3 w-3 mr-2" />
      Switch to Business
    </Button>
  );
};

const ModernSidebarToggle = () => {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar}
      className="h-9 w-9 fixed top-4 left-4 z-50 bg-gray-800/90 backdrop-blur-md border border-gray-700 shadow-lg hover:bg-gray-700 text-white"
    >
      {state === "expanded" ? (
        <X className="h-4 w-4" />
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  );
};

function ProfileDashboardLayoutContent({ children }: ProfileDashboardLayoutProps) {
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
    <div className="flex h-screen w-full bg-gray-900">
      <Sidebar 
        side="left" 
        variant="sidebar" 
        collapsible="icon" 
        className="border-none bg-gray-800/95 backdrop-blur-xl shadow-2xl border-r border-gray-700"
      >
        <SidebarHeader className="border-b border-gray-700 pb-4">
          <div className={cn(
            "flex items-center px-4 py-6",
            state === "expanded" ? "justify-between" : "justify-center"
          )}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
                <BarChart3 className="h-6 w-6" />
              </div>
              {state === "expanded" && (
                <span className="text-xl font-bold text-white">
                  Payper
                </span>
              )}
            </div>
            {state === "expanded" && <DashboardToggle />}
          </div>
        </SidebarHeader>

        <SidebarContent className="px-3 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || 
                    (item.path !== "/dashboard/profile" && location.pathname.startsWith(item.path));
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        tooltip={item.title}
                        asChild
                        isActive={isActive}
                        className={cn(
                          "h-11 rounded-xl transition-all duration-200 group",
                          isActive 
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg" 
                            : "hover:bg-gray-700/50 text-gray-300 hover:text-white"
                        )}
                      >
                        <Link to={item.path} className="flex items-center gap-3 px-4">
                          <item.icon className="h-5 w-5" />
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
        </SidebarContent>

        <SidebarFooter className="border-t border-gray-700 p-4">
          <div className={cn(
            "flex items-center gap-3 mb-4",
            state === "collapsed" ? "justify-center" : ""
          )}>
            <Avatar className="h-9 w-9 ring-2 ring-green-500/30">
              <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
              <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white text-sm">
                CR
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Creator Profile</p>
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-300">Creator</Badge>
              </div>
            )}
          </div>

          <div className={cn(
            "flex gap-2",
            state === "collapsed" ? "justify-center" : "justify-between"
          )}>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-8 w-8 rounded-lg hover:bg-gray-700 text-gray-300"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            {state === "expanded" && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  asChild
                  className="h-8 w-8 rounded-lg hover:bg-gray-700 text-gray-300"
                >
                  <Link to="/dashboard/profile/settings">
                    <Settings className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-700 text-gray-300">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-gray-700 text-gray-300">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>

      {state === "collapsed" && <ModernSidebarToggle />}

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto bg-gray-900">
          <div className="fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProfileDashboardLayout({ children }: ProfileDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <ProfileDashboardLayoutContent>{children}</ProfileDashboardLayoutContent>
    </SidebarProvider>
  );
}
