import Link from "next/link";
import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

function ArrowIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 17L17 7M17 7H8M17 7v9" />
    </svg>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal as="article" className="project">
      <Link
        href={`/proyectos/${project.slug}`}
        className="project__link"
        aria-label={`Ver caso de estudio: ${project.name}`}
      >
        <div className={`project__media project__media--${project.mediaVariant}`}>
          <svg
            viewBox={project.art.viewBox}
            className="project__art"
            role="img"
            aria-label={project.art.ariaLabel}
            dangerouslySetInnerHTML={{ __html: project.art.shapes }}
          />
        </div>
        <div className="project__info">
          <div className="project__meta">
            {project.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
            <span className="project__year">{project.year}</span>
          </div>
          <h3 className="project__title">{project.title}</h3>
          <p className="project__desc">{project.summary}</p>
          <span className="project__more">
            Ver caso de estudio
            <ArrowIcon />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
