import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListsProvider } from "@/contexts/ListsContext";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ListsOverview } from "./pages/ListsOverview";
import { ListDetail } from "./pages/ListDetail";
import { StickyNotesPage } from "./pages/StickyNotesPage";
import AuthPage from "./pages/AuthPage";
import { LoadingSpinner } from "./components/LoadingSpinner";

// QueryClient otimizado
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Registro do Service Worker otimizado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Loading otimizado - mais rápido
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-moss-primary">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-white font-medium">QuickList</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <ListsProvider>
              <AchievementsProvider>
                <Routes>
                  <Route path="/" element={<ListsOverview />} />
                  <Route path="/list/:listId" element={<ListDetail />} />
                  <Route path="/sticky-notes" element={<StickyNotesPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="*" element={
                    <div className="min-h-screen bg-moss-primary flex items-center justify-center">
                      <p className="text-white">Página não encontrada</p>
                    </div>
                  } />
                </Routes>
                <Toaster />
              </AchievementsProvider>
            </ListsProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;