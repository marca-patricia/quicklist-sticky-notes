
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

const getAchievementTranslation = (achievement: any, t: (key: string) => string) => {
  const translationMap: Record<string, { title: string; description: string }> = {
    'first-task': { title: t('firstStep'), description: t('firstStepDesc') },
    'early-bird': { title: t('earlyBird'), description: t('earlyBirdDesc') },
    'night-owl': { title: t('nightOwl'), description: t('nightOwlDesc') },
    'task-master': { title: t('taskMaster'), description: t('taskMasterDesc') },
    'productivity-hero': { title: t('productivityHero'), description: t('productivityHeroDesc') },
    'legendary-achiever': { title: t('legendaryAchiever'), description: t('legendaryAchieverDesc') },
    'streak-starter': { title: t('streakStarter'), description: t('streakStarterDesc') },
    'streak-master': { title: t('streakMaster'), description: t('streakMasterDesc') },
    'streak-legend': { title: t('streakLegend'), description: t('streakLegendDesc') },
    'organizer': { title: t('organizer'), description: t('organizerDesc') },
    'category-master': { title: t('categoryMaster'), description: t('categoryMasterDesc') },
    'speed-demon': { title: t('speedDemon'), description: t('speedDemonDesc') },
    'power-user': { title: t('powerUser'), description: t('powerUserDesc') },
    'list-creator': { title: t('listCreator'), description: t('listCreatorDesc') },
    'list-architect': { title: t('listArchitect'), description: t('listArchitectDesc') },
    'perfectionist': { title: t('perfectionist'), description: t('perfectionistDesc') },
    'minimalist': { title: t('minimalist'), description: t('minimalistDesc') },
    'maximalist': { title: t('maximalist'), description: t('maximalistDesc') },
    'weekend-warrior': { title: t('weekendWarrior'), description: t('weekendWarriorDesc') }
  };
  
  return translationMap[achievement.id] || { title: achievement.title, description: achievement.description };
};

export const AchievementsModal: React.FC = () => {
  const { t } = useLanguage();
  const { achievements, getUnlockedCount } = useAchievements();
  const [open, setOpen] = useState(false);
  const unlockedCount = getUnlockedCount();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative bg-transparent hover:bg-foreground/10 border-none text-foreground"
          aria-label={`Conquistas: ${unlockedCount} de ${achievements.length} desbloqueadas`}
        >
          <Trophy className="w-4 h-4 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">{t('achievements')}</span>
          {unlockedCount > 0 && (
            <span 
              className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center"
              aria-label={`${unlockedCount} conquistas desbloqueadas`}
            >
              {unlockedCount}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent 
        className="max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in"
        aria-describedby="achievements-description"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" aria-hidden="true" />
            {t('achievements')}
            <span className="text-sm text-muted-foreground ml-2">
              ({unlockedCount}/{achievements.length} {t('unlocked').toLowerCase()})
            </span>
          </DialogTitle>
        </DialogHeader>
        <div id="achievements-description" className="sr-only">
          Lista de conquistas do aplicativo. {unlockedCount} de {achievements.length} conquistas foram desbloqueadas.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" role="list">
          {achievements.map((achievement) => {
            const translation = getAchievementTranslation(achievement, t);
            return (
              <div 
                key={achievement.id} 
                className={`border rounded-lg p-4 transition-all animate-fade-in ${
                  achievement.unlocked 
                    ? 'border-primary/50 bg-primary/10 shadow-lg ring-1 ring-primary/20' 
                    : 'border-muted bg-muted/20'
                }`}
                role="listitem"
                aria-describedby={`achievement-desc-${achievement.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`text-2xl ${achievement.unlocked ? 'animate-scale-in' : 'opacity-50'}`}
                      role="img"
                      aria-label={achievement.unlocked ? `Conquista desbloqueada: ${achievement.icon}` : "Conquista bloqueada"}
                    >
                      {achievement.unlocked ? achievement.icon : '🔒'}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {translation.title}
                      </h3>
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                          <Trophy className="w-3 h-3" aria-hidden="true" />
                          <span aria-label={`Desbloqueado em ${achievement.unlockedAt.toLocaleDateString()}`}>
                            Desbloqueado!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p 
                  className={`text-sm mb-3 ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}
                  id={`achievement-desc-${achievement.id}`}
                >
                  {translation.description}
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-2" role="progressbar" aria-label="Progresso da conquista">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      achievement.unlocked ? 'bg-primary' : 'bg-muted-foreground/30'
                    }`}
                    style={{ 
                      width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` 
                    }}
                    aria-valuenow={Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className={achievement.unlocked ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    {achievement.progress}/{achievement.maxProgress}
                  </span>
                  <span className={achievement.unlocked ? 'text-primary font-medium' : 'text-muted-foreground'}>
                    {Math.round((achievement.progress / achievement.maxProgress) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {unlockedCount === 0 && (
          <div className="text-center py-8 text-muted-foreground" role="status">
            <Trophy className="w-12 h-12 mx-auto mb-3 opacity-50" aria-hidden="true" />
            <p>Complete tarefas para desbloquear conquistas!</p>
          </div>
        )}
        
        {unlockedCount > 0 && (
          <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20" role="status">
            <h4 className="font-semibold text-primary mb-2">🎉 Parabéns!</h4>
            <p className="text-sm text-foreground">
              Você já desbloqueou {unlockedCount} conquista{unlockedCount > 1 ? 's' : ''}! Continue assim para desbloquear mais.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
