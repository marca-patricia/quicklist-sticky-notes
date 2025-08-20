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
    try {
      // Monitor Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
            const renderTime = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
            
            setMetrics(prev => ({
              ...prev,
              loadTime: isNaN(loadTime) ? 0 : loadTime,
              renderTime: isNaN(renderTime) ? 0 : renderTime
            }));
          }
        });
      });

      observer.observe({ entryTypes: ['navigation'] });

      // Memory usage (if available)
      if ('memory' in performance) {
        const memInfo = (performance as any).memory;
        if (memInfo && memInfo.usedJSHeapSize) {
          setMetrics(prev => ({
            ...prev,
            memoryUsage: memInfo.usedJSHeapSize / 1048576 // Convert to MB
          }));
        }
      }

      return () => observer.disconnect();
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }, []);

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (!metrics || (!metrics.loadTime && !metrics.renderTime && !metrics.memoryUsage)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-card border rounded-lg p-2 text-xs text-muted-foreground z-50 max-w-xs">
      <div className="font-medium mb-1">Performance</div>
      {metrics.loadTime > 0 && <div>Load: {metrics.loadTime.toFixed(2)}ms</div>}
      {metrics.renderTime > 0 && <div>Render: {metrics.renderTime.toFixed(2)}ms</div>}
      {metrics.memoryUsage && metrics.memoryUsage > 0 && (
        <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
      )}
    </div>
  );
};