import crypto from 'crypto';

export function generateAPIKey() {
  const rawKey = `myapi_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

// This is what the API route needs to use
export function hashAPIKey(rawKey) {
  if (!rawKey) return null;
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}