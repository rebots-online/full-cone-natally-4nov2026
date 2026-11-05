// Redemption codes whose behaviour is defined by the code itself (Robin,
// 2026-11-02). A code resolves to a definition { kind, ...parameters,
// maxRedemptions?, expiresAt? }; `kind` selects a behaviour handler. New
// behaviours (coupons such as 30% off, AppSumo single-use licences, …) are
// added as new kinds without changing the redeem route.
//
// Sources, in order:
//   1. the .env admin code (BILLING_REDEMPTION_CODE) → { kind: 'grant',
//      allowanceUsdMicros: BILLING_REDEMPTION_ALLOWANCE_USD } — reusable;
//   2. Firestore natallyRedemptionCodes/{sha256(code)} — any definition,
//      consumed atomically up to maxRedemptions (one claim per account).
import { timingSafeEqual } from 'node:crypto';
import { digest } from './firebase-ledger.mjs';
import { readRedemptionPolicy } from './redemption-policy.mjs';

export const REDEMPTION_CODES = 'natallyRedemptionCodes';
const reject = (message, status = 400) => Object.assign(new Error(message), { status });
const pending = message => Object.assign(new Error(message), { code: 'BILLING_PENDING' });

/** Behaviours by kind. Each validates its own parameters. */
export const REDEMPTION_BEHAVIOURS = {
  // Adds an allowance to the authoritative balance (admin code, gift certificates).
  grant: definition => {
    if (!Number.isSafeInteger(definition.allowanceUsdMicros) || definition.allowanceUsdMicros <= 0) throw reject('This code has no valid amount.');
    return { kind: 'grant', allowanceUsdMicros: definition.allowanceUsdMicros };
  },
};

// Admin code (Robin, 2026-11-03): set by BILLING_REDEMPTION_CODE in .env,
// defaulting to the operator's code; grants BILLING_REDEMPTION_ALLOWANCE_USD,
// defaulting to US$4 = 400 Cr — the same as buying US$10 at 40%.
const ADMIN_DEFAULTS = { BILLING_REDEMPTION_CODE: 'Ch4n3l.C3351', BILLING_REDEMPTION_ALLOWANCE_USD: '4' };
function adminDefinition(environment, codeHash) {
  const env = { ...environment };
  for (const [name, value] of Object.entries(ADMIN_DEFAULTS)) if (!String(env[name] ?? '').trim()) env[name] = value;
  let policy;
  try { policy = readRedemptionPolicy(env); } catch { return null; }
  // Equal-length digests avoid disclosing accepted-code prefixes.
  if (!timingSafeEqual(Buffer.from(digest(policy.acceptedCode), 'hex'), Buffer.from(codeHash, 'hex'))) return null;
  return { kind: 'grant', allowanceUsdMicros: policy.providerAllowanceUsdMicros, label: 'admin' };
}

/** Resolve and (for stored codes) claim a code for uid → validated behaviour, or throw. */
export async function resolveRedemptionCode(environment, ledger, codeHash, uid, now = Date.now()) {
  let definition = adminDefinition(environment, codeHash);
  if (!definition) {
    for (let attempt = 0; attempt < 3 && !definition; attempt++) {
      const record = await ledger.read(REDEMPTION_CODES, codeHash);
      if (!record) throw reject('That redemption code is not recognized. Check it and try again.');
      const stored = record.payload, by = Array.isArray(stored.redeemedBy) ? stored.redeemedBy : [];
      if (stored.expiresAt && !(Date.parse(stored.expiresAt) > now)) throw reject('This code has expired.');
      if (by.includes(uid)) { definition = stored; break; }
      if (Number.isSafeInteger(stored.maxRedemptions) && (stored.redemptions || 0) >= stored.maxRedemptions) throw reject('This code has already been used.');
      const claimed = { ...stored, redemptions: (stored.redemptions || 0) + 1, redeemedBy: [...by, uid] };
      if (await ledger.commit([ledger.write(REDEMPTION_CODES, codeHash, claimed, { updateTime: record.updateTime })])) definition = claimed;
    }
    if (!definition) throw pending('This code is being redeemed. Retry in a moment.');
  }
  const behaviour = REDEMPTION_BEHAVIOURS[definition.kind];
  if (!behaviour) throw reject('This kind of code cannot be redeemed here yet.');
  return behaviour(definition);
}
