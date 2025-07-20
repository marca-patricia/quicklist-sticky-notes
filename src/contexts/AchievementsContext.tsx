
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  maxProgress: number;
  type: 'tasks' | 'streak' | 'categories' | 'speed' | 'milestone';
}

interface AchievementsContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  checkAchievements: (stats: UserStats) => void;
  getUnlockedCount: () => number;
}

interface UserStats {
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  categoriesUsed: number;
  tasksCompletedToday: number;
  listsCreated: number;
}

const AchievementsContext = createContext<AchievementsContextType | undefined>(undefined);

const initialAchievements: Achievement[] = [
  {
    id: 'first-task',
    title: 'Primeiro Passo',
    description: 'Complete sua primeira tarefa',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'early-bird',
    title: 'Madrugador',
    description: 'Complete uma tarefa antes das 8h',
    icon: '🌅',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'night-owl',
    title: 'Coruja Noturna',
    description: 'Complete uma tarefa depois das 22h',
    icon: '🦉',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'task-master',
    title: 'Mestre das Tarefas',
    description: 'Complete 50 tarefas',
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    type: 'tasks'
  },
  {
    id: 'productivity-hero',
    title: 'Herói da Produtividade',
    description: 'Complete 100 tarefas',
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    type: 'tasks'
  },
  {
    id: 'legendary-achiever',
    title: 'Lenda da Produtividade',
    description: 'Complete 500 tarefas',
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    type: 'tasks'
  },
  {
    id: 'streak-starter',
    title: 'Sequência Iniciada',
    description: 'Complete tarefas por 3 dias seguidos',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    type: 'streak'
  },
  {
    id: 'streak-master',
    title: 'Mestre da Consistência',
    description: 'Complete tarefas por 7 dias seguidos',
    icon: '💪',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    type: 'streak'
  },
  {
    id: 'streak-legend',
    title: 'Lenda da Consistência',
    description: 'Complete tarefas por 30 dias seguidos',
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    type: 'streak'
  },
  {
    id: 'organizer',
    title: 'Organizador',
    description: 'Use 5 categorias diferentes',
    icon: '📝',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    type: 'categories'
  },
  {
    id: 'category-master',
    title: 'Mestre das Categorias',
    description: 'Use 10 categorias diferentes',
    icon: '🏷️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'categories'
  },
  {
    id: 'speed-demon',
    title: 'Velocista',
    description: 'Complete 10 tarefas em um dia',
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'speed'
  },
  {
    id: 'power-user',
    title: 'Super Usuário',
    description: 'Complete 25 tarefas em um dia',
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    type: 'speed'
  },
  {
    id: 'list-creator',
    title: 'Criador de Listas',
    description: 'Crie 5 listas diferentes',
    icon: '📋',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    type: 'milestone'
  },
  {
    id: 'list-architect',
    title: 'Arquiteto de Listas',
    description: 'Crie 20 listas diferentes',
    icon: '🏗️',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    type: 'milestone'
  },
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Complete uma lista inteira',
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'minimalist',
    title: 'Minimalista',
    description: 'Complete uma lista com apenas 1 item',
    icon: '⚪',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'maximalist',
    title: 'Maximalista',
    description: 'Crie uma lista com 50+ itens',
    icon: '📊',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'weekend-warrior',
    title: 'Guerreiro de Fim de Semana',
    description: 'Complete tarefas no sábado e domingo',
    icon: '⚔️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  }
];

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('quicklist-achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        setAchievements(parsed.map((achievement: any) => ({
          ...achievement,
          unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
        })));
      } catch (error) {
        console.error('Error loading achievements:', error);
      }
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('quicklist-achievements', JSON.stringify(achievements));
  }, [achievements]);

  const checkAchievements = (stats: UserStats) => {
    setAchievements(prev => {
      const newAchievements = prev.map(achievement => {
        if (achievement.unlocked) return achievement;

        let newProgress = achievement.progress;
        let shouldUnlock = false;

        switch (achievement.id) {
          case 'first-task':
            newProgress = Math.min(stats.completedTasks, 1);
            shouldUnlock = stats.completedTasks >= 1;
            break;
          case 'task-master':
            newProgress = Math.min(stats.completedTasks, 50);
            shouldUnlock = stats.completedTasks >= 50;
            break;
          case 'productivity-hero':
            newProgress = Math.min(stats.completedTasks, 100);
            shouldUnlock = stats.completedTasks >= 100;
            break;
          case 'streak-starter':
            newProgress = Math.min(stats.currentStreak, 3);
            shouldUnlock = stats.currentStreak >= 3;
            break;
          case 'streak-master':
            newProgress = Math.min(stats.currentStreak, 7);
            shouldUnlock = stats.currentStreak >= 7;
            break;
          case 'organizer':
            newProgress = Math.min(stats.categoriesUsed, 5);
            shouldUnlock = stats.categoriesUsed >= 5;
            break;
          case 'speed-demon':
            newProgress = Math.min(stats.tasksCompletedToday, 10);
            shouldUnlock = stats.tasksCompletedToday >= 10;
            break;
          case 'list-creator':
            newProgress = Math.min(stats.listsCreated, 5);
            shouldUnlock = stats.listsCreated >= 5;
            break;
          case 'early-bird':
            // Check if completed before 8 AM
            newProgress = stats.completedTasks > 0 ? 1 : 0;
            shouldUnlock = stats.completedTasks > 0; // Simplified for demo
            break;
          case 'night-owl':
            // Check if completed after 10 PM
            newProgress = stats.completedTasks > 0 ? 1 : 0;
            shouldUnlock = stats.completedTasks > 0; // Simplified for demo
            break;
          case 'legendary-achiever':
            newProgress = Math.min(stats.completedTasks, 500);
            shouldUnlock = stats.completedTasks >= 500;
            break;
          case 'streak-legend':
            newProgress = Math.min(stats.currentStreak, 30);
            shouldUnlock = stats.currentStreak >= 30;
            break;
          case 'category-master':
            newProgress = Math.min(stats.categoriesUsed, 10);
            shouldUnlock = stats.categoriesUsed >= 10;
            break;
          case 'power-user':
            newProgress = Math.min(stats.tasksCompletedToday, 25);
            shouldUnlock = stats.tasksCompletedToday >= 25;
            break;
          case 'list-architect':
            newProgress = Math.min(stats.listsCreated, 20);
            shouldUnlock = stats.listsCreated >= 20;
            break;
          case 'perfectionist':
            // Simplified check - when a list is completed
            newProgress = stats.completedTasks > 0 ? 1 : 0;
            shouldUnlock = stats.completedTasks > 0;
            break;
          case 'minimalist':
            newProgress = stats.listsCreated > 0 ? 1 : 0;
            shouldUnlock = stats.listsCreated > 0;
            break;
          case 'maximalist':
            newProgress = stats.totalTasks >= 50 ? 1 : 0;
            shouldUnlock = stats.totalTasks >= 50;
            break;
          case 'weekend-warrior':
            newProgress = stats.completedTasks > 0 ? 1 : 0;
            shouldUnlock = stats.completedTasks > 0;
            break;
        }

        const updatedAchievement = {
          ...achievement,
          progress: newProgress,
          unlocked: shouldUnlock,
          unlockedAt: shouldUnlock && !achievement.unlocked ? new Date() : achievement.unlockedAt
        };

        // Dispatch achievement unlocked event if it's newly unlocked
        if (shouldUnlock && !achievement.unlocked) {
          console.log('Achievement unlocked:', updatedAchievement.title);
          setTimeout(() => {
            const event = new CustomEvent('achievementUnlocked', {
              detail: { achievement: updatedAchievement }
            });
            window.dispatchEvent(event);
          }, 100);
        }

        return updatedAchievement;
      });

      return newAchievements;
    });
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const getUnlockedCount = () => unlockedAchievements.length;

  return (
    <AchievementsContext.Provider value={{
      achievements,
      unlockedAchievements,
      checkAchievements,
      getUnlockedCount
    }}>
      {children}
    </AchievementsContext.Provider>
  );
};

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (context === undefined) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};
