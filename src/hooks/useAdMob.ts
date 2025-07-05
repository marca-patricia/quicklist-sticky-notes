
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, InterstitialAdPluginOptions, RewardAdOptions } from '@capacitor-community/admob';
import { useEffect, useState } from 'react';

export const useAdMob = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Seus IDs reais do AdMob
  const AD_UNIT_IDS = {
    banner: 'ca-app-pub-8706315446837033/9648930704', // Banner ID
    interstitial: 'ca-app-pub-8706315446837033/9212966379', // Intersticial ID
    reward: 'ca-app-pub-8706315446837033/1061377136' // Reward ID
  };

  const initializeAdMob = async () => {
    try {
      await AdMob.initialize({
        testingDevices: [], // Remove IDs de teste para produção
        initializeForTesting: false // Mudado para produção
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
        isTesting: false // Produção
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
      const options: InterstitialAdPluginOptions = {
        adId: AD_UNIT_IDS.interstitial,
        isTesting: false // Produção
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
        isTesting: false // Produção
      };

      await AdMob.prepareRewardVideoAd(options);
      const result = await AdMob.showRewardVideoAd();
      
      if (result && result.rewarded) {
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
