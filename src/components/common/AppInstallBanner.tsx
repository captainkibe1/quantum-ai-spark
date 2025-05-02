
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, Info } from 'lucide-react';

const AppInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if the user has dismissed the banner before
    const bannerDismissed = localStorage.getItem('app-install-banner-dismissed') === 'true';
    
    // Detect iOS and Android
    const ua = navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    const android = /Android/.test(ua);
    
    setIsIOS(iOS);
    setIsAndroid(android);
    
    if (!isAppInstalled && !bannerDismissed) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPrompt(e);
        // Show the banner
        setShowBanner(true);
      });
      
      // Show banner for iOS even without the install prompt
      // as iOS doesn't support beforeinstallprompt
      if (iOS) {
        setShowBanner(true);
      }
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
    };
  }, []);

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('app-install-banner-dismissed', 'true');
  };

  const installApp = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    
    // We no longer need the prompt regardless of outcome
    setInstallPrompt(null);
    
    // Hide the banner if the app was installed
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
  };

  const showIOSInstructions = () => {
    return (
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your iOS device</p>
        <p className="text-sm opacity-80">
          1. Tap <strong>Share</strong> <span className="inline-block">⎙</span> icon
          <br/>
          2. Scroll down and tap <strong>Add to Home Screen</strong>
        </p>
      </div>
    );
  };
  
  const showAndroidInstructions = () => {
    if (installPrompt) {
      return (
        <div className="flex-1">
          <p className="font-medium">Install QuantumAI on your device</p>
          <p className="text-sm opacity-80">Use our app for a better experience</p>
        </div>
      );
    } else {
      return (
        <div className="flex-1">
          <p className="font-medium">Install QuantumAI on your Android device</p>
          <p className="text-sm opacity-80">
            1. Tap menu icon in Chrome <span className="inline-block">⋮</span>
            <br/>
            2. Select <strong>Install App</strong> or <strong>Add to Home Screen</strong>
          </p>
        </div>
      );
    }
  };

  const showDefaultInstructions = () => {
    return (
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your device</p>
        <p className="text-sm opacity-80">Use our app for a better experience</p>
      </div>
    );
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-primary text-primary-foreground p-4 shadow-lg z-50">
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
        {(!installPrompt && !isIOS) && (
          <Button variant="secondary" onClick={() => window.open('https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing', '_blank')}>
            <Info className="mr-1 h-4 w-4" />
            How to Install
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppInstallBanner;
