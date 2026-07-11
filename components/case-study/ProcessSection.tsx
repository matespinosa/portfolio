import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function ProcessSection({ project }: { project: Project }) {
  return (
    <section className="section">
      <div className="container case-grid">
        <Reveal className="case-block">
          <p className="section__eyebrow">Overview</p>
          <h2 className="section__title">Contexto</h2>
          <p className="case-prose">{project.overview}</p>
        </Reveal>
        <Reveal className="case-block">
          <p className="section__eyebrow">Challenge</p>
          <h2 className="section__title">El problema</h2>
          <p className="case-prose">{project.challenge}</p>
        </Reveal>
        <div className="case-block case-block--full">
          <Reveal>
            <p className="section__eyebrow">Process</p>
            <h2 className="section__title">Cómo lo abordé</h2>
          </Reveal>
          <ol className="case-process">
            {project.process.map((step, i) => (
              <Reveal as="li" key={step.title}>
                <span className="skills-list__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <Reveal className="case-block case-block--full">
          <p className="section__eyebrow">Tools</p>
          <ul className="tools__list">
            {project.tools.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
