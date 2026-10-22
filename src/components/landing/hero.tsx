import { ActionLink } from "@/components/ui/action-link";
import { formatQuetzales } from "@/lib/site";
import { rafflePotential, rafflePrice, raffleTotalNumbers } from "@/lib/initiatives";
import Image from "next/image";

const notes = [
  {
    title: "Cada aporte cuenta",
    detail: "Las cifras de impacto se publicarán cuando sean verificadas.",
  },
  {
    title: `${raffleTotalNumbers} números`,
    detail: "Del 1 al 100, para la rifa solidaria.",
  },
  {
    title: `${formatQuetzales(rafflePrice)} por número`,
    detail: `Potencial de ${formatQuetzales(rafflePotential)} si se completan.`,
  },
];

export function Hero() {
  return (
    <section id="inicio" className="scroll-mt-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="rise">
          <p className="text-sm font-bold tracking-[0.14em] text-sage-deep uppercase">
            Guatemala · perritos y gatitos
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
            Una pequeña ayuda puede cambiar una vida.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            Un plato de comida, un medicamento o un pequeño aporte pueden
            marcar la diferencia para un animal que necesita una segunda
            oportunidad.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ActionLink href="#rifa">Participar en la rifa</ActionLink>
            <ActionLink href="#como-ayudar" variant="secondary">
              Descubrir cómo ayudar
            </ActionLink>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {notes.map((note) => (
              <li
                key={note.title}
                className="rounded-3xl border border-line bg-paper px-4 py-4"
              >
                <p className="font-display text-lg leading-tight text-ink">
                  {note.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {note.detail}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rise rise-delay relative pb-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_24px_50px_-28px_rgba(44,36,28,0.55)]">
            <Image
              src="/photos/hero.jpg"
              alt="Dos gatos comiendo alimento en el suelo, junto a un tubo"
              fill
              preload
              sizes="(max-width: 1024px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-4 max-w-xs rounded-3xl border border-line bg-paper/95 px-4 py-3 shadow-[0_16px_30px_-20px_rgba(44,36,28,0.6)] backdrop-blur sm:left-6">
            <p className="font-display text-lg text-ink">Cada aporte cuenta</p>
            <p className="text-sm text-muted">
              Comida, medicina o un número de la rifa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
