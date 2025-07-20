import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Achievement } from '@/contexts/AchievementsContext';

export const useAchievementNotifications = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleAchievementUnlocked = (event: CustomEvent<{ achievement: Achievement }>) => {
      const { achievement } = event.detail;
      
      toast({
        title: "🏆 Conquista Desbloqueada!",
        description: `${achievement.icon} ${achievement.title}: ${achievement.description}`,
        duration: 5000,
      });
    };

    window.addEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener);

    return () => {
      window.removeEventListener('achievementUnlocked', handleAchievementUnlocked as EventListener);
    };
  }, [toast]);
};