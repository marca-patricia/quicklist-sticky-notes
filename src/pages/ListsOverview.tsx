
import React from 'react';
import { AddListForm } from '@/components/AddListForm';
import { ListCard } from '@/components/ListCard';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ThemeToggle } from '@/components/ThemeToggle';
import { EmptyState } from '@/components/EmptyState';
import { InstallPrompt } from '@/components/InstallPrompt';
import { AchievementsModal } from '@/components/AchievementsModal';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { ListTemplates } from '@/components/ListTemplates';
import { OfflineStatus } from '@/components/OfflineStatus';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useNotifications } from '@/hooks/useNotifications';
import quicklistIcon from '@/assets/quicklist-icon.png';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const { checkAchievements } = useAchievements();
  const { requestPermission, hasPermission } = useNotifications();

  // Calculate user stats for achievements
  React.useEffect(() => {
    const allItems = lists.flatMap(list => list.items);
    const completedItems = allItems.filter(item => item.completed);
    const categoriesUsed = new Set(lists.flatMap(list => 
      (list.categories || []).map(cat => cat.id)
    )).size;
    
    const today = new Date().toDateString();
    const tasksCompletedToday = completedItems.filter(item => 
      item.createdAt.toDateString() === today
    ).length;

    // Calculate current streak
    let currentStreak = 0;
    const today_date = new Date();
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today_date);
      checkDate.setDate(today_date.getDate() - i);
      
      const hasCompletedTask = completedItems.some(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasCompletedTask) {
        currentStreak++;
      } else {
        break;
      }
    }

    checkAchievements({
      totalTasks: allItems.length,
      completedTasks: completedItems.length,
      currentStreak,
      categoriesUsed,
      tasksCompletedToday,
      listsCreated: lists.length
    });
  }, [lists, checkAchievements]);

  // Request notification permission on first load
  React.useEffect(() => {
    if (!hasPermission) {
      // Don't auto-request, let user decide
      console.log('Notifications not enabled. User can enable in settings.');
    }
  }, [hasPermission]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg bg-background/80 border-b border-border/40 shadow-soft">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <ThemeToggle />
              <OfflineStatus />
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <img 
                src={quicklistIcon} 
                alt="QuickList" 
                className="w-8 h-8" 
              />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('appTitle')}
              </span>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <ListTemplates />
              <ProductivityInsights />
              <AchievementsModal />
            </div>
          </div>
        </div>
      </header>

      <InstallPrompt />
      
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6 sm:hidden">
            <img 
              src={quicklistIcon} 
              alt="QuickList" 
              className="w-16 h-16 drop-shadow-lg" 
            />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
          </div>
          <div className="hidden sm:block mb-6">
            <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('organizeDesc')}
          </p>
        </div>

        {/* Add List Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <AddListForm />
        </div>

        {/* Lists Section */}
        <section>
          {lists.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  {t('allLists')} 
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({lists.length})
                  </span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists.map((list) => (
                  <ListCard key={list.id} list={list} />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
      
      {/* Spacer for mobile */}
      <div className="h-20"></div>
    </div>
  );
};
