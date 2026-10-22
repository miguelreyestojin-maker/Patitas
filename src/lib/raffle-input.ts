export type RegistrationInput = {
  code: string;
  number: number;
  fullName: string;
  phone: string;
  email: string;
};

export function normalizeCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function parseRegistration(
  body: unknown,
): { ok: true; value: RegistrationInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Los datos no son válidos." };
  }

  const data = body as Record<string, unknown>;
  const code = typeof data.code === "string" ? normalizeCode(data.code) : "";
  const number = typeof data.number === "number" ? data.number : Number.NaN;
  const fullName = typeof data.fullName === "string" ? data.fullName.trim() : "";
  const phone = typeof data.phone === "string" ? data.phone.replace(/\D/g, "") : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";

  if (code.length < 8 || code.length > 32) {
    return { ok: false, error: "Escribe el código completo que te entregó el voluntario." };
  }

  if (!Number.isInteger(number) || number < 1 || number > 100) {
    return { ok: false, error: "El número elegido no es válido." };
  }

  if (fullName.length < 2 || fullName.length > 80) {
    return { ok: false, error: "Escribe tu nombre completo." };
  }

  if (phone.length < 8 || phone.length > 15) {
    return { ok: false, error: "Escribe un teléfono o WhatsApp válido." };
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "El correo electrónico no es válido." };
  }

  return { ok: true, value: { code, number, fullName, phone, email } };
}

export function parseCodeCheck(
  body: unknown,
): { ok: true; code: string; number: number } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Los datos no son válidos." };
  }

  const data = body as Record<string, unknown>;
  const parsed = parseRegistration({
    code: data.code,
    number: data.number,
    fullName: "Participante",
    phone: "00000000",
    email: "",
  });

  if (!parsed.ok) {
    return parsed;
  }

  return { ok: true, code: parsed.value.code, number: parsed.value.number };
}
