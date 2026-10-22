import { SectionHeading } from "@/components/landing/section-heading";
import Image from "next/image";

export function About() {
  return (
    <section id="nosotros" className="scroll-mt-24 pb-16">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image
            src="/photos/cat.jpg"
            alt="Un gatito blanco y negro sentado sobre cartón"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow="Sobre nosotros" title="Un lugar para organizarse y ayudar">
            Patitas busca apoyar a perros y gatos en situación de calle mediante
            la colaboración entre ciudadanos, voluntarios y personas
            comprometidas con el bienestar animal.
          </SectionHeading>
          <p className="mt-4 leading-relaxed text-muted">
            La plataforma reúne iniciativas concretas: rifas, campañas de
            alimento, medicinas y otras formas de sumar recursos. Quienes
            organizan cada iniciativa reciben lo recaudado y lo administran
            para ese propósito.
          </p>
        </div>
      </div>
    </section>
  );
}
