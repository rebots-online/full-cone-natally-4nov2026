# SOUL and About source record — 22 October 2026

## Character and memory

SOUL.md is the shared character definition imported directly as Vite raw text by
src/services/soul.ts. The previous prompt is preserved verbatim in
DOCS/HISTORY/natally-persona-before-soul-2026-10-22.md with its source commit.

Two accountStorageKey-based versioned stores contain fictional character lore and
the user's actual authored messages separately. User messages remain quotations,
not model-extracted facts. Character metadata can only describe the fictional
detail disclosed in the same response. The parser removes it before presentation
offsets are calculated. Both stores validate owner/schema/bounds on load, keep
the same seed, merge before writes, and require the current-session guard. No new
inference, provider or database was added. This storage is browser-local per
account; it does not claim cross-device synchronisation.

## About provenance

- Product name: Natally, existing application and user instruction.
- Copyright: existing src/App.tsx footer, “Copyright ©2026 Robin L. M. Cheung,
  MBA.” The former “All rights reserved” suffix was removed from Natally's own
  footer/About after the owner authorized the AGPL-3.0-only application grant.
  Third-party copyright and licence notices remain unchanged.
- Build identity: Vite captures actual git HEAD, dirty status, UTC build timestamp,
  and canonical version.txt when present, otherwise the latest version-prefixed
  commit's version. The canonical version.txt now records 0.3.73753, carried
  forward from the existing published branch version. package.json's 0.0.0 is not
  presented as the product version. A dirty build's link explicitly identifies
  its base revision; only a clean committed build is labelled its build source.
- Source: configured GitHub origin, rebots-online/natally-ai-studio. The actual
  final journey found this repository is private. About now says “GitHub source”;
  public corresponding-source access remains unfinished pending authorization
  for a separate reviewed snapshot or repository visibility change.
- swisseph-wasm 0.1.0: installed package.json declares GPL-3.0-or-later and its
  LICENSE carries Copyright (C) 2024 prolaxu. Copied verbatim to public/notices/.
- Swiss Ephemeris: upstream LICENSE fetched from
  https://raw.githubusercontent.com/aloistr/swisseph/master/LICENSE on
  2026-10-22. It names Astrodienst AG, copyright 1997–2021 and the AGPL / Swiss
  Ephemeris Professional License alternatives. Preserved verbatim in
  public/notices/Swiss-Ephemeris-LICENSE.txt. The wrapper's simplified commercial
  wording is not substituted for those upstream terms.
- Playfair Display: existing public/fonts/OFL-PlayfairDisplay.txt retained.
- public/notices/THIRD-PARTY-NOTICES.txt records installed direct dependency
  versions, declared licences, repositories and package-root licence texts.

## Licensing decision and remaining source evidence

The initial checkout had no root application licence grant. The owner subsequently
authorized AGPL-3.0-only while Swiss Ephemeris is bundled. LICENSE now holds the
unmodified SPDX canonical AGPLv3 text, mirrored at public/notices/AGPL-3.0.txt;
LICENSING.md records the explicit version-3-only grant, provenance and remaining
obligations. Both licence-text files have SHA-256
d8a6cc31abc16b6748c7a21f21611f5a1ec33f67d22ca23d7da1c19b95496bee.
About exposes the licence and no-warranty notice. Application package metadata
declares AGPL-3.0-only; the wrapper retains GPL-3.0-or-later.

The owner will create the public GitHub destination after completion. Public
corresponding-source access, exact bundled-binary source/build provenance and
transitive notices remain outstanding; licence selection alone does not establish
complete xGPL compliance.

KStore /inject was queried for the standard About splash and returned its live
authoritative reminders (task list and no-placeholder-content), but zero About
hits. Read-only PostgreSQL document path queries for about/licence/copyright/
branding/splash returned no documents. The component therefore implements the
user's explicit Profile/About/source request and verified records; it does not
claim an unavailable standard was retrieved. A subsequent entity-content query
located CICD_CONVENTIONS/version-display-compliance.md, read through KStore
(revision 1, exact=false legacy document reconstruction). Its required display
is vMAJOR.MINOR.BUILD; About follows that format and reads the wrapper's version
and licence from the installed package itself. No local rule list was added.

## Final observation

Implementation is not acceptance. The parent journey records actual Profile,
modal keyboard focus/close/restore, public revision links, narrow viewport,
fictional continuity, user quotation boundaries, failures and A→B→A isolation.
No unit, integration, lint or typecheck gate was run for this work.

The normal production build has only the application index.html entry. The
historical voice-browser test page remains in source but is no longer emitted
as a second production entry or shipped as part of the application journey.
