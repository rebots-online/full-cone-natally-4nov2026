import { initializeInteractionAnalytics } from './services/interactionAnalytics';

const isNative = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const params = new URLSearchParams(window.location.search);
const hasAppEntry = params.get('app') === '1';
const offer = params.get('offer');
const hasValidOffer = offer === 'reading' || offer === 'conversation';
const isAppDocument = window.location.pathname === '/app.html';

if (!isAppDocument && !isNative) {
  const destination = new URL(window.location.href);
  destination.pathname = hasAppEntry || hasValidOffer ? '/app.html' : '/marketing.html';
  window.location.replace(destination.href);
} else {
  Promise.all([
    import('react-dom/client'),
    import('./App.tsx'),
    import('./components/PurchaseAccess'),
    import('./components/VoiceDownloadStatus'),
    import('./components/BuildStamp'),
    import('./index.css'),
  ])
    .then(([{ createRoot }, { default: App }, { PurchaseAccessProvider }, { VoiceDownloadStatus }, { BuildStamp }, ,]) => {
      createRoot(document.getElementById('root')!).render(
        <PurchaseAccessProvider>
          <App />
          <VoiceDownloadStatus />
          <BuildStamp />
        </PurchaseAccessProvider>,
      );
      try { initializeInteractionAnalytics('app'); }
      catch { console.error('Interaction analytics initialization failed (VITE_GA_MEASUREMENT_ID).'); }
    })
    .catch((err) => {
      const root = document.getElementById('root');
      if (root) {
        root.textContent = 'Failed to load the app. ';
        const link = document.createElement('a');
        link.href = window.location.href;
        link.textContent = 'Reload';
        root.appendChild(link);
      }
      console.error(err);
    });
}
