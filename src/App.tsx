
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./providers/theme-provider";

// Dashboard routes
import DashboardIndexPage from "./pages/dashboard/IndexPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ExplorePage from "./pages/dashboard/ExplorePage";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import CampaignDetailPage from "./pages/dashboard/CampaignDetailPage";
import CampaignChatPage from "./pages/dashboard/CampaignChatPage";
import CreatorsPage from "./pages/dashboard/CreatorsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import PaymentsPage from "./pages/dashboard/PaymentsPage";

// Admin routes
import AdminIndexPage from "./pages/admin/IndexPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsersPage from "./pages/admin/UsersPage";
import AdminBrandsPage from "./pages/admin/BrandsPage";
import AdminCampaignsPage from "./pages/admin/CampaignsPage";
import AdminSettingsPage from "./pages/admin/SettingsPage";
import AdminPaymentsPage from "./pages/admin/PaymentsPage";
import AdminNotificationsPage from "./pages/admin/NotificationsPage";
import AdminMessagesPage from "./pages/admin/MessagesPage";
import AdminAnalyticsPage from "./pages/admin/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="creator-crm-theme">
      <TooltipProvider>
        <div className="min-h-screen transition-colors bg-background text-foreground">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<DashboardIndexPage />}>
                <Route index element={<DashboardHome />} />
                <Route path="explore" element={<ExplorePage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/:id" element={<CampaignDetailPage />} />
                <Route path="campaigns/:id/chat" element={<CampaignChatPage />} />
                <Route path="creators" element={<CreatorsPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="messages" element={<MessagesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminIndexPage />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="brands" element={<AdminBrandsPage />} />
                <Route path="campaigns" element={<AdminCampaignsPage />} />
                <Route path="payments" element={<AdminPaymentsPage />} />
                <Route path="notifications" element={<AdminNotificationsPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Redirect old dashboard to new dashboard */}
              <Route path="/dashboard/campaigns" element={<Navigate to="/dashboard/campaigns" replace />} />
              
              {/* Redirects for the now unused pages */}
              <Route path="/dashboard/campaigns/create" element={<Navigate to="/dashboard/campaigns" replace />} />
              <Route path="/dashboard/campaigns/:id/edit" element={<Navigate to="/dashboard/campaigns/:id" replace />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
