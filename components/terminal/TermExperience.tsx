"use client";

import { motion } from "framer-motion";
import { experience } from "@/content/experience";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Hash FNV-1a determinista para pintar "commits" estables por empresa. */
function fakeHash(seed: string): string {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "-");
}

/**
 * Experiencia del skin Terminal: la trayectoria como `git log`, con hashes
 * deterministas, refs por empresa y una rama vertical que conecta los nodos.
 */
export function TermExperience() {
  return (
    <section className="term-section term-exp" id="experiencia-term">
      <div className="container">
        <motion.header
          className="term-section__head"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="term-eyebrow">
            <span className="term-prompt">$</span> git log --oneline --carrera
          </p>
          <h2 className="term-section__title">
            Historial de <em>commits.</em>
          </h2>
        </motion.header>

        <ol className="term-commits">
          {experience.map((job, index) => (
            <motion.li
              key={`${job.company}-${job.period}`}
              className="term-commit"
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: EASE, delay: index * 0.05 }}
            >
              <span className="term-commit__node" aria-hidden="true" />
              <div className="term-commit__card">
                <p className="term-commit__meta">
                  <code className="term-commit__hash">
                    {fakeHash(`${job.company}-${job.period}`)}
                  </code>
                  <span className="term-commit__refs">
                    ({index === 0 ? "HEAD → main, " : ""}
                    {slugify(job.company)})
                  </span>
                  <time className="term-commit__time">{job.period}</time>
                </p>
                <h3 className="term-commit__title">
                  {job.role} · {job.company}
                </h3>
                <p className="term-commit__desc">{job.description}</p>
                <ul className="term-commit__tags">
                  {job.tags.map((tag) => (
                    <li key={tag}>refs/{slugify(tag)}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
