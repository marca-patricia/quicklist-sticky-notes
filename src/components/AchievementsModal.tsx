
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAchievements } from '@/contexts/AchievementsContext';
import { Trophy, Award, Lock, CheckCircle, Star, Target, Zap, Calendar, Users, Layers } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const achievementIcons = {
  firstStep: CheckCircle,
  taskMaster: Target,
  productivityHero: Star,
  streakStarter: Calendar,
  streakMaster: Award,
  organizer: Layers,
  speedDemon: Zap,
  listCreator: Users
};

export const AchievementsModal: React.FC = () => {
  const { t } = useLanguage();
  const { achievements, getUnlockedCount } = useAchievements();
  const [open, setOpen] = useState(false);
  const unlockedCount = getUnlockedCount();

  // Simple achievements tracking using object instead of array
  const simpleAchievements = {
    firstStep: false,
    taskMaster: false,
    productivityHero: false,
    streakStarter: false,
    streakMaster: false,
    organizer: false,
    speedDemon: false,
    listCreator: false
  };

  const achievementsList = [
    { key: 'firstStep', requirement: 1 },
    { key: 'taskMaster', requirement: 50 },
    { key: 'productivityHero', requirement: 100 },
    { key: 'streakStarter', requirement: 3 },
    { key: 'streakMaster', requirement: 7 },
    { key: 'organizer', requirement: 5 },
    { key: 'speedDemon', requirement: 10 },
    { key: 'listCreator', requirement: 5 }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Trophy className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('achievements')}</span>
          {unlockedCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unlockedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {t('achievements')}
            <span className="text-sm text-muted-foreground ml-2">
              ({unlockedCount}/{achievementsList.length} {t('unlocked').toLowerCase()})
            </span>
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {achievementsList.map((achievement) => {
            const isUnlocked = simpleAchievements[achievement.key as keyof typeof simpleAchievements];
            const Icon = achievementIcons[achievement.key as keyof typeof achievementIcons];
            
            return (
              <div 
                key={achievement.key} 
                className={`border rounded-lg p-4 transition-all ${
                  isUnlocked 
                    ? 'border-primary/50 bg-primary/5 shadow-md' 
                    : 'border-muted bg-muted/20'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <Icon className="w-6 h-6 text-primary" />
                    ) : (
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    )}
                    <h3 className={`font-medium ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {t(achievement.key)}
                    </h3>
                  </div>
                  {isUnlocked && (
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Trophy className="w-3 h-3" />
                      {t('unlocked')}
                    </div>
                  )}
                </div>
                <p className={`text-sm ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {t(`${achievement.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
        {unlockedCount === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Complete tarefas para desbloquear conquistas!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
