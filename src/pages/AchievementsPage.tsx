import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Lock, Star, Target, Zap, Clock, Users, CheckCircle } from 'lucide-react';

type FilterType = 'all' | 'unlocked' | 'locked';

export const AchievementsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { achievements, getUnlockedCount } = useAchievements();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterType>('all');

  const unlockedCount = getUnlockedCount();
  const totalCount = achievements.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

  const filteredAchievements = achievements.filter(achievement => {
    switch (filter) {
      case 'unlocked':
        return achievement.unlocked;
      case 'locked':
        return !achievement.unlocked;
      default:
        return true;
    }
  });

  const getCategoryIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return Target;
      case 'speed':
        return Zap;
      case 'streak':
        return Clock;
      case 'categories':
        return Users;
      default:
        return Trophy;
    }
  };

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'text-blue-600 bg-blue-50';
      case 'speed':
        return 'text-green-600 bg-green-50';
      case 'streak':
        return 'text-purple-600 bg-purple-50';
      case 'categories':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getRarityColor = (type: string) => {
    switch (type) {
      case 'milestone':
        return 'from-yellow-400 to-orange-500';
      case 'speed':
        return 'from-purple-400 to-pink-500';
      case 'streak':
        return 'from-blue-400 to-cyan-500';
      case 'tasks':
        return 'from-green-400 to-emerald-500';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityText = (type: string) => {
    const typeTexts = {
      pt: {
        milestone: 'Marco',
        speed: 'Velocidade',
        streak: 'Sequência',
        tasks: 'Tarefas',
        categories: 'Categorias'
      },
      en: {
        milestone: 'Milestone',
        speed: 'Speed',
        streak: 'Streak', 
        tasks: 'Tasks',
        categories: 'Categories'
      }
    };
    
    return typeTexts[language as keyof typeof typeTexts][type as keyof typeof typeTexts.pt] || type;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === 'pt' ? 'Voltar' : 'Back'}
              </Button>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-7 h-7 text-yellow-600" />
                {t('achievements')}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-xl p-6 mb-8 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                {language === 'pt' ? 'Progresso Geral' : 'Overall Progress'}
              </h2>
              <p className="text-yellow-700 dark:text-yellow-300">
                {unlockedCount} {language === 'pt' ? 'de' : 'of'} {totalCount} {language === 'pt' ? 'conquistas desbloqueadas' : 'achievements unlocked'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {progressPercentage}%
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(progressPercentage / 20) 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-yellow-200 dark:bg-yellow-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="flex items-center gap-2"
          >
            <Trophy className="w-4 h-4" />
            {language === 'pt' ? 'Todas' : 'All'} ({totalCount})
          </Button>
          <Button
            variant={filter === 'unlocked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('unlocked')}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {language === 'pt' ? 'Desbloqueadas' : 'Unlocked'} ({unlockedCount})
          </Button>
          <Button
            variant={filter === 'locked' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('locked')}
            className="flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            {language === 'pt' ? 'Bloqueadas' : 'Locked'} ({totalCount - unlockedCount})
          </Button>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAchievements.map((achievement) => {
            const CategoryIcon = getCategoryIcon(achievement.type);
            const categoryColor = getCategoryColor(achievement.type);
            const rarityGradient = getRarityColor(achievement.type);
            const isUnlocked = achievement.unlocked;

            return (
              <div
                key={achievement.id}
                className={`relative bg-card rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isUnlocked 
                    ? 'shadow-md hover:shadow-xl' 
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                {/* Rarity Border for Unlocked Achievements */}
                {isUnlocked && (
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${rarityGradient} p-0.5`}>
                    <div className="w-full h-full bg-card rounded-lg" />
                  </div>
                )}
                
                <div className="relative p-6">
                  {/* Achievement Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${categoryColor.split(' ')[1]} ${isUnlocked ? '' : 'grayscale'}`}>
                      <CategoryIcon className={`w-6 h-6 ${categoryColor.split(' ')[0]}`} />
                    </div>
                    
                    <div className="text-right">
                      {isUnlocked ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-xs font-medium text-green-600">
                            {language === 'pt' ? 'Desbloqueada' : 'Unlocked'}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Lock className="w-5 h-5 text-gray-400" />
                          <span className="text-xs font-medium text-gray-400">
                            {language === 'pt' ? 'Bloqueada' : 'Locked'}
                          </span>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-1">
                        {getRarityText(achievement.type)}
                      </div>
                    </div>
                  </div>

                  {/* Achievement Content */}
                  <div className="space-y-3">
                    <h3 className={`font-semibold text-lg ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {achievement.title}
                    </h3>
                    
                    <p className={`text-sm ${isUnlocked ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                      {achievement.description}
                    </p>

                    {/* Progress or Unlock Date */}
                    {isUnlocked && achievement.unlockedAt ? (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {language === 'pt' ? 'Desbloqueada em' : 'Unlocked on'} {' '}
                          {new Date(achievement.unlockedAt).toLocaleDateString(
                            language === 'pt' ? 'pt-BR' : 'en-US'
                          )}
                        </p>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground">
                          {language === 'pt' 
                            ? t('continueUsingApp')
                            : t('continueUsingApp')
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {language === 'pt' ? 'Nenhuma conquista encontrada' : 'No achievements found'}
            </h3>
            <p className="text-muted-foreground">
              {language === 'pt' 
                ? 'Tente filtrar por uma categoria diferente'
                : 'Try filtering by a different category'
              }
            </p>
          </div>
        )}
      </main>
    </div>
  );
};