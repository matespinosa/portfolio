import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";

export function Gallery({ project }: { project: Project }) {
  return (
    <section className="section section--alt">
      <div className="container">
        <Reveal className="section__head">
          <p className="section__eyebrow">Gallery</p>
          <h2 className="section__title">
            Momentos del <em>producto</em>
          </h2>
        </Reveal>
        <div className="case-gallery">
          {project.gallery.map((item) => (
            <Reveal as="article" className="case-gallery__item" key={item.title}>
              <div className={`project__media project__media--${item.variant}`}>
                <svg
                  viewBox={project.art.viewBox}
                  className="project__art"
                  role="img"
                  aria-label={item.title}
                  dangerouslySetInnerHTML={{ __html: project.art.shapes }}
                />
              </div>
              <h3>{item.title}</h3>
              <p>{item.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
