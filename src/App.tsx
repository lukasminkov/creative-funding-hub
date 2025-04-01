
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Dashboard routes
import DashboardIndexPage from "./pages/dashboard/IndexPage";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ExplorePage from "./pages/dashboard/ExplorePage";
import CampaignsPage from "./pages/dashboard/CampaignsPage";
import CampaignDetailPage from "./pages/dashboard/CampaignDetailPage";
import CampaignCreatePage from "./pages/dashboard/CampaignCreatePage";
import CampaignEditPage from "./pages/dashboard/CampaignEditPage";
import CampaignChatPage from "./pages/dashboard/CampaignChatPage";
import CreatorsPage from "./pages/dashboard/CreatorsPage";
import MessagesPage from "./pages/dashboard/MessagesPage";
import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
            <Route path="campaigns/create" element={<CampaignCreatePage />} />
            <Route path="campaigns/:id" element={<CampaignDetailPage />} />
            <Route path="campaigns/:id/edit" element={<CampaignEditPage />} />
            <Route path="campaigns/:id/chat" element={<CampaignChatPage />} />
            <Route path="creators" element={<CreatorsPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Redirect old dashboard to new dashboard */}
          <Route path="/dashboard/campaigns" element={<Navigate to="/dashboard/campaigns" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
