# Web release 1.32.90532

The canonical web-only coordinator completed with exit code 0 on 31 October 2026 and published the approved R11 correction to [natally.robin.mba](https://natally.robin.mba) and [natally.surge.sh](https://natally.surge.sh).

- Source commit: `5efcd4f0075c39f112407ea13287c33e782c0aac`.
- Automatic version: `1.32.90532`; version code `100032`.
- Invocation: `c5fa7479-7389-412c-b2bf-0cc5f8e24c1a`.
- Stamped at: `2026-10-31T07:32:02.140Z`.
- Artifact completion: `2026-10-31T07:34:26.545Z`.
- Frozen source fingerprint: `92a777c9e35056da542cabdfe766fc29f0418daf091bd0a31ccf21d99bf336da`; the coordinator recorded matching source inputs.

The approved command was:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/build-all-platforms.ps1 -DeployWebFirst -DeployDomains 'natally.robin.mba,natally.surge.sh'
```

Vite transformed 2,002 modules and completed production compilation in 14.47 seconds. The web archive, installer, and PWA inventory were staged. The deployment report records successful publication and matching served bytes for 95 files on each domain, with no deployment errors or failed file checks.

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `natally-ai-studio-v1.32.90532-webapp.zip` | 22,685,880 | `694819420537eb8577c35fe8436c702b250cb670fa14d576485e34f4eaadd66e` |
| `natally-ai-studio-v1.32.90532-install-web.sh` | 2,978 | `f9e6c73b94b45f4746b62b353059ed153a93e412a447e84d0fe9423a97807bce` |
| `natally-ai-studio-v1.32.90532-pwa-build.json` | 1,669 | `cb115323ae8c118a963403075bb38ac8dd6691ac6b95c22702d47e71a61629a2` |

The existing `downloads.html` and `downloads/release.json` were retained and returned matching bytes on both domains. They continue to describe the previously published 1.30.90390 native downloads. No native builds or backend deployment were performed for this iteration. The inventory intentionally leaves all nine native targets pending; this is a completed web release, not a completed new all-platform matrix.

No separate test suite, payment, redemption, or inference probe was run. The operator reported that the configured USD10 redemption did not work; this web publication does not claim that issue is resolved. Customer transaction acceptance and that separate billing correction remain distinct from the successful build and publication evidence.

Machine-readable evidence: [release-1.32.90532-publication.json](release-1.32.90532-publication.json).

Original deployment report: `build/deploy-1.32.90532-c5fa7479-7389-412c-b2bf-0cc5f8e24c1a/run-2026-10-31T07-34-26-813Z-38880/deployment-report.json`.

Original artifact inventory: `dist/natally-ai-studio-v1.32.90532-test-build-inventory.json`.
