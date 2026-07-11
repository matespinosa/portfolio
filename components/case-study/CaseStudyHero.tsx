import Link from "next/link";
import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function CaseStudyHero({ project }: { project: Project }) {
  return (
    <section className="case-hero">
      <div className="container">
        <Reveal>
          <Link href="/#proyectos" className="case-back">
            ← Proyectos
          </Link>
        </Reveal>
        <Reveal as="p" className="section__eyebrow">
          Caso de estudio
          {project.isPlaceholder ? " · contenido de ejemplo" : ""}
        </Reveal>
        <Reveal as="h1" className="case-hero__title">
          {project.title}
        </Reveal>
        <Reveal as="p" className="case-hero__summary">
          {project.summary}
        </Reveal>
        <Reveal className="case-hero__meta">
          <div>
            <span className="case-hero__label">Rol</span>
            <strong>{project.role}</strong>
          </div>
          <div>
            <span className="case-hero__label">Timeline</span>
            <strong>{project.timeline}</strong>
          </div>
          <div>
            <span className="case-hero__label">Tags</span>
            <div className="timeline__tags">
              {project.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal className={`project__media project__media--${project.mediaVariant} case-hero__art`}>
          <svg
            viewBox={project.art.viewBox}
            className="project__art"
            role="img"
            aria-label={project.art.ariaLabel}
            dangerouslySetInnerHTML={{ __html: project.art.shapes }}
          />
        </Reveal>
      </div>
    </section>
  );
}
