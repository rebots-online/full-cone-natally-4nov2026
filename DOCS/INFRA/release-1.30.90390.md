# Natally 1.30.90390 artifact publication

The canonical full matrix completed all twelve artifacts from source commit f931ebcc79ee8aabbec4ff50f6fca7834eecaddf, using invocation 7beec5dd-2d59-46e3-a57f-b68e5a0821d3. The existing coordinator automatically allocated the version and build number. Artifact matrix completion and public artifact delivery are complete.

The first web publication attempt failed because the existing offline npm cache lacked Surge. The official CLI was installed into that cache and the same frozen web artifact was successfully published to both domains. The original coordinator retained this earlier failure flag and exited 1 after its final inventory reported complete=true with no missing artifacts. No additional compilation or version reuse occurred.

Surge rejected the combined 459.8 MB download site. Exact completed artifacts were therefore uploaded to dedicated public Google Cloud Storage in project rochemediaservices-infra, bucket rochemediaservices-infra-natally-releases, under immutable versioned names. The download indexes on both existing web hosts refer to those exact files. The frozen application files were preserved during publication. The report records artifact sizes, SHA-256 hashes, object generations and both successful manifest readbacks.

- https://natally.robin.mba/downloads.html
- https://natally.surge.sh/downloads.html
- Publication completed: 2026-10-31T05:46:12.780Z.
- Public manifest: https://natally.robin.mba/downloads/release.json

| Artifact | MiB | Download |
| --- | ---: | --- |
| windows-exe | 27.76 | [natally-ai-studio-v1.30.90390-win11-x64-standalone.exe](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-win11-x64-standalone.exe) |
| nsis | 21.23 | [natally-ai-studio-v1.30.90390-win11-x64-nsis.exe](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-win11-x64-nsis.exe) |
| msi | 22.18 | [natally-ai-studio-v1.30.90390-win11-x64-msi.msi](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-win11-x64-msi.msi) |
| appimage | 106.93 | [natally-ai-studio-v1.30.90390-linux-amd64.AppImage](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-linux-amd64.AppImage) |
| deb | 37.29 | [natally-ai-studio-v1.30.90390-linux-amd64.deb](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-linux-amd64.deb) |
| rpm | 37.29 | [natally-ai-studio-v1.30.90390-linux-x86_64.rpm](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-linux-x86_64.rpm) |
| apk | 87.77 | [natally-ai-studio-v1.30.90390-android-arm64.apk](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-android-arm64.apk) |
| aab | 40.03 | [natally-ai-studio-v1.30.90390-android-arm64.aab](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-android-arm64.aab) |
| android-symbols | 11.97 | [natally-ai-studio-v1.30.90390-android-arm64-native-debug-symbols.zip](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-android-arm64-native-debug-symbols.zip) |
| web | 21.63 | [natally-ai-studio-v1.30.90390-webapp.zip](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-webapp.zip) |
| web-installer | 0.00 | [natally-ai-studio-v1.30.90390-install-web.sh](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-install-web.sh) |
| pwa | 0.00 | [natally-ai-studio-v1.30.90390-pwa-build.json](https://storage.googleapis.com/rochemediaservices-infra-natally-releases/v1.30.90390/natally-ai-studio-v1.30.90390-pwa-build.json) |

Android APK and AAB used the configured shared production upload certificate with SHA-256 56C13674EF22DF95DEB1E5C468820E8CFA3EA2F522511749AB7B6E5BDE3BD943. Their native debug symbols matched the AAB library build ID. Windows installers and executable are unsigned. This record establishes compiled artifacts and publication, not customer payment, redemption or device acceptance.

Publication evidence: release-1.30.90390-publication.json. Full local artifact inventory: dist/natally-ai-studio-v1.30.90390-test-build-inventory.json. No separate test commands were run for this release after the operator instructed their removal; the coordinator performed its normal compilation, package and deployment checks.
