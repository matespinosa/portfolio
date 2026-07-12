"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { projects } from "@/content/projects";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Proyectos del skin Terminal: cada caso es un "repo" en su propia ventana,
 * con metadata git-style (tags, métrica destacada) y hover con glow.
 */
export function TermProjects() {
  return (
    <section className="term-section term-projects" id="proyectos-term">
      <div className="container">
        <motion.header
          className="term-section__head"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="term-eyebrow">
            <span className="term-prompt">$</span> ls ~/proyectos --sort=impacto
          </p>
          <h2 className="term-section__title">
            Casos con impacto <em>medible.</em>
          </h2>
          <p className="term-section__desc">
            Fintech, banca B2B y plataformas: diseñados con research, validados con usuarios
            y shippeados con equipos de ingeniería.
          </p>
        </motion.header>

        <div className="term-repos">
          {projects.map((project, index) => (
            <motion.article
              key={project.slug}
              className="term-repo"
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, ease: EASE, delay: (index % 2) * 0.12 }}
            >
              <Link href={`/proyectos/${project.slug}`} className="term-repo__link">
                <header className="term-repo__chrome">
                  <span className="term-dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <code className="term-repo__file">{project.slug}.case</code>
                  <span className="term-repo__year">{project.year}</span>
                </header>

                <div className="term-repo__body">
                  <h3 className="term-repo__name">{project.name}</h3>
                  <p className="term-repo__summary">{project.summary}</p>
                </div>

                <footer className="term-repo__meta">
                  <ul className="term-repo__tags">
                    {project.tags.map((tag) => (
                      <li key={tag}>[{tag.toLowerCase()}]</li>
                    ))}
                  </ul>
                  <span className="term-repo__metric" title={project.results[0]?.label}>
                    ★ {project.results[0]?.metric}
                  </span>
                  <span className="term-repo__open">
                    abrir case
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7M17 7H8M17 7v9" />
                    </svg>
                  </span>
                </footer>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
