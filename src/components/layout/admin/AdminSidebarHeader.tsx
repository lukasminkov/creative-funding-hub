
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SidebarHeader } from "@/components/ui/sidebar";
import { ShieldAlert } from "lucide-react";

interface AdminSidebarHeaderProps {
  sidebarState: 'expanded' | 'collapsed' | 'hidden';
  toggleButton: ReactNode;
}

export function AdminSidebarHeader({ sidebarState, toggleButton }: AdminSidebarHeaderProps) {
  return (
    <SidebarHeader className="relative">
      <div className={cn(
        "flex h-16 items-center px-4", 
        sidebarState === "expanded" ? "justify-start gap-2" : "justify-center"
      )}>
        <div className={cn(
          "flex h-10 w-10 min-w-10 items-center justify-center rounded-md bg-red-600 text-primary-foreground", 
          sidebarState === "collapsed" && "mx-auto"
        )}>
          <ShieldAlert className="h-6 w-6" />
        </div>
        {sidebarState === "expanded" && <span className="text-lg font-semibold">Admin Portal</span>}
      </div>
      {sidebarState === "expanded" && toggleButton}
    </SidebarHeader>
  );
}
