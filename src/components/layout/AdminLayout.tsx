
import { useEffect, useState } from "react";
import { 
  BarChart3, Users, Building2, Layers, Settings, 
  TrendingUp, CreditCard, Bell, MessageSquare, ShieldAlert
} from "lucide-react";
import { 
  Sidebar, SidebarContent, useSidebar 
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ViewAsButton } from "@/components/admin/ViewAsButton";
import { AdminSidebarMenu } from "./admin/AdminSidebarMenu";
import { AdminSidebarHeader } from "./admin/AdminSidebarHeader";
import { AdminSidebarFooter } from "./admin/AdminSidebarFooter";
import { SidebarToggle } from "./admin/SidebarToggle";

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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);
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
        <AdminSidebarHeader 
          sidebarState={state} 
          toggleButton={<SidebarToggle />} 
        />
        
        <SidebarContent className="flex flex-col h-[calc(100%-11rem)]">
          <ScrollArea className="flex-1">
            <AdminSidebarMenu items={menuItems} sidebarState={state} />
          </ScrollArea>
          
          {state === "expanded" && (
            <div className="px-4 mb-4 mt-auto">
              <ViewAsButton />
            </div>
          )}
        </SidebarContent>
        
        <AdminSidebarFooter sidebarState={state} />
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
