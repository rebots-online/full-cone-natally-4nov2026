import { readFileSync, writeFileSync } from 'node:fs';
import { syncNativeIdentity } from './app-identity.mjs';
syncNativeIdentity();
const file = 'src-tauri/gen/android/app/build.gradle.kts';
let source = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
// ANDROID_KEYSTORE_PATH may be relative to Admin-Manual (Robin, 2026-11-03), e.g.
// CREDENTIALS/PlayStore/production.keystore — no machine-specific paths.
{
  let raw = process.env.ANDROID_KEYSTORE_PATH || '';
  // Any machine-specific spelling that points inside Admin-Manual is reduced to
  // its Admin-Manual-relative part, so existing .env files need no edits.
  const inside = /[\\/]Admin-Manual[\\/](.+)$/i.exec(raw);
  if (inside) raw = inside[1].replace(/\\/g, '/');
  if (raw && !/^([A-Za-z]:|[\\/])/.test(raw)) {
    const adminRoot = process.env.NATALLY_ADMIN_MANUAL || new URL('../../Admin-Manual/', import.meta.url).pathname;
    process.env.ANDROID_KEYSTORE_PATH = adminRoot.replace(/\/$/, '') + '/' + raw;
  }
}
for (const name of ['ANDROID_KEYSTORE_PATH','ANDROID_KEY_ALIAS','ANDROID_KEYSTORE_PASSWORD','ANDROID_KEY_PASSWORD','ANDROID_SIGNING_CERT_SHA256']) {
  if (!process.env[name]) throw new Error(`Required production signing binding missing: ${name}`);
}
source = source.replace(/\s*\/\/ NATALLY_TEST_SIGNING:[^\n]*\n\s*signingConfig = signingConfigs.getByName\("debug"\)/, '');
if (!source.includes('NATALLY_PRODUCTION_SIGNING')) {
  source = source.replace('    buildTypes {', `    // NATALLY_PRODUCTION_SIGNING: resolved process-only production credentials.
    signingConfigs {
        create("production") {
            storeFile = file(providers.environmentVariable("ANDROID_KEYSTORE_PATH").get())
            storePassword = providers.environmentVariable("ANDROID_KEYSTORE_PASSWORD").get()
            keyAlias = providers.environmentVariable("ANDROID_KEY_ALIAS").get()
            keyPassword = providers.environmentVariable("ANDROID_KEY_PASSWORD").get()
        }
    }
    buildTypes {`);
  source = source.replace('getByName("release") {', 'getByName("release") {\n            signingConfig = signingConfigs.getByName("production")');
}
if (!source.includes('debugSymbolLevel = "FULL"')) source = source.replace('getByName("release") {','getByName("release") {\n            ndk { debugSymbolLevel = "FULL" }');
if (!source.includes('jvmToolchain(21)')) source += '\nkotlin { jvmToolchain(21) }\n';
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
