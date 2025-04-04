
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardIndexPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </SidebarProvider>
  );
}
