
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ListsProvider } from "@/contexts/ListsContext";
import { AchievementsProvider } from "@/contexts/AchievementsContext";
import { ListsOverview } from "./pages/ListsOverview";
import { ListDetail } from "./pages/ListDetail";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ListsProvider>
          <AchievementsProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<ListsOverview />} />
                <Route path="/list/:listId" element={<ListDetail />} />
                <Route path="*" element={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Página não encontrada</p></div>} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </AchievementsProvider>
        </ListsProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
