import { invoke, isTauri } from '@tauri-apps/api/core';
import { GoogleAuthProvider, PhoneAuthProvider, signInWithCredential, type Auth } from 'firebase/auth';

export function isNativeDesktop() {
  return isTauri() && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function signInNative(auth: Auth, provider: 'google' | 'phone') {
  const result = await invoke<{ provider: string; idToken?: string; accessToken?: string; verificationId?: string; code?: string }>('native_sign_in', { provider });
  if (result.provider !== provider) throw new Error('Unexpected sign-in provider. Please try again.');
  if (provider === 'google' && result.idToken) {
    return signInWithCredential(auth, GoogleAuthProvider.credential(result.idToken, result.accessToken));
  }
  if (provider === 'phone' && result.verificationId && /^\d{6}$/.test(result.code ?? '')) {
    return signInWithCredential(auth, PhoneAuthProvider.credential(result.verificationId, result.code!));
  }
  throw new Error('Incomplete sign-in response. Please try again.');
}

export async function cancelNativeSignIn() {
  if (!isNativeDesktop()) return;
  try { await invoke('cancel_native_sign_in'); } catch { /* cleanup is best effort */ }
}
