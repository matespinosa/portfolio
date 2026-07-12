import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection() {
  return (
    <section className="section section--alt" id="sobre-mi">
      <div className="container">
        <div className="about">
          <div className="about__text">
            <Reveal as="p" className="section__eyebrow">
              Sobre mí
            </Reveal>
            <Reveal as="h2" className="section__title">
              Diseño con <em>intención</em>,
              <br />
              decido con <em>datos</em>
            </Reveal>
            {profile.about.map((p) => (
              <Reveal as="p" className="about__p" key={p.slice(0, 24)}>
                {p}
              </Reveal>
            ))}
            <Reveal>
              <Link href="/#contacto" className="btn btn--ghost">
                Descargar CV
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
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </Link>
            </Reveal>
          </div>
          <Reveal className="about__skills">
            <h3 className="about__skills-title">Qué hago</h3>
            <ul className="skills-list">
              {profile.skills.map((skill) => (
                <li key={skill.num}>
                  <span className="skills-list__num">{skill.num}</span>
                  <div>
                    <strong>{skill.title}</strong>
                    <p>{skill.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
