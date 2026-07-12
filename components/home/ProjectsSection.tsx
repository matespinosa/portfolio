import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "./ProjectCard";

export function ProjectsSection() {
  return (
    <section className="section" id="proyectos">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">Proyectos</p>
          <h2 className="section__title">
            Trabajo <em>seleccionado</em>
          </h2>
          <p className="section__desc">
            Una muestra de proyectos donde el diseño movió métricas de negocio y mejoró la
            vida de los usuarios.
          </p>
        </Reveal>
        <div className="projects">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
