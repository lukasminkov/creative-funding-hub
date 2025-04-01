
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function DashboardIndexPage() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
