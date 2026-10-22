import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BlobNotFoundError, get, put } from "@vercel/blob";

const privateDir = join(process.cwd(), "private");
const statePath = join(privateDir, "raffle-state.json");
const stateBlob = "raffle/state.json";

export type SavedState = {
  raw: string;
  etag: string | null;
};

function blobEnabled() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function readLocalState(): string | null {
  if (!existsSync(statePath)) return null;
  return readFileSync(statePath, "utf8");
}

function writeLocalState(contents: string) {
  mkdirSync(privateDir, { recursive: true });
  const temporary = `${statePath}.tmp`;
  writeFileSync(temporary, contents);
  copyFileSync(temporary, statePath);
  unlinkSync(temporary);
}

async function readRemoteState(): Promise<SavedState | null> {
  try {
    const result = await get(stateBlob, { access: "private", useCache: false });
    if (!result || result.statusCode !== 200) return null;
    return {
      raw: await new Response(result.stream).text(),
      etag: result.blob.etag,
    };
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null;
    throw error;
  }
}

export async function readState(): Promise<SavedState | null> {
  if (blobEnabled()) return readRemoteState();
  const raw = readLocalState();
  return raw === null ? null : { raw, etag: null };
}

export async function writeState(raw: string, etag: string | null) {
  if (blobEnabled()) {
    await put(stateBlob, raw, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
      ...(etag ? { ifMatch: etag } : {}),
    });
    return;
  }
  writeLocalState(raw);
}
