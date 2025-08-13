import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className={`animate-pulse bg-muted rounded-md ${className}`}
      role="status"
      aria-label={t('loadingText')}
    />
  );
};

export const ListCardSkeleton: React.FC = () => {
  return (
    <div className="relative group">
      
      <div 
        className="transform rotate-1 min-h-[200px] p-6 m-3 relative rounded-lg"
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 30%, #f59e0b 100%)',
          boxShadow: '0 8px 25px -8px rgba(245, 158, 11, 0.4), 0 4px 12px -4px rgba(245, 158, 11, 0.3)',
          filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.15))',
          border: '1px solid rgba(0,0,0,0.08)',
        }}
      >
        {/* Sombra interna realista */}
        <div 
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.05)'
          }}
        ></div>

        {/* Post-it corner fold */}
        <div 
          className="absolute bottom-0 right-0 w-10 h-10 opacity-30 rounded-bl-lg pointer-events-none"
          style={{
            background: `linear-gradient(135deg, transparent 45%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.08) 55%, transparent 60%)`,
            clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)',
            filter: 'blur(0.5px)'
          }}
        ></div>
        
        <div className="flex justify-between items-start mb-3">
          <Skeleton className="h-6 w-32" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
};

export const AddListFormSkeleton: React.FC = () => {
  return (
    <div className="flex gap-2">
      <Skeleton className="flex-1 h-10" />
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-10 w-24" />
    </div>
  );
};

export const AchievementsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-3" />
          <Skeleton className="h-2 w-full rounded-full mb-2" />
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
};