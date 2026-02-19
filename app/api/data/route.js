import { validateKey } from '../../lib/auth';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  // We will update this hash in the next step!
  const storedHash = "temporary_hash_to_make_build_pass"; 

  if (!apiKey) return Response.json({ error: "Missing API Key" }, { status: 401 });

  const isValid = validateKey(apiKey, storedHash);
  if (!isValid) return Response.json({ error: "Invalid API Key" }, { status: 401 });

  return Response.json({ data: "Access Granted! Your API is secure." });
}
