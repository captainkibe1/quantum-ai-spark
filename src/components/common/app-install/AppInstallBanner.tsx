
import { useInstallPrompt, InstallPromptProvider } from './InstallPromptContext';
import { IOSInstructions, AndroidInstructions, DefaultInstructions } from './InstallInstructions';
import { InstallButtons, InstallResetButton } from './InstallButtons';

function AppInstallBannerContent() {
  const { isIOS, isAndroid, showBanner, isStandalone } = useInstallPrompt();

  // If already in standalone mode, don't show any banner
  if (isStandalone) {
    return null;
  }

  if (!showBanner) {
    return <InstallResetButton />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between bg-primary text-primary-foreground p-4 shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5">
      {isIOS ? <IOSInstructions /> : 
       isAndroid ? <AndroidInstructions /> : 
       <DefaultInstructions />}
      
      <InstallButtons />
    </div>
  );
}

// Export the wrapped component with context
const AppInstallBanner = () => (
  <InstallPromptProvider>
    <AppInstallBannerContent />
  </InstallPromptProvider>
);

export default AppInstallBanner;
