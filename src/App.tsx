
import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { OfflineProvider } from '@/contexts/OfflineContext';
import { ListsProvider } from '@/contexts/ListsContext';
import { AchievementsProvider } from '@/contexts/AchievementsContext';
import { useAchievementNotifications } from '@/hooks/useAchievementNotifications';
import Index from '@/pages/Index';
import { ListsOverview } from '@/pages/ListsOverview';
import { StickyNotesPage } from '@/pages/StickyNotesPage';
import { AchievementsPage } from '@/pages/AchievementsPage';

// Inner component to use hooks that require providers
function AppInner() {
  useAchievementNotifications();
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/lists" element={<ListsOverview />} />
        <Route path="/sticky-notes" element={<StickyNotesPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Routes>
    </div>
  );
}

function App() {
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  }), []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <OfflineProvider>
          <AchievementsProvider>
            <ListsProvider>
              <Router>
                <AppInner />
                <Toaster />
              </Router>
            </ListsProvider>
          </AchievementsProvider>
        </OfflineProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
