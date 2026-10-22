import { ActionLink } from "@/components/ui/action-link";
import { SectionHeading } from "@/components/landing/section-heading";
import {
  initiatives,
  initiativeStatusLabel,
  type InitiativeStatus,
} from "@/lib/initiatives";
import Image from "next/image";

const statusClass: Record<InitiativeStatus, string> = {
  activa: "bg-lime text-ink",
  proximamente: "bg-cream-deep text-earth",
  finalizada: "bg-ink/5 text-muted",
};

export function Initiatives() {
  return (
    <section id="iniciativas" className="scroll-mt-24 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading eyebrow="Iniciativas" title="Campañas para cuidar de verdad">
          Cada iniciativa indica cómo participar y, si ya está definido, cuál
          es su objetivo. Se pueden sumar nuevas sin cambiar esta página.
        </SectionHeading>

        <ul className="mt-8 grid gap-5">
          {initiatives.map((initiative) => (
            <li
              key={initiative.id}
              className="overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[0_16px_40px_-28px_rgba(44,36,28,0.45)] md:grid md:grid-cols-5"
            >
              <div className="relative min-h-56 md:col-span-2">
                <Image
                  src={initiative.image}
                  alt={initiative.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col p-6 md:col-span-3 md:p-8">
                <span
                  className={`w-fit rounded-full px-3 py-1 text-xs font-bold tracking-wide uppercase ${statusClass[initiative.status]}`}
                >
                  {initiativeStatusLabel[initiative.status]}
                </span>
                <h3 className="mt-4 font-display text-3xl text-ink">
                  {initiative.name}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">
                  {initiative.description}
                </p>
                {initiative.goalLabel ? (
                  <p className="mt-4 font-semibold text-ink">
                    {initiative.goalLabel}
                  </p>
                ) : null}
                {initiative.goalNote ? (
                  <p className="mt-1 text-sm text-muted">{initiative.goalNote}</p>
                ) : null}
                <p className="mt-4 text-sm leading-relaxed text-ink">
                  <span className="font-bold">Cómo participar. </span>
                  {initiative.participation}
                </p>
                <div className="mt-6">
                  <ActionLink href={initiative.href}>
                    {initiative.actionLabel}
                  </ActionLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
