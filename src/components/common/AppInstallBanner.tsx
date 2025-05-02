import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Info, Share2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { InstallPromptProvider } from './app-install/InstallPromptContext';

// Declare the BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Add MSStream to Window interface
declare global {
  interface Window {
    MSStream?: any;
  }
}

// Component that actually uses the context
function AppInstallBannerInner() {
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
      return;
    }
    
    console.log('Attempting to show install prompt');
    try {
      // Show the install prompt
      await installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await installPrompt.userChoice;
      console.log(`User choice outcome: ${outcome}`);
      
      // We no longer need the prompt regardless of outcome
      setInstallPrompt(null);
      
      // Hide the banner if the app was installed
      if (outcome === 'accepted') {
        setShowBanner(false);
        toast({
          title: "Installation started",
          description: "QuantumAI is being installed on your device"
        });
      }
    } catch (error) {
      console.error('Error during installation:', error);
      toast({
        title: "Installation error",
        description: "There was a problem installing the app",
        variant: "destructive"
      });
    }
  };

  const showIOSInstructions = () => {
    return (
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your iOS device</p>
        <ol className="text-sm opacity-80 list-decimal pl-5 mt-1">
          <li>Tap <Share2 className="inline-block h-4 w-4" /> Share icon in Safari</li>
          <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
          <li>Tap <strong>Add</strong> in the top right corner</li>
        </ol>
      </div>
    );
  };
  
  const showAndroidInstructions = () => {
    if (installPrompt) {
      return (
        <div className="flex-1">
          <p className="font-medium">Install QuantumAI on your device</p>
          <p className="text-sm opacity-80">Tap "Install Now" to add this app to your home screen</p>
        </div>
      );
    } else {
      return (
        <div className="flex-1">
          <p className="font-medium">Install QuantumAI on your Android device</p>
          <ol className="text-sm opacity-80 list-decimal pl-5 mt-1">
            <li>Tap menu icon <span className="inline-block">⋮</span> in Chrome</li>
            <li>Select <strong>Install App</strong> or <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Install</strong> when prompted</li>
          </ol>
        </div>
      );
    }
  };

  const showDefaultInstructions = () => {
    return (
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your device</p>
        <p className="text-sm opacity-80">Use our app for a better experience and offline access</p>
      </div>
    );
  };

  // If already in standalone mode, don't show any banner
  if (isStandalone) {
    return null;
  }

  if (!showBanner) {
    // Show a small button to reset banner dismissal
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button variant="outline" size="sm" className="rounded-full p-2" onClick={resetBannerDismissal} title="Install app">
          <Download className="h-4 w-4" />
          <span className="sr-only">Show install options</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-primary text-primary-foreground p-4 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
      {isIOS ? showIOSInstructions() : 
       isAndroid ? showAndroidInstructions() : 
       showDefaultInstructions()}
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="border-primary-foreground/20 hover:bg-primary-foreground/10" onClick={dismissBanner}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
        {installPrompt && (
          <Button variant="secondary" onClick={installApp}>
            <Download className="mr-1 h-4 w-4" />
            Install Now
          </Button>
        )}
        {(!installPrompt && !isIOS && isAndroid) && (
          <Button variant="secondary" onClick={() => {
            toast({
              title: "Installation tip",
              description: "Look for 'Install App' in your browser's menu"
            });
          }}>
            <Info className="mr-1 h-4 w-4" />
            How to Install
          </Button>
        )}
      </div>
    </div>
  );
}

// Wrapper component that provides the context
const AppInstallBanner = () => (
  <InstallPromptProvider>
    <AppInstallBannerInner />
  </InstallPromptProvider>
);

export default AppInstallBanner;
