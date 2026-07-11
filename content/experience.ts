import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    period: "2023 — Presente",
    role: "Senior Product Designer",
    company: "Nubank · Remoto",
    description:
      "Lidero el diseño de la vertical de crédito. Diseñé la experiencia de préstamos que hoy usan +2M de clientes al mes.",
    tags: ["Fintech", "Liderazgo", "Mobile"],
  },
  {
    period: "2020 — 2023",
    role: "Product Designer",
    company: "Rappi · Bogotá",
    description:
      "Diseñé features clave del checkout y del programa de fidelización. Co-creé el design system usado por +30 diseñadores.",
    tags: ["Marketplace", "Design System"],
  },
  {
    period: "2018 — 2020",
    role: "UX/UI Designer",
    company: "Globant · Medellín",
    description:
      "Diseñé productos digitales para clientes de banca, retail y entretenimiento en LATAM y EE. UU.",
    tags: ["Consultoría", "Multi-industria"],
  },
  {
    period: "2016 — 2018",
    role: "Diseñador Visual",
    company: "Freelance",
    description:
      "Identidad visual y diseño web para startups y pequeñas empresas. Aquí nació mi amor por el producto digital.",
    tags: ["Branding", "Web"],
  },
];

export const tools = [
  "Figma",
  "FigJam",
  "Framer",
  "Protopie",
  "Maze",
  "Notion",
  "Jira",
  "HTML/CSS",
] as const;
