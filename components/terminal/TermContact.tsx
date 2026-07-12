"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/contact/ContactForm";
import { TermWindow } from "@/components/terminal/TermWindow";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
} as const;

/**
 * Contacto del skin Terminal: sesión SSH con los canales directos y el
 * formulario compartido dentro de una ventana `mensaje.form`.
 */
export function TermContact() {
  return (
    <section className="term-section term-contact" id="contacto-term">
      <div className="container">
        <motion.header
          className="term-section__head"
          {...reveal}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p className="term-eyebrow">
            <span className="term-prompt">$</span> ssh mateo@bogota
          </p>
          <h2 className="term-section__title">
            Hablemos de tu <em>producto.</em>
          </h2>
          <p className="term-section__desc">{profile.contactBlurb}</p>
        </motion.header>

        <div className="term-contact__grid">
          <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}>
            <TermWindow title="mateo@bogota — ssh" meta="22/tcp" className="term-contact__session">
              <p className="term-line term-line--ok">conexión segura establecida</p>
              <p className="term-line term-line--dim">→ tiempo de respuesta: &lt; 24 h</p>
              <p className="term-line term-line--dim">
                → disponible para: producto · design systems · frontend
              </p>

              <p className="term-line term-line--cmd">
                <span className="term-prompt">$</span> open mailto:
              </p>
              <a href={`mailto:${profile.email}`} className="term-contact__email">
                {profile.email}
              </a>

              <p className="term-line term-line--cmd">
                <span className="term-prompt">$</span> mateo --canales
              </p>
              <ul className="term-contact__links">
                <li>
                  <a href={`tel:+57${profile.phone}`}>
                    <span className="term-contact__proto">tel://</span>+57 {profile.phone}
                  </a>
                </li>
                {profile.socials.map((social) => (
                  <li key={social.label}>
                    <Link href={social.href} target="_blank" rel="noopener noreferrer">
                      <span className="term-contact__proto">https://</span>
                      {social.label.toLowerCase()}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="term-line">
                <span className="term-prompt">$</span>
                <span className="term-caret" aria-hidden="true" />
              </p>
            </TermWindow>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.7, ease: EASE, delay: 0.14 }}>
            <TermWindow title="mensaje.form" meta="POST /api/contact" className="term-contact__form">
              <ContactForm />
            </TermWindow>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
