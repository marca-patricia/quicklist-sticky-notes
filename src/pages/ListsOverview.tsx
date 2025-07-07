
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
    <div className="min-h-screen bg-background pb-20">
      <div className="flex justify-between items-center p-4">
        <div className="flex gap-2">
          <LanguageSwitch />
          <ThemeToggle />
          <OfflineStatus />
        </div>
        <div className="flex gap-2">
          <ListTemplates />
          <ProductivityInsights />
          <AchievementsModal />
        </div>
      </div>
      <InstallPrompt />
      
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src={quicklistIcon} 
              alt="QuickList" 
              className="w-12 h-12" 
            />
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t('organizeDesc')}
          </p>
        </div>

        {/* Add List Form */}
        <div className="mb-8">
          <AddListForm />
        </div>

        {/* Lists Grid */}
        {lists.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
