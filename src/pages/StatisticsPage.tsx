import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLists } from '@/contexts/ListsContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Circle, List, Target, TrendingUp, Calendar, Clock, Award } from 'lucide-react';
import { EnhancedEmptyState } from '@/components/EnhancedEmptyState';
import { BreadcrumbNav } from '@/components/BreadcrumbNav';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { NativeFeatures } from '@/components/NativeFeatures';
import { AdvancedSyncManager } from '@/components/AdvancedSyncManager';
import { useSEO } from '@/hooks/useSEO';
import { format, startOfWeek, endOfWeek, isWithinInterval, subWeeks } from 'date-fns';
import { ptBR, enUS } from 'date-fns/locale';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import { ThemeToggle } from '@/components/ThemeToggle';

export const StatisticsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const { lists } = useLists();
  const navigate = useNavigate();
  
  // SEO optimization
  useSEO({
    title: `${t('statistics')} - QuickList`,
    description: t('statisticsPageDesc'),
    keywords: 'estatísticas, analytics, dashboard, produtividade, métricas'
  });
  const locale = language === 'pt' ? ptBR : enUS;

  // Calculate statistics
  const allItems = lists.flatMap(list => list.items);
  const completedItems = allItems.filter(item => item.completed);
  const totalTasks = allItems.length;
  const completedTasks = completedItems.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Calculate weekly stats
  const now = new Date();
  const currentWeekStart = startOfWeek(now, { locale });
  const currentWeekEnd = endOfWeek(now, { locale });
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { locale });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { locale });

  const thisWeekCompleted = completedItems.filter(item => 
    isWithinInterval(new Date(item.createdAt), { start: currentWeekStart, end: currentWeekEnd })
  ).length;

  const lastWeekCompleted = completedItems.filter(item => 
    isWithinInterval(new Date(item.createdAt), { start: lastWeekStart, end: lastWeekEnd })
  ).length;

  // Calculate productivity trend
  const productivityTrend = lastWeekCompleted > 0 
    ? Math.round(((thisWeekCompleted - lastWeekCompleted) / lastWeekCompleted) * 100)
    : thisWeekCompleted > 0 ? 100 : 0;

  // Calculate active lists
  const activeLists = lists.filter(list => !list.archived).length;
  const archivedLists = lists.filter(list => list.archived).length;

  // Calculate categories used
  const categoriesUsed = new Set(lists.flatMap(list => 
    (list.categories || []).map(cat => cat.id)
  )).size;

  // Calculate daily average (based on last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentCompleted = completedItems.filter(item => 
    new Date(item.createdAt) >= sevenDaysAgo
  ).length;
  
  const dailyAverage = Math.round(recentCompleted / 7 * 10) / 10;

  // Most productive day of week
  const dayStats = Array.from({ length: 7 }, (_, i) => {
    const dayName = language === 'pt' 
      ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i]
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
    
    const dayTasks = completedItems.filter(item => 
      new Date(item.createdAt).getDay() === i
    ).length;
    
    return { day: dayName, tasks: dayTasks };
  });

  const mostProductiveDay = dayStats.reduce((max, current) => 
    current.tasks > max.tasks ? current : max
  );

  const stats = [
    {
      title: language === 'pt' ? 'Total de Tarefas' : 'Total Tasks',
      value: totalTasks,
      icon: List,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: language === 'pt' ? 'Tarefas criadas' : 'Tasks created'
    },
    {
      title: language === 'pt' ? 'Tarefas Concluídas' : 'Completed Tasks',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: language === 'pt' ? 'Tarefas finalizadas' : 'Tasks finished'
    },
    {
      title: language === 'pt' ? 'Taxa de Conclusão' : 'Completion Rate',
      value: `${completionRate}%`,
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: language === 'pt' ? 'Eficiência geral' : 'Overall efficiency'
    },
    {
      title: language === 'pt' ? 'Listas Ativas' : 'Active Lists',
      value: activeLists,
      icon: Circle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      description: language === 'pt' ? 'Listas em uso' : 'Lists in use'
    },
    {
      title: language === 'pt' ? 'Esta Semana' : 'This Week',
      value: thisWeekCompleted,
      icon: Calendar,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      description: language === 'pt' ? 'Tarefas concluídas' : 'Tasks completed'
    },
    {
      title: language === 'pt' ? 'Média Diária' : 'Daily Average',
      value: dailyAverage,
      icon: Clock,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      description: language === 'pt' ? 'Últimos 7 dias' : 'Last 7 days'
    }
  ];

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
              <h1 className="text-2xl font-bold">
                {t('statistics')}
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              <LanguageSwitch />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t('overview')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('analytics')}</TabsTrigger>
            <TabsTrigger value="sync">{t('sync')}</TabsTrigger>
            <TabsTrigger value="tools">{t('tools')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-card rounded-xl p-6 border shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-foreground mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Productivity Trend */}
              <div className="bg-card rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  {language === 'pt' ? 'Tendência de Produtividade' : 'Productivity Trend'}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'pt' ? 'Esta semana' : 'This week'}
                    </span>
                    <span className="font-semibold">{thisWeekCompleted} {language === 'pt' ? 'tarefas' : 'tasks'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {language === 'pt' ? 'Semana passada' : 'Last week'}
                    </span>
                    <span className="font-semibold">{lastWeekCompleted} {language === 'pt' ? 'tarefas' : 'tasks'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">
                      {language === 'pt' ? 'Variação' : 'Change'}
                    </span>
                    <span className={`font-bold ${
                      productivityTrend > 0 ? 'text-green-600' : 
                      productivityTrend < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {productivityTrend > 0 ? '+' : ''}{productivityTrend}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Best Performance Day */}
              <div className="bg-card rounded-xl p-6 border">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {language === 'pt' ? 'Melhor Dia da Semana' : 'Best Day of Week'}
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {mostProductiveDay.day}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {mostProductiveDay.tasks} {language === 'pt' ? 'tarefas concluídas' : 'tasks completed'}
                  </p>
                  <div className="space-y-2">
                    {dayStats.map((day, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{day.day}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-primary rounded-full"
                            style={{ 
                              width: `${Math.max(day.tasks / Math.max(...dayStats.map(d => d.tasks)) * 100, 5)}px`,
                              minWidth: '5px'
                            }}
                          />
                          <span className="text-xs text-muted-foreground w-8 text-right">
                            {day.tasks}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="sync" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AdvancedSyncManager />
              <Card>
                <CardHeader>
                  <CardTitle>{t('dataManagement')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('dataManagementDesc')}
                  </p>
                  <NativeFeatures />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('appFeatures')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <NativeFeatures />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('systemInfo')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('userAgent')}</span>
                    <span className="text-xs font-mono truncate max-w-40">
                      {navigator.userAgent.split(' ')[0]}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('platform')}</span>
                    <span>{navigator.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('language')}</span>
                    <span>{navigator.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cookiesEnabled')}</span>
                    <span>{navigator.cookieEnabled ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('onlineStatus')}</span>
                    <span>{navigator.onLine ? t('online') : t('offline')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};