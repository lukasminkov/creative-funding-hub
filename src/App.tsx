
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import CampaignsPage from "@/pages/dashboard/CampaignsPage";
import CampaignDetailPage from "@/pages/dashboard/CampaignDetailPage";
import CampaignChatPage from "@/pages/dashboard/CampaignChatPage";
import CreatorProfilePage from "@/pages/dashboard/CreatorProfilePage";
import ExplorePage from "@/pages/dashboard/ExplorePage";
import ToolsPage from "@/pages/dashboard/ToolsPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import MessagesPage from "@/pages/dashboard/MessagesPage";
import PaymentsPage from "@/pages/dashboard/PaymentsPage";
import FinancesPage from "@/pages/dashboard/FinancesPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

// Admin pages
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminIndexPage from "@/pages/admin/IndexPage";
import AdminCampaignsPage from "@/pages/admin/CampaignsPage";
import UsersPage from "@/pages/admin/UsersPage";
import BrandsPage from "@/pages/admin/BrandsPage";
import AdminAnalyticsPage from "@/pages/admin/AnalyticsPage";
import AdminMessagesPage from "@/pages/admin/MessagesPage";
import AdminPaymentsPage from "@/pages/admin/PaymentsPage";
import AdminNotificationsPage from "@/pages/admin/NotificationsPage";
import AdminSettingsPage from "@/pages/admin/SettingsPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-react-theme">
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard-test" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout><Outlet /></DashboardLayout>}>
              <Route index element={<DashboardHome />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
              <Route path="campaigns/:campaignId/chat" element={<CampaignChatPage />} />
              <Route path="creators/:creatorId" element={<CreatorProfilePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="finances" element={<FinancesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout><Outlet /></AdminLayout>}>
              <Route index element={<AdminIndexPage />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="campaigns" element={<AdminCampaignsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="brands" element={<BrandsPage />} />
              <Route path="analytics" element={<AdminAnalyticsPage />} />
              <Route path="messages" element={<AdminMessagesPage />} />
              <Route path="payments" element={<AdminPaymentsPage />} />
              <Route path="notifications" element={<AdminNotificationsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
