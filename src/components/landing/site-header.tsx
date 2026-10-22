"use client";

import { Menu, PawPrint, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ActionLink } from "@/components/ui/action-link";
import { navLinks, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Saltar al contenido
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#inicio" className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-md bg-lime text-ink">
            <PawPrint aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="block font-display text-xl leading-none text-ink">
              {site.name}
            </span>
            <span className="mt-1 block text-xs font-semibold tracking-wide text-muted">
              {site.tagline}
            </span>
          </span>
        </a>

        <nav aria-label="Secciones" className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted transition hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <ActionLink href="#como-ayudar">Quiero ayudar</ActionLink>
        </div>

        <button
          type="button"
          className="inline-flex size-11 items-center justify-center rounded-2xl border border-line text-ink lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <nav
          id="menu-movil"
          aria-label="Secciones"
          className="border-t border-line px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-2xl px-3 py-3 text-base font-semibold text-ink hover:bg-cream"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <ActionLink
              href="#como-ayudar"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Quiero ayudar
            </ActionLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
