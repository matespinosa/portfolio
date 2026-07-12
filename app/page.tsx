import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ChatSection } from "@/components/home/ChatSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CodeWorkflowSection } from "@/components/home/CodeWorkflowSection";
import { MonoHero } from "@/components/mono/MonoHero";
import { MonoAbout } from "@/components/mono/MonoAbout";
import { MonoJourney } from "@/components/mono/MonoJourney";
import { MonoShowcase } from "@/components/mono/MonoShowcase";

export default function HomePage() {
  return (
    <>
      {/* Skin Mono (rama portfolio-professional-black-and-white) */}
      <MonoHero />

      {/* Resto de skins (ocultos en mono vía CSS) */}
      <Hero />
      <Marquee />

      {/* Compartido: asistente IA justo debajo del hero */}
      <ChatSection />

      {/* Storytelling mono: quién soy → trayectoria → proyectos */}
      <MonoAbout />
      <MonoJourney />
      <MonoShowcase />

      <ProjectsSection />
      <AboutSection />
      <CodeWorkflowSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
