const COMPANIES = [
  "Rappi",
  "Kapital Bank",
  "Credicorp Capital",
  "Modyo",
  "miBanco",
] as const;

/**
 * Banda de confianza del skin Terminal: ticker en mono con las empresas
 * para las que Mateo ha construido producto. CSS puro (pausa en hover,
 * estático con prefers-reduced-motion).
 */
export function TermLogos() {
  const list = (hidden: boolean) => (
    <ul className="term-logos__list" aria-hidden={hidden || undefined}>
      {COMPANIES.map((company, index) => (
        <li key={`${company}-${hidden ? "b" : "a"}`}>
          <span className="term-logos__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          {company}
        </li>
      ))}
    </ul>
  );

  return (
    <section className="term-logos" aria-label="Empresas con las que he trabajado">
      <div className="container term-logos__head">
        <span className="term-eyebrow">{"// he construido para"}</span>
        <span className="term-logos__note">fintech · banca · LATAM</span>
      </div>
      <div className="term-logos__band">
        <div className="term-logos__track">
          {list(false)}
          {list(true)}
        </div>
      </div>
    </section>
  );
}
