import { About } from "@/components/landing/about";
import { Hero } from "@/components/landing/hero";
import { HowToHelp } from "@/components/landing/how-to-help";
import { Initiatives } from "@/components/landing/initiatives";
import { RaffleIntro } from "@/components/landing/raffle-intro";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Transparency } from "@/components/landing/transparency";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="contenido" className="flex-1">
        <Hero />
        <HowToHelp />
        <Initiatives />
        <RaffleIntro />
        <About />
        <Transparency />
      </main>
      <SiteFooter />
    </>
  );
}
