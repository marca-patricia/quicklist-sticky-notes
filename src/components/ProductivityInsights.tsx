
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, Target, TrendingUp, Calendar, Award, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';

export const ProductivityInsights: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();
  const [open, setOpen] = useState(false);

  // Calculate insights
  const totalTasks = lists.reduce((acc, list) => acc + list.items.length, 0);
  const completedTasks = lists.reduce((acc, list) => 
    acc + list.items.filter(item => item.completed).length, 0
  );
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Tasks completed today
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tasksToday = lists.reduce((acc, list) => {
    return acc + list.items.filter(item => {
      if (!item.completed) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate >= todayStart;
    }).length;
  }, 0);

  // Tasks this week
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay());
  thisWeekStart.setHours(0, 0, 0, 0);
  
  const tasksThisWeek = lists.reduce((acc, list) => {
    return acc + list.items.filter(item => {
      if (!item.completed) return false;
      const itemDate = new Date(item.createdAt);
      return itemDate >= thisWeekStart;
    }).length;
  }, 0);

  // Calculate current streak
  let currentStreak = 0;
  const todayDate = new Date();
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(todayDate);
    checkDate.setDate(todayDate.getDate() - i);
    checkDate.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(checkDate);
    nextDay.setDate(checkDate.getDate() + 1);
    
    const hasCompletedTask = lists.some(list => 
      list.items.some(item => {
        if (!item.completed) return false;
        const itemDate = new Date(item.createdAt);
        itemDate.setHours(0, 0, 0, 0);
        return itemDate.getTime() === checkDate.getTime();
      })
    );
    
    if (hasCompletedTask) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Active lists (lists with pending tasks)
  const activeLists = lists.filter(list => 
    list.items.some(item => !item.completed)
  ).length;

  // Average tasks per day (last 7 days)
  const averageTasksPerDay = Math.round(tasksThisWeek / 7);

  const insights = [
    {
      icon: Target,
      label: t('totalTasksCreated'),
      value: totalTasks,
      color: 'text-blue-600'
    },
    {
      icon: Award,
      label: t('totalTasksCompleted'), 
      value: completedTasks,
      color: 'text-green-600'
    },
    {
      icon: TrendingUp,
      label: t('completionRate'),
      value: `${completionRate}%`,
      color: 'text-foreground'
    },
    {
      icon: Calendar,
      label: t('tasksCompletedToday'),
      value: tasksToday,
      color: 'text-orange-600'
    },
    {
      icon: Clock,
      label: t('thisWeek'),
      value: tasksThisWeek,
      color: 'text-indigo-600'
    },
    {
      icon: Award,
      label: t('currentStreak'),
      value: `${currentStreak} ${t('days')}`,
      color: 'text-red-600'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="bg-transparent hover:bg-white/20 border-none text-foreground"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('insights')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg animate-fade-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {t('productivityInsights')}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 mt-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${insight.color}`} />
                  <span className="font-medium">{insight.label}</span>
                </div>
                <span className="text-2xl font-bold text-primary">{insight.value}</span>
              </div>
            );
          })}
        </div>
        {totalTasks === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Crie algumas listas para ver seus insights de produtividade!</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
