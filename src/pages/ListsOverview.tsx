import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useAchievementNotifications } from '@/hooks/useAchievementNotifications';
import { Archive, ArchiveRestore, Filter, LogOut, User } from 'lucide-react';
import { FloatingAddButton } from '@/components/FloatingAddButton';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const { checkAchievements } = useAchievements();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { requestPermission, hasPermission } = useNotifications();
  const [showArchived, setShowArchived] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);
  
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
      // Notifications not enabled - silent in production
    }
  }, [hasPermission]);

  const [isLoading, setIsLoading] = React.useState(true);

  // Simulate loading for better UX
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <header className="sticky top-0 z-40 shadow-soft border-b border-border bg-gradient-header">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-2" role="group" aria-label="Configurações do aplicativo">
              <div className="text-primary-foreground"><LanguageSwitch /></div>
              <div className="text-primary-foreground"><ThemeToggle /></div>
              <div className="text-primary-foreground"><OfflineStatus /></div>
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                aria-label="Recarregar aplicativo QuickList"
              >
                <QuickListIcon className="w-8 h-8" aria-hidden="true" />
                <span className="text-xl font-bold text-primary-foreground">
                  {t('appTitle')}
                </span>
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2" role="group" aria-label="Ferramentas e estatísticas">
              <div className="text-primary-foreground"><ListTemplates /></div>
              <div className="text-primary-foreground"><ProductivityInsights /></div>
              <div className="text-primary-foreground"><AchievementsModal /></div>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-primary-foreground hover:text-primary-foreground/80 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
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
            <h1 className="text-4xl font-bold text-primary">
              {t('appTitle')}
            </h1>
          </button>
          <div className="hidden sm:block mb-6">
            <h1 className="text-5xl font-bold mb-4 text-primary">
              {t('appTitle')}
            </h1>
          </div>
          <p className="text-lg max-w-2xl mx-auto leading-relaxed text-muted-foreground">
            {t('organizeDesc')}
          </p>
        </div>

        {/* Add List Form - Now conditional */}
        {showAddForm && (
          <section className="max-w-2xl mx-auto mb-12" aria-label="Criar nova lista">
            {isLoading ? (
              <div className="flex gap-2">
                <div className="animate-pulse bg-muted rounded h-10 flex-1"></div>
                <div className="animate-pulse bg-muted rounded-full h-10 w-10"></div>
                <div className="animate-pulse bg-muted rounded h-10 w-24"></div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-soft p-6 border border-border">
                <AddListForm />
              </div>
            )}
          </section>
        )}

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
                    ({lists.filter(list => showArchived ? list.archived : !list.archived).length})
                  </span>
                </h2>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchived(!showArchived)}
                  className="flex items-center gap-2"
                >
                  {showArchived ? <ArchiveRestore className="w-4 h-4" /> : <Archive className="w-4 h-4" />}
                  {showArchived ? t('hideArchived') : t('showArchived')}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lists
                  .filter(list => showArchived ? list.archived : !list.archived)
                  .map((list) => (
                    <ListCard key={list.id} list={list} />
                  ))}
              </div>
              
              {lists.filter(list => showArchived ? list.archived : !list.archived).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    {showArchived ? 
                      <div>
                        <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">{t('noArchivedLists')}</p>
                      </div>
                      :
                      <EmptyState />
                    }
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
      
      {/* Floating Add Button */}
      <FloatingAddButton onClick={() => setShowAddForm(!showAddForm)} />
      
      {/* Spacer for mobile */}
      <div className="h-20"></div>
    </div>
  );
};
