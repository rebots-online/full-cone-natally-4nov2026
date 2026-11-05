/** Immutable identity supplied by the prescribed build invocation. */
export interface BuildIdentity {
  readonly version: string;
  readonly stampedAt: string;
  readonly invocationId: string | null;
  readonly sourceRevision: string | null;
  readonly sourceFingerprint: string | null;
  readonly dirty: boolean;
}

declare const __NATALLY_BUILD__: BuildIdentity | null;

export const buildIdentity: BuildIdentity | null =
  typeof __NATALLY_BUILD__ === 'undefined' ? null : __NATALLY_BUILD__;
