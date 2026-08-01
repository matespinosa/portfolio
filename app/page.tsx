import { MonoHero } from "@/components/mono/MonoHero";
import { MonoAbout } from "@/components/mono/MonoAbout";
import { MonoJourney } from "@/components/mono/MonoJourney";
import { MonoShowcase } from "@/components/mono/MonoShowcase";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <MonoHero />
      <MonoAbout />
      <MonoJourney />
      <MonoShowcase />
      <ContactSection />
    </>
  );
}
