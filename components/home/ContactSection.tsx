import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";

export function ContactSection() {
  return (
    <section className="section section--contact" id="contacto">
      <div className="container">
        <Reveal as="p" className="section__eyebrow section__eyebrow--center">
          Contacto
        </Reveal>
        <Reveal as="h2" className="contact__title">
          ¿Tienes un proyecto
          <br />
          <em>en mente?</em>
        </Reveal>
        <Reveal as="p" className="contact__desc">
          {profile.contactBlurb}
        </Reveal>

        <div className="contact-form-wrap">
          <ContactForm />
        </div>

        <Reveal>
          <a href={`mailto:${profile.email}`} className="contact__email">
            {profile.email}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 17L17 7M17 7H8M17 7v9" />
            </svg>
          </a>
        </Reveal>

        <Reveal as="p" className="contact__desc">
          <a href={`tel:+57${profile.phone}`}>{profile.phone}</a>
        </Reveal>

        <Reveal as="ul" className="contact__socials">
          {profile.socials.map((s) => (
            <li key={s.label}>
              <Link href={s.href} target="_blank" rel="noopener noreferrer">
                {s.label}
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
