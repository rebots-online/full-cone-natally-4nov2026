# Built homepage preview — 27 October 2026

URL: https://1793141063303--natally--robin--mba.surge.sh/

The prescribed scripts/build-all-platforms.ps1 coordinator ran from an isolated
checkout of 80c2942b9db8fb074bfee22b7f1631e4e50a26a0 under
.tmp/homepage-release. It stamped v0.10.85679, passed TypeScript and eight
release-state checks, froze inputs, and verified the web artifact. The native
matrix was still running when this preview was published; no native acceptance
or full-matrix completion is claimed here.

scripts/stage-marketing-overlay.mjs overlays built marketing assets and the
native auth helper onto the matching existing public bundle. It preserves the
old app JavaScript and inserts only the homepage redirect into its index.
Queries app=1 or offer=reading/conversation retain the existing app entry.
This is a composite web preview, not a claim that the old app is v0.10.85679.

Surge --preview published 234 files / 179.5 MB without changing production.
Live readback matched the staged index, marketing page, native helper and old
app JavaScript. Production index remained at SHA-256
e3ad942d63bf7dc179688ac845c739212ad133fc26842ff4dc1976dbdd062baa.

Preview marketing SHA-256:
6afdfb449134c8fa1315eace03aeaf3778a9a349bd701bae07ced75702cb0a2a

Browser observation on the deployed URL confirmed the root redirects to
marketing.html, the Natally heading renders, the real-chart component mounts
in its signed-out state, and the badge reads v0.10.85679. No personal chart,
checkout, paid delivery, native authentication or offline acceptance was
demonstrated. The preview hostname has not been added to Google/Firebase
authorized domains. It is for homepage review, not an accepted purchase route.

Production cutover is withheld because the homepage advertises paid delivery
that remains unverified. No Netlify function was deployed. The full release
objective remains open and the user-required hosting architecture review holds.
