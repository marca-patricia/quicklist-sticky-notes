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
import { Archive, ArchiveRestore, Filter, LogOut, User, StickyNote, Plus } from 'lucide-react';
import { SearchInput } from '@/components/SearchInput';

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

    let currentStreak = 0;
    const today_date = new Date();
    
    const todayString = today_date.toDateString();
    const hasTasksToday = completedItems.some(item => 
      new Date(item.createdAt).toDateString() === todayString
    );
    
    if (hasTasksToday) {
      currentStreak = 1;
      
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

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#B8956A',
      backgroundImage: 'url("/lovable-uploads/b28063b1-b719-4516-9218-fe85c0f556c0.png")',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center'
    }}>
      {/* HEADER ESTILO POST-IT */}
      <header className="toolbar-postit p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo e título */}
          <div className="flex items-center gap-4">
            <QuickListLogo size="sm" />
            <h1 className="text-xl font-bold text-amber-900">Minhas Listas</h1>
          </div>
          
          {/* Controles do header */}
          <div className="flex items-center gap-3">
            {/* Botão criar lista */}
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              variant="outline"
              size="sm"
              className="button-enhanced flex items-center gap-2 bg-white/90 hover:bg-white border-amber-400"
            >
              <Plus className="w-4 h-4" />
              Nova Lista
            </Button>
            
            <Button
              onClick={() => navigate('/sticky-notes')}
              variant="ghost"
              size="sm"
              className="text-amber-900 hover:bg-amber-100/50 flex items-center gap-2"
            >
              <StickyNote className="w-4 h-4" />
              Notas
            </Button>
            
            <LanguageSwitch />
            <OfflineStatus />
            
            {user && (
              <Button
                onClick={() => signOut()}
                variant="ghost"
                size="sm"
                className="text-amber-900 hover:bg-amber-100/50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <InstallPrompt />
      
      <main className="container mx-auto px-6 py-8">
        {/* Formulário de adicionar lista */}
        {showAddForm && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-yellow-50/95 backdrop-blur-sm border border-amber-300 rounded-lg p-6 shadow-lg">
              <AddListForm />
            </div>
          </div>
        )}

        {/* Busca */}
        {lists.length > 0 && (
          <div className="max-w-md mx-auto mb-8">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar listas..."
              className="search-input w-full"
            />
          </div>
        )}

        {/* Filtros */}
        {lists.length > 0 && (
          <div className="flex justify-center mb-8">
            <Button
              variant={showArchived ? "default" : "outline"}
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="button-enhanced bg-white/90 hover:bg-white border-amber-400"
            >
              {showArchived ? <ArchiveRestore className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
              {showArchived ? 'Ocultar Arquivadas' : 'Ver Arquivadas'}
            </Button>
          </div>
        )}

        {/* GRID DE POST-ITS DE LISTAS */}
        <div className="notes-grid">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="sticky-note animate-pulse">
                <div className="h-4 bg-amber-200 rounded mb-2"></div>
                <div className="h-3 bg-amber-200 rounded mb-1 w-3/4"></div>
                <div className="h-3 bg-amber-200 rounded mb-1 w-1/2"></div>
              </div>
            ))
          ) : lists.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
                <StickyNote className="w-16 h-16 text-amber-800 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold text-amber-900 mb-2">
                  Nenhuma lista ainda
                </h3>
                <p className="text-amber-800 mb-6">
                  Crie sua primeira lista para começar a organizar suas tarefas
                </p>
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Lista
                </Button>
              </div>
            </div>
          ) : (
            (() => {
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
                  <div className="col-span-full text-center py-12">
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                      <Archive className="w-16 h-16 text-amber-800 mb-4 mx-auto" />
                      <p className="text-amber-900 text-lg">
                        {searchTerm ? `Nenhuma lista encontrada para "${searchTerm}"` : 'Nenhuma lista arquivada'}
                      </p>
                    </div>
                  </div>
                );
              }

              return filteredLists.map((list) => (
                <ListCard 
                  key={list.id} 
                  list={list} 
                  isGridView={true}
                />
              ));
            })()
          )}
        </div>
      </main>
      
      {/* Spacer for mobile */}
      <div className="h-20"></div>
    </div>
  );
};