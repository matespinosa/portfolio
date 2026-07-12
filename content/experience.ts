import type { ExperienceItem } from "./types";

export const experience: ExperienceItem[] = [
  {
    period: "2025 - Presente",
    role: "Product Designer",
    company: "Rappi",
    description:
      "Lidero UX/Product design para la vertical de Restaurants: onboarding de comercios, retención y eficiencia operativa. Diseño experiencias end-to-end en plataformas merchant (menú, promociones, ads y settings) y uso herramientas de AI como Claude Code para acelerar workflows, design system y prototipos vivos.",
    tags: ["Marketplace", "Merchant", "AI workflows"],
  },
  {
    period: "2025",
    role: "Product Designer",
    company: "Kapital Bank",
    description:
      "Lideré iniciativas UX/Product para el mercado Colombia. Diseñé el módulo de factoring end-to-end (venta de facturas y desembolsos) y optimicé operaciones y controles de la plataforma Kapital Colombia.",
    tags: ["Fintech", "Factoring", "Colombia"],
  },
  {
    period: "2024 - 2025",
    role: "Sr Product Designer",
    company: "Credicorp Capital",
    description:
      "UX/Product lead del canal enterprise unificado (brokerage + fiduciary). Entrevistas con clientes para identificar necesidades y pain points, y user testing para validar una sola experiencia para distintos tipos de cliente.",
    tags: ["Banca de inversión", "Enterprise", "Research"],
  },
  {
    period: "2022 - 2024",
    role: "Product Designer · UX/UI Designer",
    company: "Modyo",
    description:
      "Co-lideré el release Modyo 10. Construí el primer Design System (Figma + Storybook) y el Dynamic Framework UI. En services: design systems para miBanco, Banco Mundo Mujer y CFG | Bci (Chile); onboarding de consolidación de deuda y préstamos personales; discovery completo para portales en Chile y México.",
    tags: ["DXP", "Design System", "Banking"],
  },
  {
    period: "2021",
    role: "Consulting — UI Developer",
    company: "Brace Developers",
    description:
      "Documenté el proceso de diseño end-to-end y estandaricé análisis, diseño y entrega. Front-end con React/Next + NestJS y UI con Tailwind CSS, coordinando con backend, QA y diseño.",
    tags: ["React", "Next.js", "Tailwind"],
  },
];

export const tools = [
  "Figma",
  "FigJam",
  "Storybook",
  "Framer",
  "VSCode",
  "Claude Code",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Notion",
  "Jira",
] as const;
