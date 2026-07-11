import { experience, tools } from "@/content/experience";
import { Reveal } from "@/components/ui/Reveal";

export function ExperienceSection() {
  return (
    <section className="section" id="experiencia">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">03 — Experiencia</p>
          <h2 className="section__title">
            Trayectoria <em>profesional</em>
          </h2>
        </Reveal>

        <ol className="timeline">
          {experience.map((item) => (
            <Reveal as="li" className="timeline__item" key={item.period}>
              <div className="timeline__period">{item.period}</div>
              <div className="timeline__body">
                <h3 className="timeline__role">{item.role}</h3>
                <p className="timeline__company">{item.company}</p>
                <p className="timeline__desc">{item.description}</p>
                <div className="timeline__tags">
                  {item.tags.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="tools">
          <h3 className="tools__title">Herramientas del día a día</h3>
          <ul className="tools__list">
            {tools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
