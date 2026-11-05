# Public legal-page deployment — 27 October 2026

Production: https://natally.robin.mba. Surge revision: 1793140649798.

Published updated terms.html, privacy.html, legal.css and
googleec5be2e6c03b1d80.html. The existing production index was byte-compared
before staging and preserved. Live readback matched all four new files and
the unchanged index and assets/app-EfcsSg7Y.js.

SHA-256 of preserved index:
e3ad942d63bf7dc179688ac845c739212ad133fc26842ff4dc1976dbdd062baa

Terms: d7915847f590b7319b68465c158490d69bb46760400da8082ed37b316e070b58

Privacy: 243c2d118ab39718220109dd9ada3ece846ca32c574af805413863f19ca911ec

Staging reused the matching previously built web bundle from the completion
worktree. Native build archives/logs and rubric/test folders were excluded from
the web upload. Initial upload was rejected for size; the corrected web-only
upload succeeded at 204 files / 175.7 MB. No new application build was claimed.

This deployment does not contain the new marketing chart, app-owned paywall,
native authentication changes or unfinished server work. It establishes live
legal URLs and the verification file, not completed purchase acceptance or
Google branding approval.

## Governing architecture correction

The operator stopped additional Netlify-dependent implementation as unapproved
for costs and native/offline behavior, and reiterated that existing RevenueCat
and Firebase responsibilities must be used. Any necessary additional server
execution must first be assessed against Hugging Face CPU Spaces. This is not
approval to transplant the unfinished Netlify design. Resolve the actual gap,
offline behavior and operating implications before further implementation.

All three implementation agents stopped and their active coder processes exited.
Unfinished source is preserved for review, not approved for deployment. No
Netlify deployment was performed during this public-page publication.
