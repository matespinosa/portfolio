import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function ResultsSection({ project }: { project: Project }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">Results</p>
          <h2 className="section__title">
            Impacto <em>medible</em>
          </h2>
        </Reveal>
        <ul className="case-results">
          {project.results.map((r) => (
            <Reveal as="li" key={r.label}>
              <span className="case-results__metric">{r.metric}</span>
              <span className="case-results__label">{r.label}</span>
            </Reveal>
          ))}
        </ul>
        <Reveal as="p" className="case-prose case-outcome">
          {project.outcome}
        </Reveal>
      </div>
    </section>
  );
}
