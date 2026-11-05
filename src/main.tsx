import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PurchaseAccessProvider } from './components/PurchaseAccess';
import { VoiceDownloadStatus } from './components/VoiceDownloadStatus';
import './index.css';

createRoot(document.getElementById('root')!).render(<PurchaseAccessProvider><App /><VoiceDownloadStatus /></PurchaseAccessProvider>);
