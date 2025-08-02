import React, { useState } from 'react';
import { AddListForm } from '@/components/AddListForm';
import { ListCard } from '@/components/ListCard';
import { LanguageSwitch } from '@/components/LanguageSwitch';

import { EmptyState } from '@/components/EmptyState';
import { InstallPrompt } from '@/components/InstallPrompt';
import { AchievementsModal } from '@/components/AchievementsModal';
import { ProductivityInsights } from '@/components/ProductivityInsights';
import { ListTemplates } from '@/components/ListTemplates';
import { OfflineStatus } from '@/components/OfflineStatus';
import { QuickListIcon } from '@/components/QuickListIcon';
import { QuickListLogo } from '@/components/QuickListLogo';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/useNotifications';
import { useAchievementNotifications } from '@/hooks/useAchievementNotifications';
import { Archive, ArchiveRestore, Filter, LogOut, User, StickyNote } from 'lucide-react';
import { FloatingCreateButton } from '@/components/FloatingCreateButton';
import { SearchInput } from '@/components/SearchInput';
import { GridViewToggle } from '@/components/GridViewToggle';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const { checkAchievements } = useAchievements();
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { requestPermission, hasPermission } = useNotifications();
  const [showArchived, setShowArchived] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGridView, setIsGridView] = useState(false);

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
      {/* Enhanced Header - Fixed on all devices */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-lg border-b border-border backdrop-blur-md bg-gradient-header"
              style={{ position: 'fixed' }}>
        <div className="container max-w-6xl mx-auto px-2 py-2 min-h-[56px]">
          <div className="flex justify-between items-center">
            {/* Left side controls */}
            <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap" role="group" aria-label="Configurações do aplicativo">
              <LanguageSwitch />
              <OfflineStatus />
            </div>
            
            {/* Center - App Brand */}
            <div className="hidden sm:flex items-center gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="hover:opacity-80 transition-opacity"
                aria-label="Recarregar aplicativo QuickList"
              >
                <QuickListLogo size="md" showText={true} className="text-foreground" />
              </button>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-1 overflow-x-auto" role="group" aria-label="Ferramentas e estatísticas">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/sticky-notes')}
                className="text-foreground hover:text-foreground/80 flex items-center gap-1 shrink-0"
                title="Buscar Notas"
              >
                <StickyNote className="w-4 h-4" />
                <span className="hidden sm:inline text-xs">Notas</span>
              </Button>
              <ListTemplates />
              <ProductivityInsights />
              <AchievementsModal />
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-foreground hover:text-foreground/80 flex items-center gap-1 shrink-0"
                  title="Sair"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Sair</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <InstallPrompt />
      
      {/* Spacer for fixed header */}
      <div className="h-20"></div>
      
      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-4 mb-6 sm:hidden hover:opacity-80 transition-opacity"
            aria-label="Recarregar aplicativo QuickList"
          >
            <QuickListLogo size="xl" showText={true} className="text-foreground" />
          </button>
          <div className="hidden sm:block mb-6 flex justify-center">
            <QuickListLogo size="xl" showText={true} className="text-foreground" />
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

        {/* Search and Filter Section */}
        {lists.length > 0 && (
          <section className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder={t('searchLists')}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <GridViewToggle
                  isGridView={isGridView}
                  onToggle={setIsGridView}
                />
                
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
            </div>
          </section>
        )}

        {/* Lists Section */}
        <section aria-label={lists.length > 0 ? `${lists.length} listas criadas` : "Nenhuma lista criada"}>
          {isLoading ? (
            <div className={`grid gap-6 ${
              isGridView 
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
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
              {/* Filter and display lists */}
              {(() => {
                const filteredLists = lists
                  .filter(list => showArchived ? list.archived : !list.archived)
                  .filter(list => 
                    searchTerm === '' || 
                    list.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    list.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    list.items.some(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
                  );

                if (filteredLists.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground">
                        {searchTerm ? (
                          <div>
                            <p className="text-lg">{t('noResultsFound')}</p>
                            <p className="text-sm mt-2">Tente uma busca diferente</p>
                          </div>
                        ) : showArchived ? (
                          <div>
                            <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg">{t('noArchivedLists')}</p>
                          </div>
                        ) : (
                          <EmptyState />
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {searchTerm ? `${t('searchLists')} "${searchTerm}"` : t('allLists')}
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          ({filteredLists.length})
                        </span>
                      </h2>
                    </div>

                    <div className={`grid gap-6 ${
                      isGridView 
                        ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
                        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                      {filteredLists.map((list) => (
                        <ListCard 
                          key={list.id} 
                          list={list} 
                          isGridView={isGridView}
                        />
                      ))}
                    </div>
                  </>
                );
              })()}
            </>
          )}
        </section>
      </main>
      
      {/* Floating Add Button */}
      <FloatingCreateButton onClick={() => setShowAddForm(!showAddForm)} />
      
      {/* Spacer for mobile */}
      <div className="h-20"></div>
    </div>
  );
};
