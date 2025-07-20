
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.58c97e5ff70c4a3ba3346edbe11d9aa3',
  appName: 'quicklist-sticky-notes',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://58c97e5f-f70c-4a3b-a334-6edbe11d9aa3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#B674ED",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "LIGHT_CONTENT",
      backgroundColor: "#B674ED"
    },
    App: {
      appendUserAgent: "QuickList/1.0"
    }
  }
};

export default config;
