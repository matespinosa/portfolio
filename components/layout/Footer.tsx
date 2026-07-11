import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p>© 2026 Mateo Espinosa. Diseñado y construido con cariño.</p>
        <Link href="/#home" className="footer__top">
          Volver arriba ↑
        </Link>
      </div>
    </footer>
  );
}
