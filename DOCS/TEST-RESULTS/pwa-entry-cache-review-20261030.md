# Existing-cache entry correction: actual evidence

30 October 2026; architecture3a04f2b0/1d5ff438,
recipe8d0f9b79/f80ca6b7, reviewed sourcead5581f1.
The original two-file source passed semantic review, npm run lint and both JS
syntax checks. Incomplete installation/legacy retention/future-install pruning
were reviewed against actual implementation; not every branch was runtime tested.

Coordinator web-only invocation135a0048-16fc-4920-8bdd-7c9ee4ad6563 produced
1.18.88916 from93ae5a68, sourceInputsMatch:true. Both hosts published. Original
terminal exit1 is preserved: Surge92/92 checks; custom host91/92, index.html
returned200 with differing bytes. A read-only recheck of only that file at
2026-10-30T04:40:51.197Z matched26,225bytes and retained SHA-256
54112e3ccc844358bcf190fe2a498f786def87026b24bca9985991f37b6db159.
This subsequent observation does not convert the original run to exit0.

Original report:
build/deploy-1.18.88916-135a0048-16fc-4920-8bdd-7c9ee4ad6563/run-2026-10-30T04-39-49-590Z-16076/deployment-report.json,
SHA-2565d557e960e770c374134e45575e9d0c82b210965816dfa09b3127de81f9c3562.
All3web artifacts verified;9native targets pending. Generated dist-web/sw.js
node --check exited0. Seven generated version mirrors published8e4695de.

| Scene | Observed result |
| --- | --- |
| U1 | Genuine Chrome marketing page13.86779 kept open through deployment. A later ordinary reload reached18.88916 without bypass/cache clearing. HTML response fromServiceWorker:true, serviceWorkerResponseSource:network. |
| U2 | After restoring online and normal reload, actual signed-in Profile/Robin/Credits:0/Top Up matched its own rendered chart on18. Anonymous/new-account/root-route branches not established by this observation. |
| U3 | Page-target offline emulation left the worker navigation response source as network; this is insufficient offline evidence. Restored online. Actual worker-offline route fallback remains unobserved. |
| U4 | Old13 document retained its version/section and was not forcibly reloaded. Its real DOM script /assets/marketing-PXePjCjY.js returned200 via service worker cache-storage, named natally-shell-1.13.86779-c19c2e74-fa33-43cc-91de-0b7654f83776. Temporary resource-probe tab closed afterward. |
| U5 | Source review only for failed-install and all-known-client pruning branches; no invented caches, IDs or mock results. |
| U6 | Actual publication/served-file results above. Recording/native packaging held in this chat; no complete paid/native release is claimed. |

Canonical deployment record is PROJECTS/Natally/INFRA/web-first-deployment.md,
revision3, exact readback
a720a37e42db70b78da2dc7fc4e03af7c7fef4272a5d223b412c3cddfc0e2edd.
The operator's subsequent Profile/handle/control-row corrections are the next
authorized work; remaining cache acceptance remains tracked rather than erased.
