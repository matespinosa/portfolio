import type { Skill, SocialLink, Stat } from "./types";

export const profile = {
  name: "Mateo Espinosa",
  role: "Senior Product Designer",
  email: "matespinosa09@gmail.com",
  availability: "Disponible para nuevos proyectos",
  location: "LATAM · Remoto",
  intro:
    "Soy Mateo Espinosa, Senior Product Designer con +8 años transformando problemas complejos en experiencias simples, útiles y memorables.",
  about: [
    "Creo que el buen diseño es invisible: se siente, no se nota. Mi enfoque combina investigación rigurosa, pensamiento sistémico y una obsesión sana por los detalles de interacción.",
    "He trabajado con startups en etapa temprana y con productos de millones de usuarios, liderando equipos de diseño y colaborando codo a codo con producto e ingeniería.",
  ] as const,
  heroLines: [
    { html: "Diseño productos" },
    { html: "<em>digitales</em> que las" },
    { html: "personas <em>aman usar</em>" },
  ] as const,
  marquee: [
    "Product Design",
    "UX Research",
    "Design Systems",
    "Prototipado",
    "Estrategia UX",
    "UI Design",
  ] as const,
  stats: [
    { value: 8, label: "años de experiencia", plus: true },
    { value: 40, label: "proyectos lanzados", plus: true },
    { value: 12, label: "industrias distintas" },
    { value: 5, label: "design systems creados" },
  ] satisfies Stat[],
  skills: [
    {
      num: "01",
      title: "Diseño de producto",
      description:
        "De la idea al lanzamiento: flujos, wireframes, UI de alta fidelidad y handoff impecable.",
    },
    {
      num: "02",
      title: "UX Research",
      description:
        "Entrevistas, tests de usabilidad y análisis de datos para decidir con evidencia.",
    },
    {
      num: "03",
      title: "Design Systems",
      description:
        "Sistemas escalables con tokens, componentes y documentación que los equipos adoptan de verdad.",
    },
    {
      num: "04",
      title: "Liderazgo de diseño",
      description:
        "Mentoría, procesos de crítica y cultura de diseño en equipos multidisciplinarios.",
    },
  ] satisfies Skill[],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "Dribbble", href: "https://dribbble.com/" },
    { label: "Behance", href: "https://www.behance.net/" },
    { label: "X / Twitter", href: "https://x.com/" },
  ] satisfies SocialLink[],
  contactBlurb:
    "Cuéntame sobre tu producto, tu equipo o esa idea que no te deja dormir. Respondo en menos de 24 horas.",
  meta: {
    title: "Mateo Espinosa — Senior Product Designer",
    description:
      "Senior Product Designer con +8 años creando productos digitales centrados en las personas. Diseño de producto, sistemas de diseño y estrategia UX.",
  },
} as const;
