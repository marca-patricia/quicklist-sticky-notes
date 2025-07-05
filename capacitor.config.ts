
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.quicklist',
  appName: 'QuickList',
  webDir: 'dist',
  bundledWebRuntime: false,
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#8B5CF6",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "LIGHT_CONTENT",
      backgroundColor: "#8B5CF6"
    },
    App: {
      appendUserAgent: "QuickList/1.0"
    },
    AdMob: {
      appId: "ca-app-pub-8706315446837033~1234567890", // Você precisa obter o App ID completo no AdMob
      testingDevices: [] // Removido para produção
    }
  }
};

export default config;
