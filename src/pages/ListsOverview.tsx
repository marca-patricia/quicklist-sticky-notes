
import React from 'react';
import { AddListForm } from '@/components/AddListForm';
import { ListCard } from '@/components/ListCard';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { EmptyState } from '@/components/EmptyState';
import { InstallPrompt } from '@/components/InstallPrompt';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import quicklistIcon from '@/assets/quicklist-icon.png';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();

  return (
    <div className="min-h-screen bg-background">
      <LanguageSwitch />
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
            Organize suas listas de forma simples e eficiente
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
            {lists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
