import type { Skill, SocialLink, Stat } from "./types";

export const profile = {
  name: "Mateo Espinosa",
  role: "Product Designer",
  email: "matespinosa09@gmail.com",
  phone: "3144868891",
  availability: "Disponible para trabajar",
  location: "Bogotá, Colombia",
  intro:
    "Product Designer que convierte flujos complejos de fintech y banca B2B en experiencias claras, medibles y orientadas a crecimiento.",
  about: [
    "Soy Product Designer y entusiasta del desarrollo, con mentalidad de negocio y mucha curiosidad por los usuarios. Desde Bogotá combino liderazgo, pensamiento analítico e investigación hands-on para diseñar y construir experiencias digitales con impacto real.",
    "Creo experiencias investigadas y medibles, alineadas a objetivos de negocio — y salto al código cuando ayuda a shippear mejores soluciones más rápido.",
  ] as const,
  heroLines: [
    { html: "Hi! I'm Mateo" },
    { html: "Product Designer" },
  ] as const,
  marquee: [
    "Product Design",
    "UX Design",
    "UI Design",
    "Research",
    "Data",
    "VSCode",
  ] as const,
  stats: [
    { value: 5, label: "años diseñando producto", plus: true },
    { value: 4, label: "empresas fintech & banca" },
    { value: 3, label: "mercados LATAM" },
    { value: 1, label: "design system de plataforma" },
  ] satisfies Stat[],
  skills: [
    {
      num: "01",
      title: "Product Design",
      description:
        "Strategy → research → prototype → shipped results en fintech, banca y marketplaces.",
    },
    {
      num: "02",
      title: "UX Design",
      description:
        "Flujos end-to-end de onboarding, tools merchant, factoring y canales enterprise — claros y medibles.",
    },
    {
      num: "03",
      title: "UI Design",
      description:
        "Interfaces de alta fidelidad y design systems (Figma + Storybook) listos para que el equipo shippee.",
    },
    {
      num: "04",
      title: "Research & Data",
      description:
        "Benchmarks, entrevistas, tests y journey maps para alinear producto con usuarios y negocio.",
    },
  ] satisfies Skill[],
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/mateo-espinosa/" },
  ] satisfies SocialLink[],
  contactBlurb:
    "Let's grow together. Cuéntame sobre tu producto o el reto de diseño que tienes — respondo en menos de 24 horas.",
  meta: {
    title: "Mateo Espinosa — Product Designer",
    description:
      "Product Designer en Bogotá. Flujos complejos de fintech y banca B2B convertidos en experiencias claras y medibles. Rappi, Kapital Bank, Credicorp Capital, Modyo.",
  },
} as const;
