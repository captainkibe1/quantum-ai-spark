
import { Button } from '@/components/ui/button';
import { X, Download, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useInstallPrompt } from './InstallPromptContext';

export function InstallButtons() {
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
