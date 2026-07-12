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
import { TermHero } from "@/components/terminal/TermHero";
import { TermLogos } from "@/components/terminal/TermLogos";
import { TermProjects } from "@/components/terminal/TermProjects";
import { TermAbout } from "@/components/terminal/TermAbout";
import { TermExperience } from "@/components/terminal/TermExperience";
import { TermContact } from "@/components/terminal/TermContact";

export default function HomePage() {
  return (
    <>
      {/* Skin Mono (rama portfolio-professional-black-and-white) */}
      <MonoHero />

      {/* Skin Terminal v2 — dev mode (secciones propias, ocultas en otros skins) */}
      <TermHero />

      {/* Resto de skins (ocultos en mono/terminal vía CSS) */}
      <Hero />
      <Marquee />
      <TermLogos />

      {/* Compartido: asistente IA justo debajo del hero */}
      <ChatSection />

      {/* Storytelling mono: quién soy → trayectoria → proyectos */}
      <MonoAbout />
      <MonoJourney />
      <MonoShowcase />

      {/* Storytelling terminal: repos → about dev → git log → ssh */}
      <TermProjects />
      <TermAbout />
      <TermExperience />
      <TermContact />

      <ProjectsSection />
      <AboutSection />
      <CodeWorkflowSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
