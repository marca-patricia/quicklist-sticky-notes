
import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useLanguage } from './LanguageContext';

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

// Mapping function from achievement ID to translation keys
const getAchievementTranslationKeys = (id: string) => {
  const keyMap: Record<string, { title: string; description: string }> = {
    'first-task': { title: 'firstStep', description: 'firstStepDesc' },
    'early-bird': { title: 'earlyBird', description: 'earlyBirdDesc' },
    'night-owl': { title: 'nightOwl', description: 'nightOwlDesc' },
    'task-master': { title: 'taskMaster', description: 'taskMasterDesc' },
    'productivity-hero': { title: 'productivityHero', description: 'productivityHeroDesc' },
    'legendary-achiever': { title: 'legendaryAchiever', description: 'legendaryAchieverDesc' },
    'streak-starter': { title: 'streakStarter', description: 'streakStarterDesc' },
    'streak-master': { title: 'streakMaster', description: 'streakMasterDesc' },
    'streak-legend': { title: 'streakLegend', description: 'streakLegendDesc' },
    'organizer': { title: 'organizer', description: 'organizerDesc' },
    'category-master': { title: 'categoryMaster', description: 'categoryMasterDesc' },
    'speed-demon': { title: 'speedDemon', description: 'speedDemonDesc' },
    'power-user': { title: 'powerUser', description: 'powerUserDesc' },
    'list-creator': { title: 'listCreator', description: 'listCreatorDesc' },
    'list-architect': { title: 'listArchitect', description: 'listArchitectDesc' },
    'perfectionist': { title: 'perfectionist', description: 'perfectionistDesc' },
    'minimalist': { title: 'minimalist', description: 'minimalistDesc' },
    'maximalist': { title: 'maximalist', description: 'maximalistDesc' },
    'weekend-warrior': { title: 'weekendWarrior', description: 'weekendWarriorDesc' }
  };
  return keyMap[id] || { title: id, description: id };
};

const getInitialAchievements = (t: (key: string) => string): Achievement[] => [
  {
    id: 'first-task',
    title: t('firstStep'),
    description: t('firstStepDesc'),
    icon: '🎯',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'early-bird',
    title: t('earlyBird'),
    description: t('earlyBirdDesc'),
    icon: '🌅',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'night-owl',
    title: t('nightOwl'),
    description: t('nightOwlDesc'),
    icon: '🦉',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'tasks'
  },
  {
    id: 'task-master',
    title: t('taskMaster'),
    description: t('taskMasterDesc'),
    icon: '⭐',
    unlocked: false,
    progress: 0,
    maxProgress: 50,
    type: 'tasks'
  },
  {
    id: 'productivity-hero',
    title: t('productivityHero'),
    description: t('productivityHeroDesc'),
    icon: '🏆',
    unlocked: false,
    progress: 0,
    maxProgress: 100,
    type: 'tasks'
  },
  {
    id: 'legendary-achiever',
    title: t('legendaryAchiever'),
    description: t('legendaryAchieverDesc'),
    icon: '👑',
    unlocked: false,
    progress: 0,
    maxProgress: 500,
    type: 'tasks'
  },
  {
    id: 'streak-starter',
    title: t('streakStarter'),
    description: t('streakStarterDesc'),
    icon: '🔥',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
    type: 'streak'
  },
  {
    id: 'streak-master',
    title: t('streakMaster'),
    description: t('streakMasterDesc'),
    icon: '💪',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
    type: 'streak'
  },
  {
    id: 'streak-legend',
    title: t('streakLegend'),
    description: t('streakLegendDesc'),
    icon: '🎖️',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
    type: 'streak'
  },
  {
    id: 'organizer',
    title: t('organizer'),
    description: t('organizerDesc'),
    icon: '📝',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    type: 'categories'
  },
  {
    id: 'category-master',
    title: t('categoryMaster'),
    description: t('categoryMasterDesc'),
    icon: '🏷️',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'categories'
  },
  {
    id: 'speed-demon',
    title: t('speedDemon'),
    description: t('speedDemonDesc'),
    icon: '⚡',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
    type: 'speed'
  },
  {
    id: 'power-user',
    title: t('powerUser'),
    description: t('powerUserDesc'),
    icon: '🚀',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
    type: 'speed'
  },
  {
    id: 'list-creator',
    title: t('listCreator'),
    description: t('listCreatorDesc'),
    icon: '📋',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
    type: 'milestone'
  },
  {
    id: 'list-architect',
    title: t('listArchitect'),
    description: t('listArchitectDesc'),
    icon: '🏗️',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
    type: 'milestone'
  },
  {
    id: 'perfectionist',
    title: t('perfectionist'),
    description: t('perfectionistDesc'),
    icon: '✨',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'minimalist',
    title: t('minimalist'),
    description: t('minimalistDesc'),
    icon: '⚪',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'maximalist',
    title: t('maximalist'),
    description: t('maximalistDesc'),
    icon: '📊',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  },
  {
    id: 'weekend-warrior',
    title: t('weekendWarrior'),
    description: t('weekendWarriorDesc'),
    icon: '⚔️',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
    type: 'milestone'
  }
];

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, language } = useLanguage();
  const [achievements, setAchievements] = useState<Achievement[]>(() => getInitialAchievements(t));

  // Update achievements when language changes
  useEffect(() => {
    setAchievements(prev => 
      prev.map(achievement => {
        const translationKeys = getAchievementTranslationKeys(achievement.id);
        return {
          ...achievement,
          title: t(translationKeys.title),
          description: t(translationKeys.description)
        };
      })
    );
  }, [language, t]);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('quicklist-achievements');
    if (savedAchievements) {
      try {
        const parsed = JSON.parse(savedAchievements);
        const loadedAchievements = parsed.map((achievement: any) => {
          const translationKeys = getAchievementTranslationKeys(achievement.id);
          return {
            ...achievement,
            title: t(translationKeys.title),
            description: t(translationKeys.description),
            unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined
          };
        });
        setAchievements(loadedAchievements);
      } catch (error) {
        // Error loading achievements - silent in production
      }
    }
  }, [t]);

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
          // Achievement unlocked - only log in development
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
