export {};

const isNative = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const params = new URLSearchParams(window.location.search);
const hasAppEntry = params.get('app') === '1';
const offer = params.get('offer');
const hasValidOffer = offer === 'reading' || offer === 'conversation';

if (!isNative && !hasAppEntry && !hasValidOffer) {
  window.location.replace('/marketing.html');
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
