
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { initMockData } from "@/lib/mock-data";

export default function DashboardIndexPage() {
  // Initialize mock data when the dashboard loads
  useEffect(() => {
    initMockData();
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </SidebarProvider>
  );
}
