import crypto from 'crypto';

export function generateAPIKey() {
  const rawKey = `myapi_${crypto.randomBytes(24).toString('hex')}`;
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

export function hashAPIKey(rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}