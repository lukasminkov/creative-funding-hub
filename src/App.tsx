
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import DashboardSelector from "@/pages/dashboard/DashboardSelector";

// Business Dashboard pages
import BusinessDashboardLayout from "@/components/layout/BusinessDashboardLayout";
import BusinessHome from "@/pages/dashboard/BusinessHome";
import CampaignsPage from "@/pages/dashboard/CampaignsPage";
import CampaignDetailPage from "@/pages/dashboard/CampaignDetailPage";
import CampaignChatPage from "@/pages/dashboard/CampaignChatPage";
import ToolsPage from "@/pages/dashboard/ToolsPage";
import FinancesPage from "@/pages/dashboard/FinancesPage";
import SettingsPage from "@/pages/dashboard/SettingsPage";

// Profile Dashboard pages
import ProfileDashboardLayout from "@/components/layout/ProfileDashboardLayout";
import ProfileHome from "@/pages/dashboard/ProfileHome";
import ExplorePage from "@/pages/dashboard/ExplorePage";
import CreatorProfilePage from "@/pages/dashboard/CreatorProfilePage";
import MessagesPage from "@/pages/dashboard/MessagesPage";

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

            {/* Dashboard Selector */}
            <Route path="/dashboard" element={<DashboardSelector />} />

            {/* Business Dashboard Routes */}
            <Route path="/dashboard/business" element={<BusinessDashboardLayout><Outlet /></BusinessDashboardLayout>}>
              <Route index element={<BusinessHome />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
              <Route path="campaigns/:campaignId/chat" element={<CampaignChatPage />} />
              <Route path="communities" element={<div className="p-6 text-white">Communities - Coming Soon</div>} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="finance" element={<FinancesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Profile Dashboard Routes */}
            <Route path="/dashboard/profile" element={<ProfileDashboardLayout><Outlet /></ProfileDashboardLayout>}>
              <Route index element={<ProfileHome />} />
              <Route path="workspace" element={<div className="p-6 text-white">Workspace - Coming Soon</div>} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="profile" element={<CreatorProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="messages" element={<MessagesPage />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
