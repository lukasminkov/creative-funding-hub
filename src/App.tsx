import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Dashboard pages
import DashboardSelector from "@/pages/dashboard/DashboardSelector";
import BusinessDashboardLayout from "@/components/layout/BusinessDashboardLayout";
import ProfileDashboardLayout from "@/components/layout/ProfileDashboardLayout";

// Business Dashboard Pages
import BusinessHome from "@/pages/dashboard/BusinessHome";
import CampaignsPage from "@/pages/dashboard/CampaignsPage";
import CampaignDetailPage from "@/pages/dashboard/CampaignDetailPage";
import CampaignChatPage from "@/pages/dashboard/CampaignChatPage";
import ToolsPage from "@/pages/dashboard/ToolsPage";
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage";
import PaymentsPage from "@/pages/dashboard/PaymentsPage";
import FinancesPage from "@/pages/dashboard/FinancesPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

// Profile Dashboard Pages
import ProfileHome from "@/pages/dashboard/ProfileHome";
import ExplorePage from "@/pages/dashboard/ExplorePage";
import CreatorProfilePage from "@/pages/dashboard/CreatorProfilePage";
import MessagesPage from "@/pages/dashboard/MessagesPage";

// Legacy Dashboard (keep for now)
import Dashboard from "@/pages/Dashboard";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";

// Admin pages (removing as requested, but keeping imports for now)
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

            {/* New Dashboard Structure */}
            <Route path="/dashboard" element={<DashboardSelector />} />
            
            {/* Business Dashboard Routes */}
            <Route path="/dashboard/business" element={<BusinessDashboardLayout><Outlet /></BusinessDashboardLayout>}>
              <Route index element={<BusinessHome />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
              <Route path="campaigns/:campaignId/chat" element={<CampaignChatPage />} />
              <Route path="communities" element={<div className="p-6"><h1 className="text-2xl font-bold">Communities</h1><p className="text-muted-foreground">Manage your creator communities here.</p></div>} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="finances" element={<FinancesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Profile Dashboard Routes */}
            <Route path="/dashboard/profile" element={<ProfileDashboardLayout><Outlet /></ProfileDashboardLayout>}>
              <Route index element={<ProfileHome />} />
              <Route path="workspace" element={<div className="p-6"><h1 className="text-2xl font-bold">Workspace</h1><p className="text-muted-foreground">Your campaigns and communities.</p></div>} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Profile Settings</h1><p className="text-muted-foreground">Manage your creator profile.</p></div>} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="creators/:creatorId" element={<CreatorProfilePage />} />
            </Route>

            {/* Legacy Dashboard Routes (keep for backward compatibility) */}
            <Route path="/dashboard-legacy" element={<DashboardLayout><Outlet /></DashboardLayout>}>
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
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
