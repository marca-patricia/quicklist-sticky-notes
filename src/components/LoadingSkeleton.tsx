import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div 
      className={`animate-pulse bg-muted rounded-md ${className}`}
      role="status"
      aria-label="Carregando..."
    />
  );
};

export const ListCardSkeleton: React.FC = () => {
  return (
    <div className="relative group">
      
      <div className="transform rotate-1 shadow-xl min-h-[180px] p-4 bg-yellow-200 relative">
        {/* Post-it corner fold */}
        <div 
          className="absolute bottom-0 right-0 w-8 h-8 opacity-20"
          style={{
            background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.1) 50%)`,
            clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)'
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