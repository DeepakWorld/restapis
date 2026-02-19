import crypto from 'crypto';

export function generateAPIKey() {
  const rawKey = `myapi_${crypto.randomBytes(24).toString('hex')}`;
  // Standard SHA256 Hashing
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

export function hashAPIKey(rawKey) {
  if (!rawKey) return null;
  // This MUST be identical to the logic above
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}