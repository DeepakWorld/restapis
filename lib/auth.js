import crypto from 'crypto';

export function generateAPIKey() {
  const rawKey = `myapi_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

export function hashAPIKey(rawKey) {
  if (!rawKey) return null;
  // This MUST match the logic in generateAPIKey exactly
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}