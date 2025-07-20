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
import { QuickListIcon } from '@/components/QuickListIcon';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useNotifications } from '@/hooks/useNotifications';
import { useAchievementNotifications } from '@/hooks/useAchievementNotifications';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const { checkAchievements } = useAchievements();
  const { requestPermission, hasPermission } = useNotifications();
  
  // Activate achievement notifications
  useAchievementNotifications();

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

    // Calculate current streak (check if tasks were completed on consecutive days)
    let currentStreak = 0;
    const today_date = new Date();
    
    // Check if user completed tasks today first
    const todayString = today_date.toDateString();
    const hasTasksToday = completedItems.some(item => 
      new Date(item.createdAt).toDateString() === todayString
    );
    
    if (hasTasksToday) {
      currentStreak = 1;
      
      // Check previous days
      for (let i = 1; i < 30; i++) {
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

  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading for better UX
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#F8F8FC' }}>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 shadow-soft border-b border-white/20" style={{ background: 'linear-gradient(135deg, #FFF2AC, #F9C7C4)' }}>
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-2" role="group" aria-label="Configurações do aplicativo">
              <div className="text-gray-700"><LanguageSwitch /></div>
              <div className="text-gray-700"><ThemeToggle /></div>
              <div className="text-gray-700"><OfflineStatus /></div>
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                aria-label="Recarregar aplicativo QuickList"
              >
                <QuickListIcon className="w-8 h-8" aria-hidden="true" />
                <span className="text-xl font-bold" style={{ color: '#B674ED' }}>
                  {t('appTitle')}
                </span>
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2" role="group" aria-label="Ferramentas e estatísticas">
              <div className="text-gray-700"><ListTemplates /></div>
              <div className="text-gray-700"><ProductivityInsights /></div>
              <div className="text-gray-700"><AchievementsModal /></div>
            </div>
          </div>
        </div>
      </header>

      <InstallPrompt />
      
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-4 mb-6 sm:hidden hover:opacity-80 transition-opacity"
            aria-label="Recarregar aplicativo QuickList"
          >
            <QuickListIcon className="w-16 h-16 drop-shadow-lg" aria-hidden="true" />
            <h1 className="text-4xl font-bold" style={{ color: '#B674ED' }}>
              {t('appTitle')}
            </h1>
          </button>
          <div className="hidden sm:block mb-6">
            <h1 className="text-5xl font-bold mb-4" style={{ color: '#B674ED' }}>
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            {t('organizeDesc')}
          </p>
        </div>

        {/* Add List Form */}
        <section className="max-w-2xl mx-auto mb-12" aria-label="Criar nova lista">
          {isLoading ? (
            <div className="flex gap-2">
              <div className="animate-pulse bg-muted rounded h-10 flex-1"></div>
              <div className="animate-pulse bg-muted rounded-full h-10 w-10"></div>
              <div className="animate-pulse bg-muted rounded h-10 w-24"></div>
            </div>
          ) : (
            <AddListForm />
          )}
        </section>

        {/* Lists Section */}
        <section aria-label={lists.length > 0 ? `${lists.length} listas criadas` : "Nenhuma lista criada"}>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg p-4 shadow-soft border border-gray-200 bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div className="animate-pulse bg-muted rounded h-6 w-32"></div>
                    <div className="flex items-center gap-2">
                      <div className="animate-pulse bg-muted rounded-full h-8 w-8"></div>
                      <div className="animate-pulse bg-muted rounded-full h-8 w-8"></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <div className="animate-pulse bg-muted rounded h-4 w-20"></div>
                      <div className="animate-pulse bg-muted rounded h-4 w-12"></div>
                    </div>
                    <div className="animate-pulse bg-muted rounded-full h-2 w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : lists.length === 0 ? (
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
