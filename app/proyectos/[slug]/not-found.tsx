import Link from "next/link";

export default function CaseStudyNotFound() {
  return (
    <section className="section">
      <div className="container" style={{ textAlign: "center", paddingTop: "6rem" }}>
        <p className="section__eyebrow">404</p>
        <h1 className="section__title">Proyecto no encontrado</h1>
        <p className="section__desc" style={{ marginBottom: "2rem" }}>
          Ese caso de estudio no existe o fue movido.
        </p>
        <Link href="/#proyectos" className="btn btn--primary">
          Ver proyectos
        </Link>
      </div>
    </section>
  );
}
