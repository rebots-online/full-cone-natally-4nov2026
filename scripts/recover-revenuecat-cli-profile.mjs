// Recover only the explicitly selected, already authenticated RevenueCat profile.
// Credentials pass through captured process memory into canonical storage only.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { createKStoreClient, parseEnvironmentDocument, serializeAssignment } from './environment.mjs';
import { updateBillingEnvironment } from './configure-billing-environment.mjs';

const credentialDocument = 'CREDENTIALS/RevenueCat/Natally/credentials.env';
const binding = 'REVENUECAT_CLI_PROFILE_JSON';

function windowsProfileSecrets(configDir, profile) {
  // Exact target format from RevenueCat CLI v0.1.7 and zalando/go-keyring.
  const target = `revenuecat-cli:${join(configDir, profile)}`;
  const command = `
$ErrorActionPreference = 'Stop'
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public static class NatallyRevenueCatCredential {
  [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Unicode)]
  public struct Credential {
    public UInt32 Flags; public UInt32 Type; public string TargetName;
    public string Comment; public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
    public UInt32 CredentialBlobSize; public IntPtr CredentialBlob; public UInt32 Persist;
    public UInt32 AttributeCount; public IntPtr Attributes; public string TargetAlias; public string UserName;
  }
  [DllImport("advapi32.dll", EntryPoint="CredReadW", CharSet=CharSet.Unicode, SetLastError=true)]
  public static extern bool Read(string target, UInt32 type, UInt32 flags, out IntPtr credential);
  [DllImport("advapi32.dll")] public static extern void CredFree(IntPtr credential);
}
'@
$credentialPointer = [IntPtr]::Zero
if (-not [NatallyRevenueCatCredential]::Read($env:NATALLY_RC_CREDENTIAL_TARGET, 1, 0, [ref]$credentialPointer)) {
  throw 'The selected RevenueCat profile credential could not be read.'
}
try {
  $credential = [Runtime.InteropServices.Marshal]::PtrToStructure($credentialPointer, [type][NatallyRevenueCatCredential+Credential])
  $bytes = New-Object byte[] $credential.CredentialBlobSize
  [Runtime.InteropServices.Marshal]::Copy($credential.CredentialBlob, $bytes, 0, $bytes.Length)
  [Console]::Out.Write([Text.Encoding]::UTF8.GetString($bytes))
} finally { [NatallyRevenueCatCredential]::CredFree($credentialPointer) }
`;
  const result = spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command', command], {
    env: { ...process.env, NATALLY_RC_CREDENTIAL_TARGET: target }, encoding: 'utf8', windowsHide: true,
  });
  if (result.error || result.status !== 0) throw Error(`${binding}: selected RevenueCat profile recovery failed`);
  try { return JSON.parse(result.stdout); }
  catch { throw Error(`${binding}: selected RevenueCat profile is unreadable`); }
}

export async function recoverRevenueCatCliProfile({ profile = 'default', configDir = join(homedir(), '.config', 'revenuecat') } = {}) {
  if (!/^[a-zA-Z0-9_-]+$/.test(profile)) throw Error('Invalid RevenueCat profile name');
  const pointer = `kstore://admin-manual/${credentialDocument}#${binding}`;
  for (const file of ['.env', '.env.local']) {
    if (!existsSync(file)) continue;
    const existing = parseEnvironmentDocument(readFileSync(file, 'utf8')).valueMap[binding];
    if (existing && existing !== pointer) throw Error(`${binding}: preserve the existing explicit binding in ${file}`);
  }
  const client = createKStoreClient();
  let before = '';
  try { before = (await client.read_document(credentialDocument)).content; }
  catch (error) { if (error.code !== 'KSTORE_NOT_FOUND') throw error; }
  if (!parseEnvironmentDocument(before).valueMap[binding]) {
    const metadata = JSON.parse(readFileSync(join(configDir, `${profile}.json`), 'utf8'));
    const secrets = process.platform === 'win32' ? windowsProfileSecrets(configDir, profile) : {};
    const recovered = { ...metadata, ...secrets };
    if (recovered.token_type !== 'oauth' || !recovered.access_token || !recovered.refresh_token) {
      throw Error(`${binding}: renewable authorization is missing from the selected profile`);
    }
    if (before) {
      const hash = createHash('sha256').update(before).digest('hex');
      await client.write_with_exact_readback(`CREDENTIALS/RevenueCat/Natally/before-cli-profile-${hash}.env`, before,
        { title: 'Exact RevenueCat credential document checkpoint' });
    }
    const content = `${before.trimEnd()}\n\n# Existing official RevenueCat CLI authorization for Natally catalog administration.\n# Recovered from the selected authenticated local profile; never log or expose to clients.\n${serializeAssignment(binding, JSON.stringify(recovered))}\n`;
    await client.write_with_exact_readback(credentialDocument, content, { title: 'Natally RevenueCat credentials' });
  }
  await updateBillingEnvironment({ [binding]: pointer }, { checkpoint: 'revenuecat-cli-profile' });
  return { binding, canonicalReadback: true };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  recoverRevenueCatCliProfile().then(result => console.log(JSON.stringify(result))).catch(() => {
    console.error(`${binding}: canonical recovery failed; credential diagnostics suppressed`);
    process.exitCode = 1;
  });
}
