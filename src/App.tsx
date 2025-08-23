
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import AuthPage from "./pages/AuthPage";

const queryClient = new QueryClient();

// Lazy load components to avoid loading issues
const ListsOverview = React.lazy(() => import("@/pages/ListsOverview").then(m => ({ default: m.ListsOverview })));
const ListDetail = React.lazy(() => import("@/pages/ListDetail").then(m => ({ default: m.ListDetail })));
const AchievementsPage = React.lazy(() => import("@/pages/AchievementsPage").then(m => ({ default: m.AchievementsPage })));
const StatisticsPage = React.lazy(() => import("@/pages/StatisticsPage").then(m => ({ default: m.StatisticsPage })));
const StickyNotesPage = React.lazy(() => import("@/pages/StickyNotesPage").then(m => ({ default: m.StickyNotesPage })));
const TemplatesPage = React.lazy(() => import("@/pages/TemplatesPage").then(m => ({ default: m.TemplatesPage })));
const NotFound = React.lazy(() => import("./pages/NotFound"));

// Loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #dcfce7 25%, #fce7f3 50%, #e0e7ff 75%, #fed7d7 100%)' }}>
    <div className="text-center">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando QuickList...</p>
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <OfflineProvider>
              <Suspense fallback={<LoadingFallback />}>
                <main>
                  <Routes>
                    <Route path="/" element={<ListsOverview />} />
                    <Route path="/list/:listId" element={<ListDetail />} />
                    <Route path="/achievements" element={<AchievementsPage />} />
                    <Route path="/statistics" element={<StatisticsPage />} />
                    <Route path="/sticky-notes" element={<StickyNotesPage />} />
                    <Route path="/templates" element={<TemplatesPage />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </Suspense>
              <Toaster />
              <Sonner />
            </OfflineProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
