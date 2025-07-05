
import React, { useEffect } from 'react';
import { useAdMob } from '@/hooks/useAdMob';

interface AdBannerProps {
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ className = '' }) => {
  const { isInitialized, showBannerAd } = useAdMob();

  useEffect(() => {
    if (isInitialized) {
      // Pequeno delay para garantir que a tela carregou
      const timer = setTimeout(() => {
        showBannerAd();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isInitialized, showBannerAd]);

  return (
    <div className={`w-full h-16 ${className}`}>
      {/* Espaço reservado para o banner - o AdMob vai sobrepor aqui */}
      <div className="w-full h-full bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
        {isInitialized ? 'Carregando anúncio...' : 'Publicidade'}
      </div>
    </div>
  );
};
