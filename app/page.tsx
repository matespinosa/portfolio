import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { AIWorkflow } from "@/components/AIWorkflow";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <AIWorkflow />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
