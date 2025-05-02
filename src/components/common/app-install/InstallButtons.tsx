
import { Button } from '@/components/ui/button';
import { X, Download, Info, Sticker } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInstallPrompt } from './InstallPromptContext';

export function InstallButtons({ variant = "default" }) {
  const { installPrompt, dismissBanner, installApp, isIOS, isAndroid } = useInstallPrompt();

  return (
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
  );
}

export function InstallResetButton() {
  const { resetBannerDismissal } = useInstallPrompt();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button 
        variant="outline" 
        size="sm" 
        className="rounded-full p-2" 
        onClick={resetBannerDismissal} 
        title="Install app"
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Show install options</span>
      </Button>
    </div>
  );
}

// New component for the download buttons in the main page section
export function MainPageDownloadButtons() {
  const { installPrompt, installApp, isIOS, isAndroid, resetBannerDismissal } = useInstallPrompt();

  const handleAndroidClick = () => {
    if (installPrompt) {
      installApp();
    } else {
      toast({
        title: "Installation tip",
        description: "Look for 'Install App' or 'Add to Home Screen' in your browser's menu"
      });
    }
  };

  const handleIOSClick = () => {
    toast({
      title: "iOS Installation",
      description: "Tap the Share icon in Safari, then 'Add to Home Screen'"
    });
  };

  const handleGenericClick = () => {
    if (installPrompt) {
      installApp();
    } else {
      resetBannerDismissal();
      toast({
        title: "Installation",
        description: "Check the banner at the bottom of the screen for installation instructions"
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {isAndroid && (
        <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAndroidClick}>
          <Sticker className="mr-2 h-5 w-5" />
          Download for Android
        </Button>
      )}
      
      {isIOS && (
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleIOSClick}>
          <Sticker className="mr-2 h-5 w-5" />
          Download for iOS
        </Button>
      )}
      
      {(!isAndroid && !isIOS) && (
        <Button size="lg" className="text-white" onClick={handleGenericClick}>
          <Download className="mr-2 h-5 w-5" />
          Download App
        </Button>
      )}
    </div>
  );
}
