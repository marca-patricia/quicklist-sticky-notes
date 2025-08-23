
import React, { useState } from 'react';
import { Plus, Palette, Languages, Moon, Sun } from 'lucide-react';
import { useLists } from '@/contexts/ListsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/hooks/useTheme';
import { PostItCard } from '@/components/PostItCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export const ListsOverview = () => {
  const { lists, addList } = useLists();
  const { language, setLanguage, t } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');

  const handleCreateList = () => {
    if (!newListTitle.trim()) return;
    
    addList(newListTitle, newListDescription);
    setNewListTitle('');
    setNewListDescription('');
    setIsCreateDialogOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'en' : 'pt');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            {t('myLists')}
          </h1>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              title={`Switch to ${language === 'pt' ? 'English' : 'Português'}`}
            >
              <Languages className="h-5 w-5" />
            </Button>
            
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={t('toggleTheme')}
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {/* Create List Button */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('newList')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('newList')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">{t('listTitle')}</Label>
                    <Input
                      id="title"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      placeholder={t('listTitle')}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">{t('listDescription')}</Label>
                    <Textarea
                      id="description"
                      value={newListDescription}
                      onChange={(e) => setNewListDescription(e.target.value)}
                      placeholder={t('listDescription')}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleCreateList}>
                      {t('create')}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Lists Grid */}
        {lists.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Palette className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">{t('noListsFound')}</h3>
              <p>{t('createFirstList')}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lists.map((list) => (
              <PostItCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
