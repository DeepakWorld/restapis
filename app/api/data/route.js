import { validateKey } from '@/app/lib/auth';

export const dynamic = 'force-dynamic'; // This forces Vercel to not cache the old version

export async function POST(request) {
  const { rawKey, keyHash } = generateAPIKey();

  return Response.json({ 
    apiKey: rawKey,
    keyHash: keyHash, 
    message: "HASH_IS_NOW_ACTIVE",
    debug: "v2"
  });
}
