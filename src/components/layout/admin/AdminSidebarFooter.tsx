
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarFooter } from "@/components/ui/sidebar";
import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";

interface AdminSidebarFooterProps {
  sidebarState: 'expanded' | 'collapsed' | 'hidden';
}

export function AdminSidebarFooter({ sidebarState }: AdminSidebarFooterProps) {
  const { theme, setTheme } = useTheme();
  
  return (
    <SidebarFooter className="p-2 space-y-2 border-t border-border/10">
      <div className="flex items-center justify-between w-full px-2">
        <div className={cn(
          "flex items-center gap-3", 
          sidebarState === "collapsed" ? "justify-center w-full" : ""
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
        sidebarState === "collapsed" ? "justify-center" : "justify-between"
      )}>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
          className="h-8 w-8 rounded-full"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        {sidebarState === "expanded" && (
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
  );
}
