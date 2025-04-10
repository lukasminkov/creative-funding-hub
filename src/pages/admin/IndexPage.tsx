
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminIndexPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </SidebarProvider>
  );
}
