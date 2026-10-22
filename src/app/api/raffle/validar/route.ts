import { parseCodeCheck } from "@/lib/raffle-input";
import { clientIp, isRateLimited } from "@/lib/raffle-rate-limit";
import { validateCode } from "@/lib/raffle-store";

const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return Response.json(
      { error: "Demasiados intentos. Espera un momento e inténtalo de nuevo." },
      { status: 429, headers },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Los datos no son válidos." }, { status: 400, headers });
  }

  const parsed = parseCodeCheck(body);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400, headers });
  }

  const result = await validateCode(parsed.code, parsed.number);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status, headers });
  }

  return Response.json({ ok: true }, { headers });
}
