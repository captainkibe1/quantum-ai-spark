
import { Share2 } from 'lucide-react';
import { useInstallPrompt } from './InstallPromptContext';

export function IOSInstructions() {
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
}

export function AndroidInstructions() {
  const { installPrompt } = useInstallPrompt();
  
  if (installPrompt) {
    return (
      <div className="flex-1">
        <p className="font-medium">Install QuantumAI on your device</p>
        <p className="text-sm opacity-80">Tap "Install Now" to add this app to your home screen</p>
      </div>
    );
  } 
  
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

export function DefaultInstructions() {
  return (
    <div className="flex-1">
      <p className="font-medium">Install QuantumAI on your device</p>
      <p className="text-sm opacity-80">Use our app for a better experience and offline access</p>
    </div>
  );
}
