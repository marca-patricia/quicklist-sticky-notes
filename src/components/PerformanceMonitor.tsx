import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          setMetrics(prev => ({
            ...prev,
            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
            renderTime: navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['navigation'] });

    // Memory usage (if available)
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memInfo.usedJSHeapSize / 1048576 // Convert to MB
      }));
    }

    return () => observer.disconnect();
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border rounded-lg p-2 text-xs text-muted-foreground z-50 max-w-xs">
      <div className="font-medium mb-1">{t('performance')}</div>
      <div>Load: {metrics.loadTime.toFixed(2)}ms</div>
      <div>Render: {metrics.renderTime.toFixed(2)}ms</div>
      {metrics.memoryUsage && (
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      )}
    </div>
  );
};