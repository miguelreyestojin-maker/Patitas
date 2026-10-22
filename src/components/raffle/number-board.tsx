"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent } from "react";
import { rafflePrice, raffleTotalNumbers } from "@/lib/initiatives";
import {
  raffleStatusClass,
  raffleStatusLabel,
  type RaffleNumberStatus,
} from "@/lib/raffle";
import { formatQuetzales } from "@/lib/site";

const numbers = Array.from({ length: raffleTotalNumbers }, (_, index) => index + 1);

const legend: RaffleNumberStatus[] = [
  "disponible",
  "seleccionado",
  "reservado",
  "confirmado",
  "bloqueado",
];

const fieldClass =
  "mt-2 w-full rounded-none border border-line bg-cream px-4 py-3 text-ink outline-none focus:border-rose-deep";

type Step = "codigo" | "datos" | "listo";

type Receipt = {
  participationId: string;
  number: number;
};

async function requestJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let payload: { error?: string; participationId?: string; number?: number } = {};
  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "No se pudo completar la solicitud. Inténtalo de nuevo.");
  }

  return payload;
}

export function NumberBoard() {
  const [confirmed, setConfirmed] = useState<Set<number>>(new Set());
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("codigo");
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);

  const loadNumbers = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch("/api/raffle", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("fail");
      }
      const data = (await response.json()) as {
        numbers?: { number: number; status: "disponible" | "confirmado" }[];
      };
      const taken = new Set(
        (data.numbers ?? [])
          .filter((item) => item.status === "confirmado")
          .map((item) => item.number),
      );
      setConfirmed(taken);
      setReady(true);
    } catch {
      setReady(false);
      setLoadError("No se pudo cargar el tablero. Revisa tu conexión e intenta de nuevo.");
    }
  }, []);

  useEffect(() => {
    void loadNumbers();
  }, [loadNumbers]);

  const closeDialog = useCallback(() => {
    setSelected(null);
    setStep("codigo");
    setCode("");
    setFullName("");
    setPhone("");
    setEmail("");
    setError(null);
    setReceipt(null);
    setSubmitting(false);
    returnFocus.current?.focus();
  }, []);

  useEffect(() => {
    if (selected === null) {
      return;
    }

    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        closeDialog();
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeDialog, selected, step, submitting]);

  function choose(number: number, button: HTMLButtonElement) {
    if (confirmed.has(number)) {
      return;
    }
    returnFocus.current = button;
    setSelected(number);
    setStep("codigo");
    setCode("");
    setFullName("");
    setPhone("");
    setEmail("");
    setError(null);
    setReceipt(null);
  }

  async function onValidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected === null || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await requestJson("/api/raffle/validar", { code, number: selected });
      setStep("datos");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo validar el código.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selected === null || submitting) {
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await requestJson("/api/raffle/registrar", {
        code,
        number: selected,
        fullName,
        phone,
        email,
      });
      setReceipt({
        participationId: result.participationId ?? "",
        number: result.number ?? selected,
      });
      setStep("listo");
      await loadNumbers();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo registrar la participación.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <ul className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Estados de los números">
        {legend.map((status) => (
          <li key={status} className="flex items-center gap-2 text-sm text-muted">
            <span
              aria-hidden="true"
              className={`size-4 rounded-md border ${raffleStatusClass[status]}`}
            />
            {raffleStatusLabel[status]}
          </li>
        ))}
      </ul>

      {loadError ? (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p className="text-sm text-rose-deep" role="alert">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => void loadNumbers()}
            className="rounded-full border border-line px-4 py-2 text-sm font-bold text-ink"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      <div
        className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10"
        role="group"
        aria-label="Números de la rifa, del 1 al 100"
      >
        {numbers.map((number) => {
          const status: RaffleNumberStatus = confirmed.has(number)
            ? "confirmado"
            : number === selected
              ? "seleccionado"
              : "disponible";
          const locked = !ready || status === "confirmado";

          return (
            <button
              key={number}
              type="button"
              disabled={locked}
              aria-pressed={status === "seleccionado"}
              aria-label={`Número ${number}, ${raffleStatusLabel[status]}`}
              onClick={(event) => choose(number, event.currentTarget)}
              className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold tabular-nums transition duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-deep disabled:cursor-not-allowed ${raffleStatusClass[status]}`}
            >
              {number}
            </button>
          );
        })}
      </div>

      {selected !== null ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => {
              if (!submitting) {
                closeDialog();
              }
            }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-md rounded-none border border-line bg-paper p-6 shadow-[0_24px_60px_-28px_rgba(20,48,68,0.45)]"
          >
            <p className="text-sm font-semibold tracking-wide text-rose-deep uppercase">
              Rifa solidaria
            </p>
            <h3 id={titleId} className="mt-1 font-display text-3xl text-ink">
              Número {selected}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Precio: {formatQuetzales(rafflePrice)}. El código lo entrega el
              voluntario responsable. Registrarlo no confirma un pago.
            </p>

            {step === "codigo" ? (
              <form className="mt-5" onSubmit={(event) => void onValidate(event)}>
                <label htmlFor="codigo-activacion" className="text-sm font-semibold text-ink">
                  Código de activación
                </label>
                <input
                  ref={inputRef}
                  id="codigo-activacion"
                  name="codigo"
                  value={code}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={64}
                  onChange={(event) => setCode(event.target.value)}
                  className={fieldClass}
                />
                {error ? <FormError message={error} /> : null}
                <DialogActions submitting={submitting} submitLabel="Validar código" onClose={closeDialog} />
              </form>
            ) : null}

            {step === "datos" ? (
              <form className="mt-5" onSubmit={(event) => void onRegister(event)}>
                <label htmlFor="nombre" className="text-sm font-semibold text-ink">
                  Nombre completo
                </label>
                <input
                  ref={inputRef}
                  id="nombre"
                  name="nombre"
                  value={fullName}
                  autoComplete="name"
                  maxLength={80}
                  onChange={(event) => setFullName(event.target.value)}
                  className={fieldClass}
                />
                <label htmlFor="telefono" className="mt-4 block text-sm font-semibold text-ink">
                  Teléfono o WhatsApp
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  value={phone}
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={20}
                  onChange={(event) => setPhone(event.target.value)}
                  className={fieldClass}
                />
                <label htmlFor="correo" className="mt-4 block text-sm font-semibold text-ink">
                  Correo electrónico, opcional
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  value={email}
                  autoComplete="email"
                  maxLength={80}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                />
                {error ? <FormError message={error} /> : null}
                <DialogActions
                  submitting={submitting}
                  submitLabel="Registrar participación"
                  onClose={closeDialog}
                />
              </form>
            ) : null}

            {step === "listo" && receipt ? (
              <div className="mt-5">
                <p className="text-sm leading-relaxed text-ink" role="status">
                  ¡Gracias por apoyar esta causa! Tu participación ha sido
                  registrada. Guarda tu número y tu comprobante de participación.
                </p>
                <dl className="mt-4 grid gap-3">
                  <div className="rounded-none bg-cream px-4 py-3">
                    <dt className="text-xs font-bold tracking-wide text-rose-deep uppercase">
                      Número
                    </dt>
                    <dd className="font-display text-2xl text-ink">{receipt.number}</dd>
                  </div>
                  <div className="rounded-none bg-cream px-4 py-3">
                    <dt className="text-xs font-bold tracking-wide text-rose-deep uppercase">
                      Comprobante
                    </dt>
                    <dd className="font-display text-2xl text-ink">{receipt.participationId}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Este registro no confirma un pago bancario.
                </p>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-none bg-lime px-5 py-3 text-sm font-bold text-ink hover:bg-clay"
                >
                  Cerrar
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p className="mt-2 text-sm text-rose-deep" role="alert">
      {message}
    </p>
  );
}

function DialogActions({
  submitting,
  submitLabel,
  onClose,
}: {
  submitting: boolean;
  submitLabel: string;
  onClose: () => void;
}) {
  return (
    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex flex-1 items-center justify-center rounded-none bg-lime px-5 py-3 text-sm font-bold text-ink hover:bg-clay disabled:opacity-60"
      >
        {submitting ? "Espera…" : submitLabel}
      </button>
      <button
        type="button"
        disabled={submitting}
        onClick={onClose}
        className="inline-flex flex-1 items-center justify-center rounded-none border border-line bg-paper px-5 py-3 text-sm font-bold text-ink hover:bg-cream disabled:opacity-60"
      >
        Cerrar
      </button>
    </div>
  );
}
