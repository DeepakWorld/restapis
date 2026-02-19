// app/lib/auth.js
import { randomBytes, createHash } from 'crypto';

export function generateAPIKey() {
  const rawKey = `myapi_${randomBytes(24).toString('hex')}`;
  const keyHash = createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

export function validateKey(incomingKey, storedHash) {
  const incomingHash = createHash('sha256').update(incomingKey).digest('hex');
  return incomingHash === storedHash;
}