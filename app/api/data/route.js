import { validateKey } from '../../lib/auth';
export async function GET(request) {
  const apiKey = request.headers.get('x-api-key');
  const storedHash = "temp"; 
  if (!apiKey) return Response.json({ error: "No key" }, { status: 401 });
  return Response.json({ data: "Build Success! Now get your hash." });
}
