
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
      
      // Check if there's an update and notify
      registration.addEventListener('updatefound', () => {
        // A new service worker is being installed
        const newWorker = registration.installing;
        console.log('Service worker update found and installing');
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available, please refresh.');
              // We can show a toast notification here in the future
            }
          });
        }
      });
      
    } catch (err) {
      console.error('ServiceWorker registration failed: ', err);
    }
  });
  
  // Handle service worker updates
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    console.log('Controller changed, refreshing page');
    window.location.reload();
  });
}

createRoot(document.getElementById("root")!).render(<App />);
