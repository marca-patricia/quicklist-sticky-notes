
import React from 'react';
import { AddListForm } from '@/components/AddListForm';
import { ListCard } from '@/components/ListCard';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { EmptyState } from '@/components/EmptyState';
import { InstallPrompt } from '@/components/InstallPrompt';
import { AdBanner } from '@/components/AdBanner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useAdMob } from '@/hooks/useAdMob';
import quicklistIcon from '@/assets/quicklist-icon.png';

export const ListsOverview: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const { showInterstitialAd } = useAdMob();

  // Mostrar intersticial a cada 3 ações (criar lista)
  const handleListCreated = () => {
    const actionsCount = parseInt(localStorage.getItem('actionsCount') || '0') + 1;
    localStorage.setItem('actionsCount', actionsCount.toString());
    
    if (actionsCount % 3 === 0) {
      showInterstitialAd();
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
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
            {t('organizeDesc')}
          </p>
        </div>

        {/* Banner Ad no topo */}
        <div className="mb-6">
          <AdBanner />
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
            {lists.map((list, index) => (
              <React.Fragment key={list.id}>
                <ListCard list={list} />
                {/* Banner a cada 6 listas */}
                {(index + 1) % 6 === 0 && (
                  <div className="md:col-span-2 lg:col-span-3">
                    <AdBanner className="my-4" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Banner fixo no final */}
        <div className="mt-8">
          <AdBanner />
        </div>
      </div>
    </div>
  );
};
