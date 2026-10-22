import { NumberBoard } from "@/components/raffle/number-board";
import { SectionHeading } from "@/components/landing/section-heading";

const steps = [
  {
    title: "Recibe un código",
    text: "El voluntario responsable te lo entrega después de coordinar el aporte. El código no aparece en esta página.",
  },
  {
    title: "Elige un número",
    text: "Toca un número disponible. El tablero marca en amarillo el que estás revisando.",
  },
  {
    title: "Valida el código",
    text: "Sin un código válido el número no queda registrado. El registro tampoco confirma un pago.",
  },
];

export function RaffleIntro() {
  return (
    <section id="rifa" className="scroll-mt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-[2rem] border border-line bg-paper shadow-[0_20px_50px_-32px_rgba(142,48,80,0.45)]">
          <div className="bg-cream-deep px-6 py-8 text-ink sm:px-10 sm:py-10">
            <SectionHeading
              eyebrow="Rifa solidaria"
              title="Elige un número del 1 al 100"
            />
          </div>

          <div className="px-4 py-6 sm:px-8 sm:py-8">
            <ol className="grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-3xl bg-cream px-4 py-4">
                  <span className="font-display text-sm text-rose-deep">
                    {index + 1}
                  </span>
                  <h3 className="mt-1 font-display text-lg text-ink">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{step.text}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <NumberBoard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
