
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "@/components/ui/sidebar";

interface MenuItemProps {
  path: string;
  title: string;
  icon: React.ElementType;
}

interface AdminSidebarMenuProps {
  items: MenuItemProps[];
  sidebarState: 'expanded' | 'collapsed' | 'hidden';
}

export function AdminSidebarMenu({ items, sidebarState }: AdminSidebarMenuProps) {
  const location = useLocation();
  
  return (
    <SidebarMenu className="pt-4 px-[16px]">
      {items.map(item => {
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
                  sidebarState === "collapsed" ? "justify-center" : "justify-start"
                )}
              >
                <item.icon className={cn(
                  "h-7 w-7", 
                  sidebarState === "collapsed" ? "mx-auto" : "ml-3 mr-3"
                )} />
                <span className={cn(sidebarState === "collapsed" ? "sr-only" : "ml-2")}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
