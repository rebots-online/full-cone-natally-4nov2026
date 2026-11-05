import React, { useEffect, useRef, useState } from 'react';
import { NatallyIcon } from './NatallyIcon';
import { X, LogIn, UserPlus, LogOut, Phone, Mail, ShieldCheck } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from '../services/firebase';
import { User } from 'firebase/auth';
import { InferenceAccessSettings } from './InferenceAccessSettings';
import { isNativeDesktop, signInNative, cancelNativeSignIn } from '../services/nativeAuth';

interface AuthModalProps {
  user: User | null;
  onClose: () => void;
  /** Redo onboarding: clears the stored intake and reopens it. */
  onReonboard?: () => void;
  required?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ user, onClose, onReonboard, required = false }) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'phone'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nativePending, setNativePending] = useState(false);
  const desktop = isNativeDesktop();

  const mounted = useRef(true);
  const phoneContainer = useRef<HTMLDivElement | null>(null);
  const phoneVerifier = useRef<RecaptchaVerifier | null>(null);
  const phoneOperation = useRef(0);
  const phoneBusy = useRef(false);
  const clearPhoneVerifier = () => {
    const verifier = phoneVerifier.current;
    phoneVerifier.current = null;
    try { verifier?.clear(); } catch { }
  };
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      phoneOperation.current += 1;
      clearPhoneVerifier();
      void cancelNativeSignIn();
    };
  }, []);
  const resetPhone = () => {
    if (phoneBusy.current) return;
    phoneOperation.current += 1;
    clearPhoneVerifier();
    setConfirmationResult(null);
    setVerificationCode('');
    setError(null);
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      if (desktop) {
        setNativePending(true);
        await signInNative(auth, 'google');
      } else await signInWithPopup(auth, googleProvider);
      if (mounted.current) onClose();
    } catch (err: any) {
      if (mounted.current) setError(err instanceof Error ? err.message : String(err || 'Google sign-in was cancelled or failed.'));
    } finally {
      if (mounted.current) {
        setLoading(false);
        setNativePending(false);
      }
    }
  };

  const handleNativePhone = async () => {
    if (loading) return;
    setError(null);
    setLoading(true);
    setNativePending(true);
    try {
      await signInNative(auth, 'phone');
      if (mounted.current) onClose();
    } catch (err: unknown) {
      if (mounted.current) setError(err instanceof Error ? err.message : String(err));
    } finally {
      if (mounted.current) {
        setLoading(false);
        setNativePending(false);
      }
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneBusy.current || !phoneContainer.current) return;
    phoneBusy.current = true;
    const operation = ++phoneOperation.current;
    const current = () => mounted.current && phoneOperation.current === operation;
    setError(null);
    setLoading(true);
    let verifier: RecaptchaVerifier | null = null;
    try {
      clearPhoneVerifier();
      verifier = new RecaptchaVerifier(auth, phoneContainer.current, { size: 'invisible' });
      phoneVerifier.current = verifier;
      const result = await signInWithPhoneNumber(auth, phoneNumber, verifier);
      if (current()) setConfirmationResult(result);
    } catch (err: any) {
      if (current()) setError(err.message || 'Phone verification failed.');
    } finally {
      if (phoneVerifier.current === verifier) clearPhoneVerifier();
      if (current()) { phoneBusy.current = false; setLoading(false); }
    }
  };

  const handleVerifyPhoneCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || phoneBusy.current) return;
    phoneBusy.current = true;
    const operation = ++phoneOperation.current;
    const current = () => mounted.current && phoneOperation.current === operation;
    setError(null);
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      if (current()) onClose();
    } catch (err: any) {
      if (current()) setError(err.message || 'Invalid verification code.');
    } finally {
      if (current()) { phoneBusy.current = false; setLoading(false); }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    onClose();
  };

  return (
    <div role="dialog" aria-modal="true" aria-label={user ? 'Account settings' : 'Sign in to Natally'} className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="celestial-panel w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl p-5 border border-[#d4af37]/40 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#322641] pb-3">
          <div className="flex items-center gap-2">
            <NatallyIcon size="header" />
            <h3 className="font-cinzel text-sm text-[#f2ca50] font-bold tracking-wider uppercase">
              {user ? 'Account Settings' : 'Readings by Natally'}
            </h3>
          </div>
          {!required && <button
            type="button"
            aria-label="Close account dialog"
            onClick={onClose}
            className="p-1 rounded hover:bg-[#271c36] text-[#a99dae] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>}
        </div>

        {!user && <div className="space-y-2 text-sm text-[#f1e8d8]">
          <p>Sign in or create your account before introducing yourself to Natally.</p>
          <p>Create your free account for your Natally profile and personal continuity. Signing up does not buy anything or start a subscription.</p>
          <p className="text-xs text-[#a99dae]">Purchases are separate from account creation and stay linked to your signed-in account.</p>
          <p className="text-xs text-[#a99dae]">Read our <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="underline">Terms</a> and <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>.</p>
        </div>}

        {error && (
          <div className="p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono">
            {error}
          </div>
        )}

        {nativePending && <div className="space-y-2 text-sm text-[#f1e8d8]" role="status">
          <p>Continue in your system browser, then return to Natally. This sign-in expires after five minutes.</p>
          <button type="button" onClick={() => void cancelNativeSignIn()} className="text-[#f2ca50] underline">Cancel sign-in</button>
        </div>}

        {user ? (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#1c1428] border border-[#322641]">
              <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center font-bold text-sm text-[#f2ca50]">
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-cinzel text-xs text-white font-semibold truncate">
                  {onReonboard && (
                    <button
                      type="button"
                      onClick={onReonboard}
                      className="w-full mb-2 px-3 py-2 rounded-lg bg-[#241838] hover:bg-[#342452] border border-[#d4af37]/40 text-[#f2ca50] font-mono text-xs transition-colors cursor-pointer"
                    >
                      ✨ Re-introduce yourself to Natally (redo onboarding)
                    </button>
                  )}
                  {user.displayName || 'Astrolabe Pilgrim'}
                </p>
                <p className="font-mono text-[11px] text-[#a99dae] truncate">
                  {user.email || user.phoneNumber || user.uid}
                </p>
              </div>
            </div>

            <InferenceAccessSettings key={user.uid} accountUid={user.uid} />

            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2 px-4 rounded-lg bg-[#271c36] hover:bg-[#342452] border border-red-500/30 text-red-300 font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Account</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Social Google Login Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-2.5 px-4 rounded-xl bg-[#271c36] hover:bg-[#342452] border border-[#d4af37]/40 text-[#f1e8d8] font-mono text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16c1.8 3.8 5.6 7 10.1 7z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-[#322641] w-full" />
              <span className="bg-[#1c1428] px-2 font-mono text-[10px] text-[#a99dae] uppercase tracking-wider absolute">
                or with email / phone
              </span>
            </div>

            {/* Mode switch tabs */}
            <div className="grid grid-cols-3 gap-1 bg-[#1c1428] p-1 rounded-lg border border-[#322641]">
              <button
                type="button"
                disabled={loading}
                onClick={() => { resetPhone(); setMode('login'); }}
                className={`py-1 rounded text-xs font-mono transition-colors ${
                  mode === 'login'
                    ? 'bg-[#271c36] text-[#f2ca50] font-semibold'
                    : 'text-[#a99dae] hover:text-white'
                }`}
              >
                Email Log In
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => { resetPhone(); setMode('signup'); }}
                className={`py-1 rounded text-xs font-mono transition-colors ${
                  mode === 'signup'
                    ? 'bg-[#271c36] text-[#f2ca50] font-semibold'
                    : 'text-[#a99dae] hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => { resetPhone(); setMode('phone'); }}
                className={`py-1 rounded text-xs font-mono transition-colors ${
                  mode === 'phone'
                    ? 'bg-[#271c36] text-[#9fb4ff] font-semibold'
                    : 'text-[#a99dae] hover:text-white'
                }`}
              >
                Phone
              </button>
            </div>

            {/* Email form */}
            {mode !== 'phone' ? (
              <form onSubmit={handleEmailAuth} className="space-y-3">
                <div>
                  <label className="block font-mono text-[10px] text-[#a99dae] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-[#a99dae] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="pilgrim@cosmos.org"
                      className="talisman-input w-full rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#a99dae] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="talisman-input w-full rounded-lg px-3 py-1.5 text-xs font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-lg bg-[#d4af37] hover:bg-[#e5c247] text-[#120c1c] font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {mode === 'signup' ? <UserPlus className="w-3.5 h-3.5" /> : <LogIn className="w-3.5 h-3.5" />}
                  <span>{mode === 'signup' ? 'Create Account' : 'Log In'}</span>
                </button>
              </form>
            ) : desktop ? (
              <div className="space-y-3 text-sm text-[#f1e8d8]">
                <p>Verify your Canada or United States phone number in your system browser, then return to Natally.</p>
                <button type="button" disabled={loading} onClick={handleNativePhone} className="w-full py-2 px-4 rounded-lg bg-[#9fb4ff] text-[#120c1c] font-bold">Continue with phone</button>
              </div>
            ) : (
              /* Phone number form */
              <div className="space-y-3">
                {!confirmationResult ? (
                  <form onSubmit={handleSendPhoneCode} className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#a99dae] mb-1">
                        Phone Number · Canada / United States (+1)
                      </label>
                      <div className="relative">
                        <Phone className="w-3.5 h-3.5 text-[#a99dae] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="+1 555 123 4567"
                          className="talisman-input w-full rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-xs text-[#a99dae]">By requesting a code, you agree to receive a verification SMS. Message and data rates may apply. Google receives and stores your phone number to prevent spam and abuse. Read our <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a>.</p>
                    <div ref={phoneContainer} />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-lg bg-[#9fb4ff] hover:bg-[#b0c2ff] text-[#120c1c] font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Send SMS Verification Code</span>
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyPhoneCode} className="space-y-3">
                    <div>
                      <label className="block font-mono text-[10px] text-[#a99dae] mb-1">
                        6-Digit Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                        className="talisman-input w-full rounded-lg px-3 py-1.5 text-xs font-mono text-center tracking-widest text-lg"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 px-4 rounded-lg bg-[#d4af37] hover:bg-[#e5c247] text-[#120c1c] font-bold text-xs font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Verify &amp; Log In</span>
                    </button>
                    <button type="button" disabled={loading} onClick={resetPhone} className="w-full text-xs text-[#9fb4ff] underline">Use a different number / Send a new code</button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
