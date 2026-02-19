# Ensure lib exists and has the auth logic
$authCode = @"
import crypto from 'crypto';

export function generateAPIKey() {
  const rawKey = 'myapi_' + crypto.randomBytes(24).toString('hex');
  const keyHash = crypto.createHash('sha256').update(rawKey).digest('hex');
  return { rawKey, keyHash };
}

export function validateKey(apiKey, storedHash) {
  const inputHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  return inputHash === storedHash;
}
"@
Set-Content -Path "lib/auth.js" -Value $authCode