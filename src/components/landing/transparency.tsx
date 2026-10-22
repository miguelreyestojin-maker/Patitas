import { SectionHeading } from "@/components/landing/section-heading";

export function Transparency() {
  return (
    <section id="transparencia" className="scroll-mt-24 pb-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-[1.75rem] border border-line bg-paper p-6 sm:p-8">
          <SectionHeading eyebrow="Transparencia" title="Así se usan los recursos">
            El dinero recaudado en cada iniciativa se entrega a los voluntarios
            que la organizan. Ellos administran esos recursos para el propósito
            de la iniciativa: alimento, medicamentos, cuidados y otras
            necesidades de los animales.
          </SectionHeading>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Registrar una participación con un código no confirma una
            transferencia bancaria. El cobro lo coordinan los voluntarios
            responsables, fuera de esta página. No pedimos datos de tarjetas.
          </p>
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
          Privacidad: si más adelante compartes tu nombre o un teléfono para
          participar, esos datos se usan solo para gestionar esa participación
          y comunicarnos contigo. No se publican en la página ni se incluyen
          en la dirección del navegador.
        </p>
      </div>
    </section>
  );
}
