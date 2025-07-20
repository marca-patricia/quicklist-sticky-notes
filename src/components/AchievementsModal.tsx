
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAchievements } from '@/contexts/AchievementsContext';
import { Trophy } from 'lucide-react';

export const AchievementsModal: React.FC = () => {
  const { getUnlockedCount } = useAchievements();
  const unlockedCount = getUnlockedCount();

  return (
    <Button variant="outline" size="sm" className="relative">
      <Trophy className="w-4 h-4 mr-2" />
      <span className="hidden sm:inline">Conquistas</span>
      {unlockedCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unlockedCount}
        </span>
      )}
    </Button>
  );
};
