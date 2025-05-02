
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { useInstallPrompt, InstallPromptProvider } from './InstallPromptContext';

// This component uses the context and must be inside a provider
function InstallButtonInner({ 
  variant = "default", 
  size = "default", 
  className = "" 
}: { 
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const { 
    installPrompt, 
    isIOS, 
    isAndroid, 
    isStandalone,
    resetBannerDismissal,
    setShowBanner 
  } = useInstallPrompt();

  if (isStandalone) {
    return null; // Don't show the button if app is already installed
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    // If dialog is closed and no installation was performed, do nothing
    if (!newOpen) return;
  };

  const handleClick = () => {
    setOpen(true);
    // Reset banner dismissal if we're on iOS where we need to show instructions
    if (isIOS || (!installPrompt && isAndroid)) {
      resetBannerDismissal();
      setShowBanner(true);
    }
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={className} 
        onClick={handleClick} 
        title="Install app"
      >
        {size === "icon" ? (
          <Download className="h-5 w-5" />
        ) : (
          <>
            <Download className="mr-2 h-5 w-5" />
            Install App
          </>
        )}
      </Button>
      
      <InstallDialog open={open} setOpen={setOpen} />
    </>
  );
}

function InstallDialog({ 
  open, 
  setOpen 
}: { 
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { 
    installPrompt, 
    installApp,
    isIOS,
    isAndroid
  } = useInstallPrompt();

  const handleInstall = async () => {
    if (installPrompt) {
      await installApp();
    } else if (isIOS) {
      toast({
        title: "iOS Installation",
        description: "Check the banner at the bottom of the screen for iOS installation instructions"
      });
    } else if (isAndroid) {
      toast({
        title: "Android Installation",
        description: "Check the banner at the bottom of the screen for installation instructions"
      });
    } else {
      toast({
        title: "Installation",
        description: "Check your browser menu for installation options"
      });
    }
    setOpen(false);
  };

  const appIcon = "/lovable-uploads/829d1eea-1380-41fa-8297-04d3cc474261.png";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-zinc-900 text-white border-0 rounded-xl">
        <DialogTitle className="text-lg text-center">Install app</DialogTitle>
        
        <div className="flex items-center space-x-4 py-4">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <img 
              src={appIcon} 
              alt="QuantumAI" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium">QuantumAI</p>
            <p className="text-sm text-zinc-400">lovable.app</p>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center gap-2 mt-2">
          <Button 
            variant="default" 
            className="bg-green-700 hover:bg-green-800 text-white min-w-24 rounded-full"
            onClick={handleInstall}
          >
            Install
          </Button>
          
          <Button 
            variant="outline" 
            className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700 min-w-24 rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Export a wrapped version that already includes the provider
export function InstallButtonWithProvider({
  variant = "default",
  size = "default",
  className = ""
}: {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}) {
  return (
    <InstallPromptProvider>
      <InstallButtonInner variant={variant} size={size} className={className} />
    </InstallPromptProvider>
  );
}

// Do not use this directly - it will be removed in a future version
export function InstallButton(props: {
  variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}) {
  return <InstallButtonWithProvider {...props} />;
}
