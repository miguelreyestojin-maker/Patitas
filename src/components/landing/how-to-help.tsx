import { HandCoins, Package, Ticket, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/landing/section-heading";
import { ActionLink } from "@/components/ui/action-link";
import { donations } from "@/lib/site";

type HelpCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  note: string;
  actionLabel?: string;
  actionHref?: string;
  items?: string[];
};

function configuredAction(instructions: string, label: string, href: string) {
  const hasAction = Boolean(instructions && label && href);

  return {
    note:
      instructions ||
      "Las instrucciones se mostrarán aquí cuando los responsables las compartan.",
    actionLabel: hasAction ? label : undefined,
    actionHref: hasAction ? href : undefined,
  };
}

const monetary = configuredAction(
  donations.monetaryInstructions,
  donations.monetaryActionLabel,
  donations.monetaryActionHref,
);

const inKind = configuredAction(
  donations.inKindInstructions,
  donations.inKindActionLabel,
  donations.inKindActionHref,
);

const scenes = [
  {
    src: "/photos/perro-calle.jpg",
    alt: "Un perro delgado de pie en la acera",
  },
  {
    src: "/photos/perritos.jpg",
    alt: "Dos perros en la calle, junto a unos carros",
  },
  {
    src: "/photos/gatitos.jpg",
    alt: "Tres gatitos blanco y negro sobre una repisa de plástico",
  },
];

const cards: HelpCard[] = [
  {
    title: "Donaciones económicas",
    description:
      "Un aporte en quetzales ayuda a cubrir alimento, medicinas y otros cuidados de los animales.",
    icon: HandCoins,
    ...monetary,
  },
  {
    title: "Donaciones en especie",
    description:
      "Alimento, concentrado, medicamentos, productos de limpieza, mantas y otros artículos que pidan los voluntarios.",
    icon: Package,
    items: donations.requestedItems,
    ...inKind,
  },
  {
    title: "Participa en nuestras iniciativas",
    description:
      "Súmate a rifas, actividades solidarias y campañas para reunir lo que los animales necesitan.",
    icon: Ticket,
    note: "La primera iniciativa abierta es la rifa solidaria de Q5 por número.",
    actionLabel: "Ver iniciativas",
    actionHref: "#iniciativas",
  },
];

export function HowToHelp() {
  return (
    <section id="como-ayudar" className="scroll-mt-24 py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Cómo puedes ayudar" title="Hay más de una forma de sumarte">
          Donaciones económicas, donaciones en especie o una iniciativa. Elige
          la que te quede más cerca.
        </SectionHeading>

        <ul className="mt-8 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <li
                key={card.title}
                className="flex flex-col overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_20px_44px_-28px_rgba(142,48,80,0.55)] transition duration-200 hover:-translate-y-1"
              >
                <div className="h-2 bg-lime" />
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-lime text-ink">
                    <Icon aria-hidden="true" className="size-6" />
                  </span>
                  <h3 className="mt-6 font-display text-3xl leading-tight text-ink">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-ink">
                    {card.description}
                  </p>
                  {card.items && card.items.length > 0 ? (
                    <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-ink">
                      {card.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="mt-4 text-sm leading-relaxed text-muted">{card.note}</p>
                  {card.actionHref && card.actionLabel ? (
                    <div className="mt-auto pt-7">
                      <ActionLink href={card.actionHref}>{card.actionLabel}</ActionLink>
                    </div>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>

        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {scenes.map((scene) => (
            <li key={scene.src} className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem]">
              <Image
                src={scene.src}
                alt={scene.alt}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
