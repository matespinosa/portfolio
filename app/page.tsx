import { Hero } from "@/components/home/Hero";
import { Marquee } from "@/components/home/Marquee";
import { ChatSection } from "@/components/home/ChatSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { AboutSection } from "@/components/home/AboutSection";
import { ExperienceSection } from "@/components/home/ExperienceSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CodeWorkflowSection } from "@/components/home/CodeWorkflowSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ChatSection />
      <ProjectsSection />
      <AboutSection />
      <CodeWorkflowSection />
      <ExperienceSection />
      <ContactSection />
    </>
  );
}
