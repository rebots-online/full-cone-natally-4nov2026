import { initializeInteractionAnalytics } from './services/interactionAnalytics';

type EntryExperience = 'app' | 'landing';

const envString = (key: string, fallback: string): string => {
  const value = import.meta.env[key];
  return typeof value === 'string' && value ? value : fallback;
};

const APP_PATH = envString('VITE_APP_PATH', '/app.html');
const LANDING_PATH = envString('VITE_LANDING_PATH', '/landing');
const LANDING_PATH_ALIAS = envString('VITE_LANDING_PATH_ALIAS', '/landing.html');
const LANDING_MOUNT_ID = 'marketing-experience-root';

export function resolveEntryExperience(
  pathname: string,
  search: URLSearchParams,
  native: boolean,
  authState: 'unresolved' | 'anonymous' | 'authenticated',
): 'app' | 'landing' {
  if (native) return 'app';
  if (pathname === APP_PATH) return 'app';
  if (search.get('app') === '1') return 'app';
  const offer = search.get('offer');
  if (offer === 'reading' || offer === 'conversation') return 'app';
  if (pathname === LANDING_PATH || pathname === LANDING_PATH_ALIAS) return 'landing';
  return authState === 'authenticated' ? 'app' : 'landing';
}

const isNative = typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
const entryParams = new URLSearchParams(window.location.search);
const isBareDomainDocument = window.location.pathname === '/' || window.location.pathname === '/index.html';

let mountedExperience: EntryExperience | null = null;
let pendingExperience: EntryExperience | null = null;
let mountedAppRoot: { unmount(): void } | null = null;
let renderSequence = 0;

function teardownMountedExperience(): void {
  if (mountedAppRoot) {
    mountedAppRoot.unmount();
    mountedAppRoot = null;
  }
  document.getElementById(LANDING_MOUNT_ID)?.remove();
  mountedExperience = null;
}

async function renderAppDocument(sequence: number): Promise<void> {
  try {
    const [reactDom, appModule, purchaseAccess, voiceDownloadStatus, buildStamp] = await Promise.all([
      import('react-dom/client'),
      import('./App.tsx'),
      import('./components/PurchaseAccess'),
      import('./components/VoiceDownloadStatus'),
      import('./components/BuildStamp'),
      import('./index.css'),
    ]);
    if (sequence !== renderSequence) return;
    const { createRoot } = reactDom;
    const { default: App } = appModule;
    const { PurchaseAccessProvider } = purchaseAccess;
    const { VoiceDownloadStatus } = voiceDownloadStatus;
    const { BuildStamp } = buildStamp;
    const root = createRoot(document.getElementById('root')!);
    mountedAppRoot = root;
    root.render(
      <PurchaseAccessProvider>
        <App />
        <VoiceDownloadStatus />
        <BuildStamp />
      </PurchaseAccessProvider>,
    );
    try { initializeInteractionAnalytics('app'); }
    catch { console.error('Interaction analytics initialization failed (VITE_GA_MEASUREMENT_ID).'); }
  } catch (err) {
    if (sequence === renderSequence) {
      const root = document.getElementById('root');
      if (root) {
        root.textContent = 'Failed to load the app. ';
        const link = document.createElement('a');
        link.href = window.location.href;
        link.textContent = 'Reload';
        root.appendChild(link);
      }
    }
    console.error(err);
  }
}

async function renderLandingExperience(sequence: number): Promise<void> {
  try {
    // The unified document carries only #root; the landing experience mounts
    // into its own element, which the dispatcher owns and creates here.
    if (!document.getElementById(LANDING_MOUNT_ID)) {
      const landingHost = document.createElement('div');
      landingHost.id = LANDING_MOUNT_ID;
      document.body.appendChild(landingHost);
    }
    await import('./marketing.tsx');
    if (sequence !== renderSequence) {
      document.getElementById(LANDING_MOUNT_ID)?.remove();
    }
  } catch (err) {
    console.error(err);
    if (sequence === renderSequence) {
      const host = document.getElementById(LANDING_MOUNT_ID) ?? document.body;
      host.textContent = 'Failed to load the landing page. ';
      const link = document.createElement('a');
      link.href = window.location.href;
      link.textContent = 'Reload';
      host.appendChild(link);
    }
  }
}

async function renderEntryExperience(experience: EntryExperience): Promise<void> {
  // A landing render can still be awaiting its dynamic import when the auth
  // listener re-resolves the same experience; re-entering would tear down the
  // mount the in-flight bootstrap already rendered into. Same-experience
  // re-entry is a no-op whether mounted or pending.
  if (experience === mountedExperience || experience === pendingExperience) return;
  pendingExperience = experience;
  const sequence = ++renderSequence;
  teardownMountedExperience();
  try {
    if (experience === 'app') await renderAppDocument(sequence);
    else await renderLandingExperience(sequence);
    if (sequence === renderSequence) mountedExperience = experience;
  } finally {
    if (pendingExperience === experience) pendingExperience = null;
  }
}

void renderEntryExperience(resolveEntryExperience(window.location.pathname, entryParams, isNative, 'unresolved'));

if (!isNative && isBareDomainDocument) {
  void (async () => {
    try {
      const [{ auth }, { onAuthStateChanged }] = await Promise.all([
        import('./services/firebase'),
        import('firebase/auth'),
      ]);
      onAuthStateChanged(auth, (user) => {
        void renderEntryExperience(resolveEntryExperience(
          window.location.pathname,
          new URLSearchParams(window.location.search),
          isNative,
          user ? 'authenticated' : 'anonymous',
        ));
      });
    } catch (error) {
      console.error('Firebase auth resolution failed for the bare-domain entry dispatch.', error);
    }
  })();
}
