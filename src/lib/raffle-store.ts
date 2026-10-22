import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { raffleTotalNumbers } from "@/lib/initiatives";
import { type RegistrationInput } from "@/lib/raffle-input";

const invalidCode = "El código no es válido o ya fue utilizado.";
const numberTaken = "Ese número ya no está disponible. Elige otro.";
const notReady = "La rifa no está lista para registrar participaciones.";

type CodeRecord = {
  id: string;
  codeHash: string;
  status: "disponible" | "utilizado";
  number: number | null;
  participationId: string | null;
  createdAt: string;
  usedAt: string | null;
};

type NumberRecord = {
  number: number;
  status: "disponible" | "confirmado";
  participationId: string | null;
};

type ParticipationRecord = {
  id: string;
  number: number;
  codeId: string;
  fullName: string;
  phone: string;
  email: string | null;
  createdAt: string;
};

type Store = {
  codes: CodeRecord[];
  numbers: NumberRecord[];
  participations: ParticipationRecord[];
};

export type PublicNumber = {
  number: number;
  status: "disponible" | "confirmado";
};

export type StoreResult =
  | { ok: true; participationId: string; number: number }
  | { ok: false; error: string; status: number };

const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const privateDir = join(process.cwd(), "private");
const statePath = join(privateDir, "raffle-state.json");
const csvPath = join(privateDir, "codigos-rifa.csv");

let queue: Promise<void> = Promise.resolve();

function withLock<T>(task: () => T): Promise<T> {
  const run = queue.then(task);
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

function hashesMatch(left: string, right: string) {
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function findCode(store: Store, code: string) {
  const hash = hashCode(code);
  return store.codes.find((record) => hashesMatch(record.codeHash, hash)) ?? null;
}

function receiptId(store: Store) {
  const used = new Set(store.participations.map((item) => item.id));
  let id = "";
  do {
    id = "PT-";
    for (let index = 0; index < 8; index += 1) {
      id += alphabet[randomInt(alphabet.length)];
    }
  } while (used.has(id));
  return id;
}

function readStoreFile(): Store | null {
  if (!existsSync(statePath)) {
    return null;
  }

  const parsed: unknown = JSON.parse(readFileSync(statePath, "utf8"));
  if (!isStore(parsed)) {
    throw new Error("invalid-store");
  }
  return parsed;
}

function isStore(value: unknown): value is Store {
  if (!value || typeof value !== "object") {
    return false;
  }
  const store = value as Store;
  return Array.isArray(store.codes) && Array.isArray(store.numbers) && Array.isArray(store.participations);
}

function createStore(): Store {
  if (!existsSync(csvPath)) {
    throw new Error("missing-codes");
  }

  const lines = readFileSync(csvPath, "utf8")
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .filter(Boolean);

  const codes: CodeRecord[] = lines.map((line) => {
    const [id, code, , , createdAt] = line.split(",");
    return {
      id,
      codeHash: hashCode(code.replace(/[^A-Za-z0-9]/g, "").toUpperCase()),
      status: "disponible",
      number: null,
      participationId: null,
      createdAt: createdAt || new Date().toISOString(),
      usedAt: null,
    };
  });

  if (codes.length !== raffleTotalNumbers) {
    throw new Error("missing-codes");
  }

  const numbers: NumberRecord[] = Array.from({ length: raffleTotalNumbers }, (_, index) => ({
    number: index + 1,
    status: "disponible",
    participationId: null,
  }));

  return { codes, numbers, participations: [] };
}

function loadStore() {
  return readStoreFile() ?? createStore();
}

function replaceFile(path: string, contents: string) {
  mkdirSync(privateDir, { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, contents);
  copyFileSync(temporary, path);
  unlinkSync(temporary);
}

function saveStore(store: Store) {
  replaceFile(statePath, JSON.stringify(store));
}

function markCsvUsed(code: string, number: number, participationId: string, usedAt: string) {
  if (!existsSync(csvPath)) {
    return;
  }

  const lines = readFileSync(csvPath, "utf8").trim().split(/\r?\n/);
  const next = lines.map((line, index) => {
    if (index === 0) {
      return line;
    }
    const columns = line.split(",");
    const canonical = (columns[1] ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (canonical !== code) {
      return line;
    }
    columns[2] = "utilizado";
    columns[3] = String(number);
    columns[5] = usedAt;
    columns[6] = participationId;
    return columns.join(",");
  });

  replaceFile(csvPath, `${next.join("\n")}\n`);
}

function failure(error: string, status: number): StoreResult {
  return { ok: false, error, status };
}

function checkCode(store: Store, code: string, number: number): StoreResult | null {
  const record = findCode(store, code);
  if (!record || record.status !== "disponible") {
    return failure(invalidCode, 400);
  }

  const slot = store.numbers.find((item) => item.number === number);
  if (!slot || slot.status !== "disponible") {
    return failure(numberTaken, 409);
  }

  return null;
}

export function listNumbers(): Promise<PublicNumber[]> {
  return withLock(() => {
    const store = loadStore();
    saveStore(store);
    return store.numbers.map((item) => ({ number: item.number, status: item.status }));
  });
}

export function validateCode(code: string, number: number): Promise<StoreResult> {
  return withLock(() => {
    try {
      const store = loadStore();
      return checkCode(store, code, number) ?? { ok: true, participationId: "", number };
    } catch {
      return failure(notReady, 503);
    }
  });
}

export function registerParticipation(input: RegistrationInput): Promise<StoreResult> {
  return withLock(() => {
    try {
      const store = loadStore();
      const rejected = checkCode(store, input.code, input.number);
      if (rejected) {
        return rejected;
      }

      const record = findCode(store, input.code);
      const slot = store.numbers.find((item) => item.number === input.number);
      if (!record || !slot) {
        return failure(invalidCode, 400);
      }

      const createdAt = new Date().toISOString();
      const participationId = receiptId(store);
      store.participations.push({
        id: participationId,
        number: input.number,
        codeId: record.id,
        fullName: input.fullName,
        phone: input.phone,
        email: input.email || null,
        createdAt,
      });
      record.status = "utilizado";
      record.number = input.number;
      record.participationId = participationId;
      record.usedAt = createdAt;
      slot.status = "confirmado";
      slot.participationId = participationId;
      saveStore(store);
      markCsvUsed(input.code, input.number, participationId, createdAt);
      return { ok: true, participationId, number: input.number };
    } catch {
      return failure(notReady, 503);
    }
  });
}
