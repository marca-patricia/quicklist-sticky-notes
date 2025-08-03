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
    // FORÇA FUNDO DE CORTIÇA IMEDIATAMENTE
    const forceBackground = () => {
      const body = document.body;
      const html = document.documentElement;
      const root = document.getElementById('root');
      
      const styles = {
        'background-color': '#B8956A',
        'background-image': 'url("/lovable-uploads/b28063b1-b719-4516-9218-fe85c0f556c0.png")',
        'background-size': 'cover',
        'background-attachment': window.innerWidth <= 768 ? 'scroll' : 'fixed',
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'min-height': '100vh'
      };
      
      Object.entries(styles).forEach(([prop, value]) => {
        body.style.setProperty(prop, value, 'important');
        html.style.setProperty(prop, value, 'important');
      });
      
      if (root) {
        root.style.setProperty('background', 'transparent', 'important');
        root.style.setProperty('min-height', '100vh', 'important');
      }
    };
    
    forceBackground();
    
    // Registro do Service Worker otimizado
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // Loading otimizado - mais rápido
    const timer = setTimeout(() => {
      setIsLoading(false);
      forceBackground(); // Força novamente após carregar
    }, 200);
    
    // Força background periodicamente
    const interval = setInterval(forceBackground, 1000);
    
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundColor: '#B8956A',
        backgroundImage: 'url("/lovable-uploads/b28063b1-b719-4516-9218-fe85c0f556c0.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-amber-900 font-medium">QuickList</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#B8956A',
      backgroundImage: 'url("/lovable-uploads/b28063b1-b719-4516-9218-fe85c0f556c0.png")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      minHeight: '100vh'
    }}>
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
                      <div className="min-h-screen flex items-center justify-center">
                        <p className="text-amber-900">Página não encontrada</p>
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
    </div>
  );
};

export default App;