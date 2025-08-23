import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Activity, Users, TrendingUp, Globe, Smartphone, Clock } from 'lucide-react';

interface AnalyticsData {
  pageViews: number;
  uniqueUsers: number;
  avgSessionTime: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  deviceTypes: Array<{ type: string; percentage: number }>;
  countries: Array<{ country: string; users: number }>;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    collectAnalytics();
  }, [timeRange]);

  const collectAnalytics = () => {
    try {
      setError(null);
      // Simulate analytics data collection
      // In a real app, this would connect to analytics service
      const mockData: AnalyticsData = {
        pageViews: Math.floor(Math.random() * 10000) + 1000,
        uniqueUsers: Math.floor(Math.random() * 5000) + 500,
        avgSessionTime: Math.floor(Math.random() * 300) + 120, // seconds
        bounceRate: Math.floor(Math.random() * 30) + 20, // percentage
        topPages: [
          { path: '/', views: 450 },
          { path: '/sticky-notes', views: 320 },
          { path: '/statistics', views: 180 },
          { path: '/templates', views: 120 },
          { path: '/achievements', views: 80 }
        ],
        deviceTypes: [
          { type: 'Mobile', percentage: 65 },
          { type: 'Desktop', percentage: 30 },
          { type: 'Tablet', percentage: 5 }
        ],
        countries: [
          { country: 'Brasil', users: 1200 },
          { country: 'Portugal', users: 300 },
          { country: 'Estados Unidos', users: 250 },
          { country: 'Espanha', users: 180 },
          { country: 'Outros', users: 470 }
        ]
      };

      setAnalytics(mockData);
    } catch (err) {
      console.error('Error collecting analytics:', err);
      setError('Failed to load analytics data');
    }
  };

  const formatTime = (seconds: number) => {
    try {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.warn('Error formatting time:', error);
      return '0:00';
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={collectAnalytics} variant="outline" size="sm">
          {t('tryAgain') || 'Try Again'}
        </Button>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        <Button
          variant={timeRange === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('7d')}
        >
          {t('last7Days')}
        </Button>
        <Button
          variant={timeRange === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('30d')}
        >
          {t('last30Days')}
        </Button>
        <Button
          variant={timeRange === '90d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setTimeRange('90d')}
        >
          {t('last90Days')}
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pageViews')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pageViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('uniqueUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.uniqueUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgSessionTime')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTime(analytics.avgSessionTime)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('bounceRate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.bounceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">{t('topPages')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.topPages.map((page, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground truncate">
                  {page.path === '/' ? t('home') : page.path.slice(1)}
                </span>
                <Badge variant="outline">{page.views}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              {t('deviceTypes')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.deviceTypes.map((device, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{device.type}</span>
                <Badge variant="outline">{device.percentage}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Countries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              {t('topCountries')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {analytics.countries.map((country, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{country.country}</span>
                <Badge variant="outline">{country.users}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};