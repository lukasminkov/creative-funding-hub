
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import ExplorePage from "@/pages/dashboard/ExplorePage";
import CampaignsPage from "@/pages/dashboard/CampaignsPage";
import CommunitiesPage from "@/pages/dashboard/CommunitiesPage";
import MessagesPage from "@/pages/dashboard/MessagesPage";
import FinancesPage from "@/pages/dashboard/FinancesPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";
import CampaignDetailPage from "@/pages/dashboard/CampaignDetailPage";
import CreatorProfilePage from "@/pages/dashboard/CreatorProfilePage";
import CampaignChatPage from "@/pages/dashboard/CampaignChatPage";
import AdminIndexPage from "@/pages/admin/IndexPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersPage from "@/pages/admin/UsersPage";
import BrandsPage from "@/pages/admin/BrandsPage";
import CampaignsPageAdmin from "@/pages/admin/CampaignsPage";
import PaymentsPage from "@/pages/admin/PaymentsPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import MessagesPageAdmin from "@/pages/admin/MessagesPage";
import NotificationsPage from "@/pages/admin/NotificationsPage";
import SettingsPageAdmin from "@/pages/admin/SettingsPage";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard-old" element={<Dashboard />} />
          
          {/* Dashboard Routes - Remove nested SidebarProvider since DashboardLayout already has one */}
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/explore" element={<DashboardLayout><ExplorePage /></DashboardLayout>} />
          <Route path="/dashboard/campaigns" element={<DashboardLayout><CampaignsPage /></DashboardLayout>} />
          <Route path="/dashboard/communities" element={<DashboardLayout><CommunitiesPage /></DashboardLayout>} />
          <Route path="/dashboard/finances" element={<DashboardLayout><FinancesPage /></DashboardLayout>} />
          <Route path="/dashboard/messages" element={<DashboardLayout><MessagesPage /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="/dashboard/campaigns/:id" element={<DashboardLayout><CampaignDetailPage /></DashboardLayout>} />
          <Route path="/dashboard/creators/:id" element={<DashboardLayout><CreatorProfilePage /></DashboardLayout>} />
          <Route path="/dashboard/campaigns/:id/chat" element={<DashboardLayout><CampaignChatPage /></DashboardLayout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminIndexPage />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="campaigns" element={<CampaignsPageAdmin />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="messages" element={<MessagesPageAdmin />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<SettingsPageAdmin />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </ThemeProvider>
  );
}

export default App;
