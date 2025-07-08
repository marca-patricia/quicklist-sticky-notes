
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Clock, Target, BarChart3 } from 'lucide-react';

export const ProductivityInsights: React.FC = () => {
  const { t } = useLanguage();
  const { lists } = useLists();

  // Calculate statistics
  const getAllItems = () => lists.flatMap(list => list.items);
  const allItems = getAllItems();
  const completedItems = allItems.filter(item => item.completed);
  const pendingItems = allItems.filter(item => !item.completed);
  
  const completionRate = allItems.length > 0 ? (completedItems.length / allItems.length) * 100 : 0;
  
  // Weekly completion data
  const getWeeklyData = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const weekData = days.map(day => ({ day, completed: 0 }));
    
    completedItems.forEach(item => {
      const dayIndex = item.createdAt.getDay();
      weekData[dayIndex].completed++;
    });
    
    return weekData;
  };

  // Priority distribution
  const getPriorityData = () => {
    const priorities = { low: 0, medium: 0, high: 0 };
    
    allItems.forEach(item => {
      const priority = item.priority || 'medium';
      priorities[priority]++;
    });
    
    return [
      { name: 'Baixa', value: priorities.low, color: '#3b82f6' },
      { name: 'Média', value: priorities.medium, color: '#f59e0b' },
      { name: 'Alta', value: priorities.high, color: '#ef4444' }
    ];
  };

  // Productivity streaks
  const getCurrentStreak = () => {
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasCompletedTask = completedItems.some(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasCompletedTask) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Most productive time
  const getMostProductiveHour = () => {
    const hourCounts = new Array(24).fill(0);
    
    completedItems.forEach(item => {
      const hour = item.createdAt.getHours();
      hourCounts[hour]++;
    });
    
    const maxCount = Math.max(...hourCounts);
    const mostProductiveHour = hourCounts.indexOf(maxCount);
    
    return mostProductiveHour;
  };

  const weeklyData = getWeeklyData();
  const priorityData = getPriorityData();
  const currentStreak = getCurrentStreak();
  const mostProductiveHour = getMostProductiveHour();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{t('insights')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('productivityInsights')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{allItems.length}</div>
              <div className="text-sm text-muted-foreground">Total de Tarefas</div>
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{completionRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Taxa de Conclusão</div>
              <Progress value={completionRate} className="mt-2 h-2" />
            </Card>
            
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">{currentStreak}</div>
              <div className="text-sm text-muted-foreground">Sequência Atual</div>
              <div className="text-xs text-muted-foreground mt-1">dias consecutivos</div>
            </Card>
            
            <Card className="p-4 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{mostProductiveHour}:00</div>
              <div className="text-sm text-muted-foreground">Hora Mais Produtiva</div>
            </Card>
          </div>

          {/* Weekly Activity Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Atividade Semanal
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Bar dataKey="completed" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Priority Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição por Prioridade</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {priorityData.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">{entry.name}: {entry.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Productivity Tips */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Dicas de Produtividade</h3>
            <div className="space-y-3">
              {completionRate < 50 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    💡 Tente dividir tarefas grandes em subtarefas menores para aumentar sua taxa de conclusão.
                  </p>
                </div>
              )}
              
              {currentStreak === 0 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <p className="text-sm text-orange-700 dark:text-orange-300">
                    🔥 Comece uma nova sequência completando pelo menos uma tarefa hoje!
                  </p>
                </div>
              )}
              
              {pendingItems.length > 10 && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    📋 Você tem muitas tarefas pendentes. Considere priorizar as mais importantes.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
