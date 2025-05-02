
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const AppInstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if the user has dismissed the banner before
    const bannerDismissed = localStorage.getItem('app-install-banner-dismissed') === 'true';
    
    if (!isAppInstalled && !bannerDismissed) {
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later
        setInstallPrompt(e);
        // Show the banner
        setShowBanner(true);
      });
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

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-primary text-primary-foreground p-4 shadow-lg z-50">
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your device</p>
        <p className="text-sm opacity-80">Use our app for a better experience</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="border-primary-foreground/20 hover:bg-primary-foreground/10" onClick={dismissBanner}>
          <X className="h-4 w-4" />
          <span className="sr-only">Dismiss</span>
        </Button>
        <Button variant="secondary" onClick={installApp}>Install Now</Button>
      </div>
    </div>
  );
};

export default AppInstallBanner;
