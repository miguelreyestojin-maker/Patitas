import { PawPrint } from "lucide-react";
import { navLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-md bg-cream-deep text-ink">
            <PawPrint aria-hidden="true" className="size-4" />
          </span>
          <div>
            <p className="font-display text-lg text-ink">{site.name}</p>
            <p className="text-sm text-muted">
              Ayuda para perritos y gatitos en Guatemala.
            </p>
          </div>
        </div>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-4 gap-y-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#nosotros"
            className="text-sm font-semibold text-muted hover:text-ink"
          >
            Sobre nosotros
          </a>
        </nav>
      </div>
    </footer>
  );
}
