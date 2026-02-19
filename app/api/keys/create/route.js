import { generateAPIKey } from '../../lib/auth';
export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { rawKey, keyHash } = generateAPIKey();
  return Response.json({ 
    apiKey: rawKey,
    keyHash: keyHash, 
    message: 'SUCCESS_HASH_FOUND',
    ver: 'v4'
  });
}
