import { APP_NAME } from '../services/appIdentity';
import { initializeApp } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, browserPopupRedirectResolver, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import config from '../../firebase-applet-config.json';

const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const status = element('status');
const google = element<HTMLButtonElement>('google');
const phone = element<HTMLFormElement>('phone');
const verify = element<HTMLFormElement>('verify');
const back = element<HTMLButtonElement>('return');
const params = new URLSearchParams(location.hash.slice(1));
const port = Number(params.get('port'));
const state = params.get('state') ?? '';
const provider = params.get('provider');
// Remove the state from browser history immediately; it is never sent to hosting.
history.replaceState(null, '', location.pathname);
let verifier: RecaptchaVerifier | undefined;
let confirmation: ConfirmationResult | undefined;
let credential: Record<string, string> | undefined;
let busy = false;

function message(error: unknown) {
  status.textContent = error instanceof Error ? error.message : 'Sign-in failed. Please try again.';
}
function clearVerifier() { verifier?.clear(); verifier = undefined; }
function setBusy(value: boolean) {
  busy = value;
  document.querySelectorAll<HTMLButtonElement>('button').forEach(button => { button.disabled = value; });
}
function returnToApp(value: Record<string, string>) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `http://127.0.0.1:${port}/natally-auth`;
  const field = document.createElement('input');
  field.type = 'hidden'; field.name = 'credential';
  field.value = JSON.stringify({ ...value, state, provider });
  form.append(field); document.body.append(form); form.submit();
}

if (location.origin !== 'https://natally.robin.mba' || !Number.isInteger(port) || port < 30000 || port > 65535 || !/^[a-f0-9]{64}$/.test(state) || !['google', 'phone'].includes(provider ?? '')) {
  status.textContent = `This sign-in link is invalid or expired. Start again from the ${APP_NAME} desktop app.`;
} else {
  const app = initializeApp(config, 'natally-native-bridge');
  const auth = initializeAuth(app, { persistence: inMemoryPersistence, popupRedirectResolver: browserPopupRedirectResolver });
  status.textContent = provider === 'google' ? `Choose your Google account, then return the sign-in to ${APP_NAME}.` : `Request an SMS code to sign in to ${APP_NAME}. Canada and United States numbers are supported.`;
  google.hidden = provider !== 'google'; phone.hidden = provider !== 'phone';
  google.onclick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const value = GoogleAuthProvider.credentialFromResult(result);
      if (!value?.idToken) throw new Error('Google did not return a sign-in credential. Please try again.');
      credential = { idToken: value.idToken, ...(value.accessToken ? { accessToken: value.accessToken } : {}) };
      google.hidden = true; back.hidden = false;
      status.textContent = `Continue as ${result.user.email ?? 'your Google account'} in the ${APP_NAME} desktop app.`;
    } catch (error) { message(error); }
    finally { setBusy(false); }
  };
  back.onclick = () => { if (credential) { setBusy(true); returnToApp(credential); credential = undefined; } };
  phone.onsubmit = async event => {
    event.preventDefault();
    if (busy) return;
    const number = element<HTMLInputElement>('number').value.replace(/[\s()-]/g, '');
    if (!/^\+1\d{10}$/.test(number)) { status.textContent = 'Enter a Canada or United States number beginning with +1 and ten digits.'; return; }
    setBusy(true);
    try {
      clearVerifier();
      verifier = new RecaptchaVerifier(auth, 'recaptcha', { size: 'invisible' });
      confirmation = await signInWithPhoneNumber(auth, number, verifier);
      phone.hidden = true; verify.hidden = false;
      status.textContent = `Enter your SMS code. ${APP_NAME} will verify it in the desktop app.`;
    } catch (error) { message(error); }
    finally { clearVerifier(); setBusy(false); }
  };
  verify.onsubmit = event => {
    event.preventDefault();
    const code = element<HTMLInputElement>('code').value.trim();
    if (busy || !confirmation || !/^\d{6}$/.test(code)) return;
    setBusy(true); returnToApp({ verificationId: confirmation.verificationId, code });
  };
  element('restart').onclick = () => {
    if (busy) return;
    confirmation = undefined; clearVerifier();
    element<HTMLInputElement>('code').value = '';
    verify.hidden = true; phone.hidden = false;
    status.textContent = 'Request a fresh SMS code.';
  };
  window.addEventListener('pagehide', clearVerifier);
  window.setTimeout(() => {
    clearVerifier(); credential = undefined; confirmation = undefined; setBusy(true);
    status.textContent = `This sign-in request has expired. Start again from ${APP_NAME}.`;
  }, 300_000);
}
