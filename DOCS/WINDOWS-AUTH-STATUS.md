# Windows authentication integration — 27 October 2026

Status: source integrated; canonical build, deployment and installed-app acceptance NOT RECORDED.
Requirement: ER04 / ER09, scene ER-S08 in EVALUATION-RELEASE-2026-10-27.md.

## Existing design restored into the active release branch

The prior local completion source already defines AUTH-NATIVE. This integration
uses that design: desktop Google and SMS sign-in open the Natally HTTPS browser
bridge; email/password remains in the app. Firebase remains the identity authority.
No custom identity backend or commercial authority is introduced.

The desktop listener binds 127.0.0.1 on an ephemeral high port, generates 256-bit
random state, accepts a bounded credential POST only from the exact Natally
HTTPS Origin and loopback Host/path, and closes after success, cancellation or
five minutes. State is carried in the browser URL fragment, removed immediately
by the bridge, and never sent to the host in an HTTP URL. Google/SMS credentials
return in a POST body. The browser Firebase session uses memory persistence.
The desktop Firebase SDK exchanges the credential into the normal account.

Existing source references: src/services/nativeAuth.ts,
src/auth/nativeBridge.ts, src-tauri/src/native_auth.rs and auth/native.html in
the local natally-completion worktree. Their presence was verified directly;
the active branch had neither these modules nor their command/build wiring.

## Acceptance trajectory

Extend ER-S08 without substituting a source check for runtime evidence:

1. Install the canonical full-matrix Windows artifact and record its version.
2. Select Google sign-in; observe system browser opening the HTTPS bridge with
   Natally branding, choose the account and explicitly return to the app.
3. Observe the same Firebase account and RevenueCat-owned purchased access.
4. Sign out; exercise phone sign-in with a Canada/US number, actual reCAPTCHA
   and SMS delivery, then complete verification and return.
5. Cancel a pending native request, retry, and let a request expire. Ensure the
   previous callback cannot authenticate the new request and the UI recovers.
6. Verify web Google and SMS paths still work, including retry after incorrect
   code and switching sign-in mode. Verify account boundaries across restoration.

Root coordinator owns canonical build, deployment, continuous evidence,
publication and integration with the broader release. No native runtime success
or Google branding approval is inferred from this implementation.

## Implemented source and dependency changes

- AuthModal selects the desktop system-browser bridge for Google and phone;
  native phone is a button, avoiding WebView form submission or reCAPTCHA.
  Pending native sign-in exposes cancellation and remains busy until settled.
  Unmounted handlers suppress state updates and request native cancellation.
- Web phone attempts own and clear their reCAPTCHA verifier; operation guards
  discard stale responses; mode changes and resends clear prior confirmation.
  The phone prompt includes SMS and Google's spam/abuse-processing disclosure.
- Native commands are registered only for desktop. Cargo dependencies
  getrandom 0.3, open 5 and url 2 are desktop-target gated. The root package and
  npm lock now include @tauri-apps/api 2.12.4 (installed with scripts disabled).
- Vite builds auth/native.html and the coordinator's marketing.html as separate
  HTML entries. Release fingerprinting now includes both new HTML locations.
- Product name is Natally; current window title is Natally v0.9.84736; short
  description is Natally personal astrology and exploration. The canonical
  stamp template now emits Natally v<version>, retaining generated version
  authority. No identifier, version code, signing or upgrade identity changed.
  Existing unsigned/test artifact qualification remains in release inventories.

Implementation was mechanically ported through the prescribed GLM-4.7 Crush
route. Source review caught and corrected an initial native phone form-submit
mistake and omitted web verifier cleanup before handoff. Final diffs were
inspected. No build, typecheck, synthetic test, commit or deployment was run by
this worker; those claims remain with the integrated release coordinator.

The browser bridge is not usable by the installed app until its matching
/auth/native.html and generated assets are deployed to natally.robin.mba.
Google ownership/domain-list configuration alone does not prove native login.
Google account selection, actual SMS delivery, callback return, Firebase account
identity, restored paid access and timeout/cancel behavior remain unobserved.