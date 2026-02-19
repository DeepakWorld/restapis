import { validateKey } from '../../lib/auth';

export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  const storedHash = "waiting_for_hash"; 

  if (!apiKey) return Response.json({ error: "Missing Key" }, { status: 401 });
  
  // This is a temporary success message to prove the build worked
  return Response.json({ message: "Build Successful! Now generate your hash." });
}
