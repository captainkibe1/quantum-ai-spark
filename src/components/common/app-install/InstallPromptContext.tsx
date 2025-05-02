
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Declare the BeforeInstallPromptEvent interface
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Add MSStream to Window interface
declare global {
  interface Window {
    MSStream?: any;
  }
}

interface InstallPromptContextType {
  installPrompt: BeforeInstallPromptEvent | null;
  isIOS: boolean;
  isAndroid: boolean;
  isStandalone: boolean;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  dismissBanner: () => void;
  resetBannerDismissal: () => void;
  installApp: () => Promise<void>;
}

const InstallPromptContext = createContext<InstallPromptContextType | undefined>(undefined);

export function InstallPromptProvider({ children }: { children: ReactNode }) {
  const [showBanner, setShowBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is already installed or running in standalone mode
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(isAppInstalled);
    
    // Check if the user has dismissed the banner before
    const bannerDismissed = localStorage.getItem('app-install-banner-dismissed') === 'true';
    const lastDismissed = parseInt(localStorage.getItem('app-install-banner-dismissed-time') || '0', 10);
    const daysSinceDismissed = (Date.now() - lastDismissed) / (1000 * 60 * 60 * 24);
    const showAgain = daysSinceDismissed > 7; // Show again after a week
    
    // Detect iOS and Android
    const ua = navigator.userAgent.toLowerCase();
    // Updated iOS detection to avoid TypeScript error
    const iOS = /iphone|ipad|ipod/.test(ua) && !(window.MSStream);
    const android = /android/.test(ua);
    
    setIsIOS(iOS);
    setIsAndroid(android);
    
    if (!isAppInstalled && (!bannerDismissed || showAgain)) {
      // Handle beforeinstallprompt for Android and desktop
      const handleBeforeInstallPrompt = (e: Event) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPrompt(e as BeforeInstallPromptEvent);
        // Show the banner
        setShowBanner(true);
        console.log('Before install prompt captured');
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      // Show banner for iOS even without the install prompt
      // as iOS doesn't support beforeinstallprompt
      if (iOS) {
        setShowBanner(true);
        console.log('iOS device detected, showing install banner');
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('app-install-banner-dismissed', 'true');
    localStorage.setItem('app-install-banner-dismissed-time', Date.now().toString());
    console.log('Banner dismissed and preference saved');
  };

  const resetBannerDismissal = () => {
    localStorage.removeItem('app-install-banner-dismissed');
    localStorage.removeItem('app-install-banner-dismissed-time');
    setShowBanner(true);
    console.log('Install banner preferences reset');
    toast({
      title: "Install banner reset",
      description: "You'll now see the install prompt again"
    });
  };

  const installApp = async () => {
    if (!installPrompt) {
      console.log('No install prompt available');
      
      // Check if it's Android but no prompt available yet
      if (isAndroid) {
        toast({
          title: "Installation tip",
          description: "Look for 'Install App' or 'Add to Home Screen' in your browser's menu",
        });
      } else {
        toast({
          title: "Installation not available",
          description: "Please use your browser's menu to install the app",
          variant: "destructive"
        });
      }
      return;
    }
    
    console.log('Attempting to show install prompt');
    try {
      // Show initial toast
      toast({
        title: "Starting installation",
        description: "Please follow the browser prompts to install QuantumAI"
      });
      
      // Show the install prompt
      await installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;
      console.log(`User choice outcome: ${outcome}`);
      
      // We no longer need the prompt regardless of outcome
      setInstallPrompt(null);
      
      // Update toast based on user's choice
      if (outcome === 'accepted') {
        toast({
          title: "Installation successful",
          description: "QuantumAI was successfully added to your device!"
        });
        setShowBanner(false);
      } else {
        toast({
          title: "Installation cancelled",
          description: "You can install the app later from the banner",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during installation:', error);
      toast({
        title: "Installation failed",
        description: "There was a problem installing the app. Please try again later.",
        variant: "destructive"
      });
    }
  };

  return (
    <InstallPromptContext.Provider
      value={{
        installPrompt,
        isIOS,
        isAndroid,
        isStandalone,
        showBanner,
        setShowBanner,
        dismissBanner,
        resetBannerDismissal,
        installApp,
      }}
    >
      {children}
    </InstallPromptContext.Provider>
  );
}

export function useInstallPrompt() {
  const context = useContext(InstallPromptContext);
  if (context === undefined) {
    throw new Error('useInstallPrompt must be used within an InstallPromptProvider');
  }
  return context;
}
