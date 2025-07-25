
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
import AuthPage from "./pages/AuthPage";
import { LoadingSpinner } from "./components/LoadingSpinner";

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

    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando QuickList...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <LanguageProvider>
              <AuthProvider>
                <ListsProvider>
                  <AchievementsProvider>
                    <Routes>
                      <Route path="/" element={<ListsOverview />} />
                      <Route path="/list/:listId" element={<ListDetail />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="*" element={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Página não encontrada</p></div>} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                  </AchievementsProvider>
                </ListsProvider>
              </AuthProvider>
            </LanguageProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
