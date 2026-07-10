// Contenido central del portafolio v3 — "AI-native builder".
// Editar aquí para actualizar el sitio.

export const profile = {
  name: "Mateo Espinosa",
  role: "Senior Product Designer",
  subrole: "AI-native builder",
  location: "Bogotá, CO — Remoto",
  email: "matespinosa09@gmail.com",
  tagline:
    "Diseño producto de punta a punta y lo construyo con un workflow potenciado por IA: research más profundo, iteración más rápida y código que llega a producción.",
  available: true,
};

export const rotatingWords = ["con IA", "end-to-end", "que se lanzan", "sin fricción"];

export const socials = [
  { label: "GitHub", href: "https://github.com/matespinosa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Dribbble", href: "https://dribbble.com/" },
  { label: "Read.cv", href: "https://read.cv/" },
];

export const marqueeItems = [
  "Product Design",
  "AI Workflows",
  "Frontend",
  "Design Systems",
  "Prompt Engineering",
  "UX Research",
  "Prototipado",
  "Motion",
];

export type WorkflowStage = {
  id: string;
  step: string;
  title: string;
  desc: string;
  tools: string[];
  boost: string;
  prompt: string;
};

export const workflow: WorkflowStage[] = [
  {
    id: "discover",
    step: "01",
    title: "Descubrir",
    desc: "Entrevistas, datos y desk research. La IA sintetiza horas de transcripciones en patrones accionables mientras yo me concentro en las preguntas correctas.",
    tools: ["Claude", "Dovetail AI", "Notion AI"],
    boost: "Síntesis de research 10x más rápida",
    prompt: "Analiza estas 12 entrevistas y agrupa los pain points por frecuencia e impacto…",
  },
  {
    id: "ideate",
    step: "02",
    title: "Idear",
    desc: "Exploro más direcciones en menos tiempo: co-escribo hipótesis con IA, genero variantes de flujos y descarto callejones sin salida antes de abrir Figma.",
    tools: ["Claude", "FigJam AI", "Midjourney"],
    boost: "3x más direcciones exploradas por sprint",
    prompt: "Dame 8 enfoques distintos para reducir el abandono en el onboarding…",
  },
  {
    id: "design",
    step: "03",
    title: "Diseñar",
    desc: "UI de alta fidelidad sobre design systems con tokens. La IA acelera lo repetitivo — estados, variantes, copys — y yo cuido la intención de cada decisión.",
    tools: ["Figma", "Figma AI", "Tokens Studio"],
    boost: "Estados y variantes generados en minutos",
    prompt: "Genera los estados error/vacío/cargando de este formulario siguiendo el design system…",
  },
  {
    id: "build",
    step: "04",
    title: "Construir",
    desc: "El diseño no se entrega: se construye. Prototipo y desarrollo frontend real en pair-programming con IA, del componente al deploy.",
    tools: ["Claude Code", "Cursor", "v0", "Next.js"],
    boost: "De Figma a producción sin handoff",
    prompt: "Implementa esta card con parallax y spotlight hover usando framer-motion…",
  },
  {
    id: "ship",
    step: "05",
    title: "Lanzar",
    desc: "Medir, aprender, iterar. Dashboards, análisis de feedback con IA y experimentos para que cada release informe la siguiente.",
    tools: ["Vercel", "Amplitude", "Claude"],
    boost: "Insights de feedback en horas, no semanas",
    prompt: "Clasifica estos 400 comentarios de usuarios por tema y sentimiento…",
  },
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  tags: string[];
  stat: { value: string; label: string };
  aiNote: string;
  size: "lg" | "sm";
};

export const projects: Project[] = [
  {
    id: "fintia",
    title: "Fintia",
    subtitle: "Banca personal sin fricción",
    year: "2025",
    tags: ["Fintech", "Mobile"],
    stat: { value: "+47%", label: "activación" },
    aiNote: "Research sintetizado con IA · UI construida con Claude Code",
    size: "lg",
  },
  {
    id: "orbita",
    title: "Orbita",
    subtitle: "Analytics para equipos de producto",
    year: "2024",
    tags: ["SaaS B2B", "Data Viz"],
    stat: { value: "-30%", label: "tiempo de dev" },
    aiNote: "Design system con tokens generados asistidos por IA",
    size: "sm",
  },
  {
    id: "kuna",
    title: "Kuna",
    subtitle: "Marketplace de diseño local",
    year: "2023",
    tags: ["E-commerce", "Research"],
    stat: { value: "+28%", label: "conversión móvil" },
    aiNote: "400+ reviews clasificadas con IA para priorizar el roadmap",
    size: "sm",
  },
  {
    id: "vita",
    title: "Vita",
    subtitle: "Salud preventiva en tu bolsillo",
    year: "2022",
    tags: ["HealthTech", "iOS · Android"],
    stat: { value: "4.8★", label: "en stores" },
    aiNote: "Prototipos funcionales en código desde el sprint 1",
    size: "lg",
  },
];

export type Experience = {
  period: string;
  role: string;
  company: string;
  desc: string;
};

export const experience: Experience[] = [
  {
    period: "2023 — Hoy",
    role: "Senior Product Designer",
    company: "Nubank",
    desc: "Lidero diseño en la vertical de crédito. Introduje workflows con IA que redujeron el ciclo research→prototipo de semanas a días.",
  },
  {
    period: "2020 — 2023",
    role: "Product Designer",
    company: "Rappi",
    desc: "Checkout y fidelización. Co-creé el design system usado por +30 diseñadores y devs.",
  },
  {
    period: "2018 — 2020",
    role: "UX/UI Designer",
    company: "Globant",
    desc: "Productos digitales para banca, retail y entretenimiento en LATAM y EE. UU.",
  },
  {
    period: "2016 — 2018",
    role: "Frontend & Visual Designer",
    company: "Freelance",
    desc: "Identidad y desarrollo web para startups. El origen del cruce diseño ↔ código.",
  },
];

export const heroStats = [
  { value: "8+", label: "años de producto" },
  { value: "40+", label: "lanzamientos" },
  { value: "10x", label: "iteración con IA" },
];
