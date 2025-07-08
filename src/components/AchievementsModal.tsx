
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAchievements } from '@/contexts/AchievementsContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Trophy, Award } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const { achievements, getUnlockedCount } = useAchievements();
  const { t } = useLanguage();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Trophy className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('achievements')}</span>
          <Badge variant="secondary" className="ml-2 px-1 text-xs">
            {getUnlockedCount()}/{achievements.length}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            {t('achievementsUnlocked')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-lg border ${
                achievement.unlocked 
                  ? 'bg-primary/5 border-primary/20' 
                  : 'bg-muted/50 border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <Badge variant="secondary" className="text-xs">
                        Desbloqueada
                      </Badge>
                    )}
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.description}
                  </p>
                  
                  {!achievement.unlocked && (
                    <div className="space-y-1">
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        {achievement.progress}/{achievement.maxProgress}
                      </p>
                    </div>
                  )}
                  
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground">
                      Desbloqueada em {achievement.unlockedAt.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
