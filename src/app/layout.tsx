import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Patitas — Ayuda para perritos y gatitos",
  description:
    "Plataforma solidaria para apoyar a perros y gatos en situación de calle. Conoce cómo ayudar y la rifa solidaria de Q5 por número.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col bg-cream text-ink">{children}</body>
    </html>
  );
}
