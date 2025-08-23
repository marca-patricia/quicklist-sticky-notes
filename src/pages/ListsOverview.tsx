
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddListForm } from '@/components/AddListForm';
import { ListCard } from '@/components/ListCard';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCreateList = () => {
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('app.title') || 'QuickList'}</h1>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('lists.new') || 'Nova Lista'}
          </Button>
        </div>

        {lists.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">
              {t('lists.empty') || 'Nenhuma lista ainda'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('lists.empty.description') || 'Crie sua primeira lista para começar'}
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t('lists.new') || 'Nova Lista'}
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}

        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">{t('lists.new') || 'Nova Lista'}</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    ✕
                  </Button>
                </div>
                <AddListForm onSuccess={() => setShowAddForm(false)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
