
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListsProvider } from "@/contexts/ListsContext";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListsOverview } from "./pages/ListsOverview";
import { ListDetail } from "./pages/ListDetail";
import { StickyNotesPage } from "./pages/StickyNotesPage";
import AuthPage from "./pages/AuthPage";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { StyleEnforcer } from "./components/StyleEnforcer";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => console.log('SW registered'))
        .catch(() => console.log('SW registration failed'));
    }

    // Carregamento mais rápido e suave
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#B8956A'}}>
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white">Carregando QuickList...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="light">
          <TooltipProvider>
            <LanguageProvider>
              <AuthProvider>
                <ListsProvider>
                  <AchievementsProvider>
                    <Routes>
                      <Route path="/" element={<ListsOverview />} />
                      <Route path="/list/:listId" element={<ListDetail />} />
                      <Route path="/sticky-notes" element={<StickyNotesPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                       <Route path="*" element={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Página não encontrada</p></div>} />
                     </Routes>
                     <StyleEnforcer />
                     <Toaster />
                     <Sonner />
                  </AchievementsProvider>
                </ListsProvider>
              </AuthProvider>
            </LanguageProvider>
          </TooltipProvider>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
