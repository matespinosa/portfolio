import Link from "next/link";
import { projects } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";

export function CaseStudyNav({ currentSlug }: { currentSlug: string }) {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <nav className="section section--alt case-nav" aria-label="Otros casos">
      <div className="container case-nav__inner">
        {prev ? (
          <Reveal>
            <Link href={`/proyectos/${prev.slug}`} className="case-nav__link">
              <span>Anterior</span>
              <strong>{prev.name}</strong>
            </Link>
          </Reveal>
        ) : (
          <span />
        )}
        <Reveal>
          <Link href="/#proyectos" className="btn btn--ghost">
            Todos los proyectos
          </Link>
        </Reveal>
        {next ? (
          <Reveal>
            <Link href={`/proyectos/${next.slug}`} className="case-nav__link case-nav__link--next">
              <span>Siguiente</span>
              <strong>{next.name}</strong>
            </Link>
          </Reveal>
        ) : (
          <span />
        )}
      </div>
    </nav>
  );
}
