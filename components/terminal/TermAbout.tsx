"use client";

import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { tools } from "@/content/experience";
import { TermWindow } from "@/components/terminal/TermWindow";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

/**
 * Sobre mí del skin Terminal: `cat sobre-mi.md` a la izquierda y los skills
 * como procesos corriendo (estilo htop) a la derecha, con el stack como flags.
 */
export function TermAbout() {
  return (
    <section className="term-section term-about" id="sobre-mi-term">
      <div className="container">
        <motion.header
          className="term-section__head"
          {...reveal}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="term-eyebrow">
            <span className="term-prompt">$</span> whoami --verbose
          </p>
          <h2 className="term-section__title">
            Diseño con mentalidad de <em>ingeniería.</em>
          </h2>
        </motion.header>

        <div className="term-about__grid">
          <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}>
            <TermWindow title="sobre-mi.md" meta="markdown" className="term-about__doc">
              <p className="term-line term-line--cmd">
                <span className="term-prompt">$</span> cat sobre-mi.md
              </p>
              <p className="term-about__heading"># {profile.name}</p>
              {profile.about.map((paragraph) => (
                <p className="term-about__copy" key={paragraph.slice(0, 24)}>
                  {paragraph}
                </p>
              ))}
              <p className="term-line term-line--dim">
                <span className="term-prompt">$</span> echo $UBICACION
              </p>
              <p className="term-line">
                &quot;{profile.location} · GMT-5&quot;
                <span className="term-caret" aria-hidden="true" />
              </p>
            </TermWindow>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}>
            <TermWindow title="skills — monitor" meta="htop" className="term-about__procs">
              <table className="term-procs" aria-label="Skills activos">
                <thead>
                  <tr>
                    <th scope="col">PID</th>
                    <th scope="col">PROCESO</th>
                    <th scope="col">ESTADO</th>
                  </tr>
                </thead>
                <tbody>
                  {profile.skills.map((skill) => (
                    <tr key={skill.num}>
                      <td className="term-procs__pid">{skill.num}</td>
                      <td>
                        <span className="term-procs__name">
                          {skill.title.toLowerCase().replaceAll(" ", "-")}
                        </span>
                        <span className="term-procs__desc">{skill.description}</span>
                      </td>
                      <td className="term-procs__status">
                        <span className="term-led" aria-hidden="true" />
                        running
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="term-about__tools" aria-label="Herramientas">
                <p className="term-line term-line--dim">
                  <span className="term-prompt">$</span> mateo --tools
                </p>
                <ul className="term-flags">
                  {tools.map((tool) => (
                    <li key={tool}>--{tool.toLowerCase().replaceAll(" ", "-")}</li>
                  ))}
                </ul>
              </div>
            </TermWindow>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
