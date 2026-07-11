import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="container">
        <Reveal as="p" className="hero__badge">
          <span className="pulse-dot" aria-hidden="true" />
          {profile.availability}
        </Reveal>
        <h1 className="hero__title">
          {profile.heroLines.map((line) => (
            <Reveal as="span" className="hero__line" key={line.html}>
              <span dangerouslySetInnerHTML={{ __html: line.html }} />
            </Reveal>
          ))}
        </h1>
        <div className="hero__bottom">
          <Reveal as="p" className="hero__intro">
            Soy <strong>{profile.name}</strong>, Senior Product Designer con +8 años
            transformando problemas complejos en experiencias simples, útiles y memorables.
          </Reveal>
          <Reveal className="hero__cta">
            <Link href="/#proyectos" className="btn btn--primary">
              Ver proyectos
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H8M17 7v9" />
              </svg>
            </Link>
            <Link href="/#contacto" className="btn btn--ghost">
              Contáctame
            </Link>
          </Reveal>
        </div>
        <Reveal as="ul" className="hero__stats">
          {profile.stats.map((stat) => (
            <li key={stat.label}>
              <StatCounter value={stat.value} />
              {stat.plus ? <span className="stat__plus">+</span> : null}
              <span className="stat__label">{stat.label}</span>
            </li>
          ))}
        </Reveal>
      </div>
      <Link href="/#proyectos" className="hero__scroll" aria-label="Bajar a proyectos">
        <span>Scroll</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </Link>
    </section>
  );
}
