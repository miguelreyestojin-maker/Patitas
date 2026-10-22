import { connection } from "next/server";
import { listNumbers } from "@/lib/raffle-store";

export async function GET() {
  await connection();

  try {
    const numbers = await listNumbers();
    return Response.json(
      { numbers },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { error: "No se pudo cargar la rifa." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
