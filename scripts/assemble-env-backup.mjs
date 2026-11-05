#!/usr/bin/env node
// Assembled credential backup (Robin, 2026-11-03): on every build, write this
// checkout's .env with every kstore:// pointer replaced by its resolved value
// into the Admin-Manual credential backup, named for the version being built,
// and push it. Admin-Manual is the plaintext credential backup; values never go
// to stdout, the build log, or this repository.
//   node scripts/assemble-env-backup.mjs <version>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createKStoreClient, resolveEnvironment } from './environment.mjs';

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) { console.error('Usage: assemble-env-backup.mjs <MAJOR.MINOR.BUILD>'); process.exit(2); }
const root = resolve('.');
const admin = process.env.NATALLY_ADMIN_MANUAL || join(root, '..', 'Admin-Manual');
if (!existsSync(join(admin, '.git'))) { console.error(`Admin-Manual checkout not found at ${admin}; assembled backup skipped`); process.exit(1); }
const envPath = existsSync(join(root, '.env')) ? join(root, '.env') : join(admin, 'CREDENTIALS/Natally/natally-pointers.env');

const { environment } = await resolveEnvironment({ root, client: createKStoreClient() });
const unresolved = [];
const assembled = readFileSync(envPath, 'utf8').split('\n').map(line => {
  const m = /^([A-Za-z_][A-Za-z0-9_]*)=(["']?)kstore:\/\/[^"'\s]+\2\s*$/.exec(line);
  if (!m) return line;
  const value = environment[m[1]];
  if (typeof value !== 'string' || value === '') { unresolved.push(m[1]); return line; }
  return `${m[1]}=${/[\s#"']/.test(value) ? `'${value.replace(/'/g, "'\\''")}'` : value}`;
}).join('\n');

const rel = `CREDENTIALS/Natally/natally-ai-studio-v${version}-assembled.env`;
writeFileSync(join(admin, rel), assembled + (unresolved.length ? `\n# Unresolved at assembly: ${unresolved.join(', ')}\n` : ''), { mode: 0o600 });
const git = (...a) => execFileSync('git', ['-C', admin, ...a], { stdio: ['ignore', 'ignore', 'inherit'] });
git('add', rel);
try { git('commit', '-q', '-m', `Natally v${version}: assembled .env backup (pointers resolved)`); } catch {}
try { git('push', '-q', 'origin', 'HEAD'); } catch { console.error('Admin-Manual push deferred'); }
console.log(`Assembled credential backup: Admin-Manual/${rel}${unresolved.length ? ` (${unresolved.length} unresolved)` : ''}`);
