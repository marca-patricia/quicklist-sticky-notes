
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdOptions, RewardAdOptions } from '@capacitor-community/admob';
import { useEffect, useState } from 'react';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // IDs de teste - SUBSTITUA pelos seus IDs reais do AdMob
  const AD_UNIT_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111', // ID de teste
    interstitial: 'ca-app-pub-3940256099942544/1033173712', // ID de teste
    reward: 'ca-app-pub-3940256099942544/5224354917' // ID de teste
  };

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        requestTrackingAuthorization: true,
        testingDevices: ['YOUR_DEVICE_ID'], // Adicione seu device ID para testes
        initializeForTesting: true
      });
      setIsInitialized(true);
      console.log('AdMob inicializado com sucesso!');
    } catch (error) {
      console.error('Erro ao inicializar AdMob:', error);
    }
  };

  const showBannerAd = async () => {
    if (!isInitialized) return;
    
    try {
      const options: BannerAdOptions = {
        adId: AD_UNIT_IDS.banner,
        adSize: BannerAdSize.BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true // Mude para false em produção
      };
      
      await AdMob.showBanner(options);
      console.log('Banner exibido!');
    } catch (error) {
      console.error('Erro ao exibir banner:', error);
    }
  };

  const hideBannerAd = async () => {
    try {
      await AdMob.hideBanner();
    } catch (error) {
      console.error('Erro ao esconder banner:', error);
    }
  };

  const showInterstitialAd = async () => {
    if (!isInitialized) return;

    try {
      const options: InterstitialAdOptions = {
        adId: AD_UNIT_IDS.interstitial,
        isTesting: true // Mude para false em produção
      };

      await AdMob.prepareInterstitial(options);
      await AdMob.showInterstitial();
      console.log('Intersticial exibido!');
    } catch (error) {
      console.error('Erro ao exibir intersticial:', error);
    }
  };

  const showRewardAd = async () => {
    if (!isInitialized) return;

    try {
      const options: RewardAdOptions = {
        adId: AD_UNIT_IDS.reward,
        isTesting: true // Mude para false em produção
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      
      if (result.rewarded) {
        console.log('Usuário ganhou recompensa!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao exibir anúncio de recompensa:', error);
      return false;
    }
  };

  useEffect(() => {
    initializeAdMob();
  }, []);

  return {
    isInitialized,
    showBannerAd,
    hideBannerAd,
    showInterstitialAd,
    showRewardAd
  };
};
