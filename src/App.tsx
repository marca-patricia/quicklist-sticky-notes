import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ListsProvider } from "@/contexts/ListsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { ListsOverview } from "@/pages/ListsOverview";
import { ListDetail } from "@/pages/ListDetail";
import { AchievementsPage } from "@/pages/AchievementsPage";
import { StatisticsPage } from "@/pages/StatisticsPage";
import { StickyNotesPage } from "@/pages/StickyNotesPage";
import { TemplatesPage } from "@/pages/TemplatesPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
            disableTransitionOnChange
          >
            <LanguageProvider>
              <AuthProvider>
                <OfflineProvider>
                  <ListsProvider>
                    <AchievementsProvider>
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
                      <Toaster />
                      <Sonner />
                    </AchievementsProvider>
                  </ListsProvider>
                </OfflineProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
};

export default App;