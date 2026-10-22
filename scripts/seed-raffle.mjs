import { readFileSync } from "node:fs";
import { put } from "@vercel/blob";

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    "Falta BLOB_READ_WRITE_TOKEN. En Vercel: Storage → Blob → conecta el store al proyecto y vuelve a desplegar.",
  );
  process.exit(1);
}

const contents = readFileSync(new URL("../private/raffle-state.json", import.meta.url), "utf8");
const parsed = JSON.parse(contents);
if (
  !parsed ||
  typeof parsed !== "object" ||
  !Array.isArray(parsed.codes) ||
  !Array.isArray(parsed.numbers) ||
  !Array.isArray(parsed.participations)
) {
  console.error("private/raffle-state.json no tiene el formato esperado.");
  process.exit(1);
}

await put("raffle/state.json", contents, {
  access: "private",
  addRandomSuffix: false,
  allowOverwrite: true,
  contentType: "application/json",
  cacheControlMaxAge: 60,
});

console.log("Estado de la rifa guardado en Vercel Blob.");
