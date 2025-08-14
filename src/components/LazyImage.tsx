import React, { useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  wrapperClassName?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  wrapperClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { elementRef, isInView } = useIntersectionObserver({ triggerOnce: true });

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  return (
    <div 
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', wrapperClassName)}
    >
      {isInView && (
        <>
          {!isLoaded && !hasError && (
            <div 
              className={cn(
                'absolute inset-0 skeleton',
                className
              )}
              aria-label="Loading image"
            />
          )}
          
          {hasError ? (
            <div 
              className={cn(
                'flex items-center justify-center bg-muted text-muted-foreground',
                className
              )}
              role="img"
              aria-label={`Failed to load: ${alt}`}
            >
              <span className="text-xs">Image not available</span>
            </div>
          ) : (
            <img
              src={src}
              alt={alt}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0',
                className
              )}
              loading="lazy"
              decoding="async"
              {...props}
            />
          )}
        </>
      )}
    </div>
  );
};