import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
export function createKeyCipher(environment) {
  const encoded = environment.BILLING_KEY_ENCRYPTION_KEY;
  const key = typeof encoded === 'string' ? Buffer.from(encoded, 'base64') : Buffer.alloc(0);
  if (key.length !== 32 || key.toString('base64') !== encoded) throw new Error('BILLING_KEY_ENCRYPTION_KEY must be a 32-byte base64 key.');
  const aad = (uid, hash) => Buffer.from(JSON.stringify([uid, hash, 1]));
  return {
    encrypt(uid, hash, plaintext) {
      const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key, iv);
      cipher.setAAD(aad(uid, hash));
      const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
      return { version: 1, iv: iv.toString('base64'), tag: cipher.getAuthTag().toString('base64'), ciphertext: ciphertext.toString('base64') };
    },
    decrypt(uid, hash, value) {
      if (value?.version !== 1) throw new Error('Unsupported managed-key encryption version.');
      const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(value.iv, 'base64'));
      decipher.setAAD(aad(uid, hash)); decipher.setAuthTag(Buffer.from(value.tag, 'base64'));
      return Buffer.concat([decipher.update(Buffer.from(value.ciphertext, 'base64')), decipher.final()]).toString('utf8');
    },
  };
}
