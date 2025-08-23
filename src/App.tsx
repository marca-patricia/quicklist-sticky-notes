
import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import { PostItCard } from '@/components/PostItCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { Button } from '@/components/ui/button';
import { Plus, Trophy, FileText, List } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface PostIt {
  id: string;
  title: string;
  content: string;
  color: string;
  textColor: string;
  font: string;
  fontSize: string;
  type: 'list' | 'note';
  items?: { id: string; text: string; completed: boolean }[];
}

const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [postIts, setPostIts] = useState<PostIt[]>([
    {
      id: '1',
      title: 'Lista de Compras',
      content: '',
      color: '#FFE066',
      textColor: '#333333',
      font: 'Arial',
      fontSize: '14px',
      type: 'list',
      items: [
        { id: '1', text: 'Leite', completed: false },
        { id: '2', text: 'Pão', completed: true },
        { id: '3', text: 'Ovos', completed: false }
      ]
    },
    {
      id: '2',
      title: 'Lembrete',
      content: 'Não esquecer da reunião às 15h',
      color: '#FFB3E6',
      textColor: '#000000',
      font: 'Arial',
      fontSize: '14px',
      type: 'note'
    }
  ]);

  const addNewPostIt = (type: 'list' | 'note') => {
    const newPostIt: PostIt = {
      id: Date.now().toString(),
      title: type === 'list' ? t('newList') : t('newNote'),
      content: '',
      color: '#FFE066',
      textColor: '#333333',
      font: 'Arial',
      fontSize: '14px',
      type,
      items: type === 'list' ? [{ id: '1', text: '', completed: false }] : undefined
    };
    setPostIts([...postIts, newPostIt]);
  };

  const updatePostIt = (id: string, updates: any) => {
    setPostIts(postIts.map(postIt => 
      postIt.id === id ? { ...postIt, ...updates } : postIt
    ));
  };

  const deletePostIt = (id: string) => {
    setPostIts(postIts.filter(postIt => postIt.id !== id));
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-900 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b backdrop-blur-md ${
        theme === 'dark'
          ? 'bg-slate-800/90 border-slate-700'
          : 'bg-white/90 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className={`text-2xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                QuickList
              </div>
              <div className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {t('listsDesc')}
              </div>
            </div>
            
            {/* Header Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={`${theme === 'dark' ? 'text-white hover:bg-slate-700' : ''}`}
              >
                <Trophy className="w-4 h-4 mr-2" />
                {t('achievements')}
              </Button>
              <LanguageSwitch />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {t('welcomeTitle')}
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sua lista de tarefas simples e eficiente
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            onClick={() => addNewPostIt('list')}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <List className="w-4 h-4 mr-2" />
            {t('newList')}
          </Button>
          
          <Button
            onClick={() => addNewPostIt('note')}
            variant="outline"
            className={theme === 'dark' ? 'border-gray-600 text-white hover:bg-slate-800' : ''}
          >
            <FileText className="w-4 h-4 mr-2" />
            {t('newNote')}
          </Button>
        </div>

        {/* Post-its Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
          {postIts.map((postIt) => (
            <PostItCard
              key={postIt.id}
              {...postIt}
              onUpdate={updatePostIt}
              onDelete={deletePostIt}
            />
          ))}
        </div>

        {/* Empty State */}
        {postIts.length === 0 && (
          <div className="text-center py-12">
            <div className={`text-6xl mb-4 ${
              theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
            }`}>
              📝
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Nenhum post-it criado ainda
            </h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Clique nos botões acima para criar sua primeira lista ou nota
            </p>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => addNewPostIt('list')}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
