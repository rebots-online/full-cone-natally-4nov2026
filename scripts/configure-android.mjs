import { readFileSync, writeFileSync } from 'node:fs';
import { syncNativeIdentity } from './app-identity.mjs';
syncNativeIdentity();
const file = 'src-tauri/gen/android/app/build.gradle.kts';
let source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
if (!source.includes('NATALLY_TEST_SIGNING')) {
  source = source.replace('getByName("release") {', `getByName("release") {
            // NATALLY_TEST_SIGNING: release profile, explicit local test certificate.
            signingConfig = signingConfigs.getByName("debug")
            ndk { debugSymbolLevel = "FULL" }`);
  source += `\nbase { archivesName.set("natally-ai-studio-v" + tauriProperties.getProperty("tauri.android.versionName", "0.0.0")) }\n`;
  source += `\nkotlin { jvmToolchain(21) }\n`;
  writeFileSync(file, source);
}
// Keep overrides outside the sections that Tauri regenerates. version.txt is a
// derived mirror of version.json; Android may display a five-digit BUILD.
source = source.replace(/^base \{ archivesName.*\n?/gm, '');
if (!source.includes('val natallyVersion =')) {
  source += '\nval natallyVersion = providers.fileContents(rootProject.layout.projectDirectory.file("../../../version.txt")).asText.get().trim()\n';
  source += 'android.defaultConfig.versionName = natallyVersion\n';
}
source += 'base { archivesName.set("natally-ai-studio-v" + natallyVersion) }\n';
const properties = 'src-tauri/gen/android/gradle.properties';
let props = readFileSync(properties, 'utf8').replace(/^org.gradle.daemon=.*$/gm, '').replace(/^org.gradle.jvmargs=.*$/gm, '');
if (!props.includes('# Natally automated test builds')) {
  props += '\n# Natally automated test builds\norg.gradle.daemon=false\norg.gradle.jvmargs=-Xmx4g\norg.gradle.workers.max=4\n';
  writeFileSync(properties, props);
}
// Kotlin's incremental cache cannot relativize the E: Cargo registry against
// this F: checkout. Keep source in this repo and compile Kotlin in process.
let current = readFileSync(properties, 'utf8');
for (const setting of ['kotlin.incremental=false', 'kotlin.compiler.execution.strategy=in-process']) {
  if (!current.includes(setting)) current += '\n' + setting + '\n';
}
writeFileSync(properties, current);
// The Tauri CLI rewrites generated Kotlin DSL sections using LF. Prepare this
// source before the common freeze, including on Windows checkouts using CRLF.
writeFileSync(file, source);
const prepared = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/jvmTarget = "1\.8"/g, 'jvmTarget = "21"');
writeFileSync(file, prepared);
