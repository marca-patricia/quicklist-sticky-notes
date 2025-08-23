
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListsProvider } from "@/contexts/ListsContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { ListsOverview } from "./pages/ListsOverview";
import { ListDetail } from "./pages/ListDetail";
import { LoadingSpinner } from "./components/LoadingSpinner";

const queryClient = new QueryClient();

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
          <TooltipProvider>
            <OfflineProvider>
              <LanguageProvider>
                <ListsProvider>
                  <AppContent />
                </ListsProvider>
              </LanguageProvider>
            </OfflineProvider>
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const AppContent = () => {
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
    <>
      <div role="application" aria-label="QuickList - Gerenciador de Tarefas">
        <main id="main-content">
          <Routes>
            <Route path="/" element={<ListsOverview />} />
            <Route path="/list/:listId" element={<ListDetail />} />
            <Route path="*" element={
              <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center" role="alert" aria-live="assertive">
                  <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
                  <p className="text-muted-foreground">A página que você procura não existe.</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </>
  );
};

export default App;
