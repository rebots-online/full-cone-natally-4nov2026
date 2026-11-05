// Configured redemption terms only. Authentication, durable receipts, balance
// settlement and usable provider access belong to the actual runtime adapter.
class RedemptionPolicyError extends Error {
  constructor(binding, detail) {
    super(`${binding} ${detail}`);
    this.name = 'RedemptionPolicyError';
    this.binding = binding;
  }
}

const isRecord = value => typeof value === 'object' && value !== null && !Array.isArray(value);
function requiredSetting(environment, name) {
  const value = environment[name];
  if (typeof value !== 'string' || value.trim() === '') {
    throw new RedemptionPolicyError(name, 'must be explicitly configured.');
  }
  return value.trim();
}
function allowanceMicros(raw) {
  const match = /^(\d+)(?:\.(\d{1,6}))?$/.exec(raw);
  if (!match) {
    throw new RedemptionPolicyError('BILLING_REDEMPTION_ALLOWANCE_USD', 'must be a nonnegative USD decimal with at most six fractional digits.');
  }
  const micros = BigInt(match[1]) * 1000000n + BigInt((match[2] ?? '').padEnd(6, '0'));
  if (micros > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new RedemptionPolicyError('BILLING_REDEMPTION_ALLOWANCE_USD', 'exceeds the safe integer USD-micro range.');
  }
  return Number(micros);
}
function validatePolicy(policy) {
  if (!isRecord(policy)) throw new RedemptionPolicyError('Redemption policy', 'must be supplied by the caller.');
  if (typeof policy.acceptedCode !== 'string' || policy.acceptedCode.trim() === '') {
    throw new RedemptionPolicyError('BILLING_REDEMPTION_CODE', 'must be explicitly configured.');
  }
  if (!Number.isSafeInteger(policy.providerAllowanceUsdMicros) || policy.providerAllowanceUsdMicros < 0) {
    throw new RedemptionPolicyError('BILLING_REDEMPTION_ALLOWANCE_USD', 'must convert to a nonnegative safe integer USD-micro amount.');
  }
  return policy;
}

export function readRedemptionPolicy(environment) {
  if (!isRecord(environment)) throw new RedemptionPolicyError('Redemption environment', 'must be supplied by the caller.');
  const acceptedCode = requiredSetting(environment, 'BILLING_REDEMPTION_CODE');
  const providerAllowanceUsdMicros = allowanceMicros(requiredSetting(environment, 'BILLING_REDEMPTION_ALLOWANCE_USD'));
  return Object.freeze(validatePolicy({ acceptedCode, providerAllowanceUsdMicros }));
}

export function resolveRedemptionGrant(policy, submittedCode) {
  validatePolicy(policy);
  if (typeof submittedCode !== 'string' || submittedCode.trim() === '') {
    throw new Error('Enter a redemption code.');
  }
  // Only outer entry whitespace is ignored; case and punctuation stay exact.
  if (submittedCode.trim() !== policy.acceptedCode) {
    throw new Error('That redemption code is not recognized. Check it and try again.');
  }
  return Object.freeze({
    providerAllowanceUsdMicros: policy.providerAllowanceUsdMicros,
  });
}
