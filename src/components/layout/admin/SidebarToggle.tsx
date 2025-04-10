
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarToggle() {
  const { toggleSidebar, state } = useSidebar();
  
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleSidebar} 
      className={cn(
        "h-8 w-8 z-10", 
        state === "expanded" 
          ? "absolute top-4 right-3" // Inside when expanded
          : "fixed left-[calc(var(--sidebar-width-icon)+0.25rem)] top-5" // Moved down to align with logo
      )}
    >
      {state === "expanded" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
