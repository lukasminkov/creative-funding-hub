
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { toast } from "sonner";

export default function AdminIndexPage() {
  useEffect(() => {
    // For testing purposes, show a notification that the admin is logged in
    toast.info("Admin session activated", {
      description: "You now have access to all admin features.",
      duration: 5000,
    });
  }, []);

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    </SidebarProvider>
  );
}
