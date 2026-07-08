// Contenido central del portafolio. Editar aquí para actualizar el sitio.

export const profile = {
  name: "Mateo Espinosa",
  role: "Senior Product Designer",
  subrole: "& Frontend Designer",
  location: "Bogotá, CO — Remoto",
  email: "matespinosa09@gmail.com",
  tagline:
    "Diseño productos digitales y los llevo hasta el código. Donde el diseño de producto se encuentra con el frontend.",
  available: true,
};

export const socials = [
  { label: "GitHub", href: "https://github.com/matespinosa", handle: "@matespinosa" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", handle: "in/mateo" },
  { label: "Dribbble", href: "https://dribbble.com/", handle: "@mateo" },
  { label: "Read.cv", href: "https://read.cv/", handle: "mateo" },
];

export const stack = [
  "Figma",
  "Framer",
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Framer Motion",
  "Three.js",
  "Design Systems",
  "Storybook",
];

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  role: string;
  tags: string[];
  stat: { value: string; label: string };
  gradient: string; // clases tailwind para el placeholder
  accentDark: string;
};

export const projects: Project[] = [
  {
    id: "fintia",
    title: "Fintia",
    subtitle: "Banca personal sin fricción",
    year: "2025",
    role: "Product Design · Frontend",
    tags: ["Fintech", "Design System", "React Native"],
    stat: { value: "+47%", label: "activación de cuentas" },
    gradient: "from-emerald-200 to-teal-300",
    accentDark: "from-emerald-500/20 to-teal-500/10",
  },
  {
    id: "orbita",
    title: "Orbita",
    subtitle: "Analytics para equipos de producto",
    year: "2024",
    role: "Design Lead · Design System",
    tags: ["SaaS B2B", "Data Viz", "Next.js"],
    stat: { value: "-30%", label: "tiempo de desarrollo" },
    gradient: "from-violet-200 to-indigo-300",
    accentDark: "from-violet-500/20 to-indigo-500/10",
  },
  {
    id: "kuna",
    title: "Kuna",
    subtitle: "Marketplace de diseño local",
    year: "2023",
    role: "Product Design · UX Research",
    tags: ["E-commerce", "Research", "Motion"],
    stat: { value: "+28%", label: "conversión móvil" },
    gradient: "from-amber-200 to-orange-300",
    accentDark: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "vita",
    title: "Vita",
    subtitle: "Salud preventiva en tu bolsillo",
    year: "2022",
    role: "End-to-end Design",
    tags: ["HealthTech", "iOS", "Prototipado"],
    stat: { value: "4.8★", label: "en las stores" },
    gradient: "from-sky-200 to-cyan-300",
    accentDark: "from-sky-500/20 to-cyan-500/10",
  },
];

export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  desc: string;
  tags: string[];
};

export const experience: Experience[] = [
  {
    period: "2023 — Presente",
    role: "Senior Product Designer",
    company: "Nubank",
    location: "Remoto",
    desc: "Lidero el diseño de la vertical de crédito y colaboro directamente con el equipo de frontend en la implementación del design system.",
    tags: ["Fintech", "Design System", "Frontend"],
  },
  {
    period: "2020 — 2023",
    role: "Product Designer",
    company: "Rappi",
    location: "Bogotá",
    desc: "Diseñé features del checkout y del programa de fidelización. Co-creé el design system usado por +30 diseñadores y devs.",
    tags: ["Marketplace", "Design System"],
  },
  {
    period: "2018 — 2020",
    role: "UX/UI Designer",
    company: "Globant",
    location: "Medellín",
    desc: "Productos digitales para clientes de banca, retail y entretenimiento en LATAM y EE. UU.",
    tags: ["Consultoría", "Multi-industria"],
  },
  {
    period: "2016 — 2018",
    role: "Frontend & Visual Designer",
    company: "Freelance",
    location: "Remoto",
    desc: "Identidad visual y desarrollo web para startups. Aquí nació mi amor por el cruce diseño ↔ código.",
    tags: ["Branding", "HTML/CSS/JS"],
  },
];

// "Actividad" tipo GitHub para la sección de repositorio
export const activityStats = [
  { value: "1,284", label: "commits este año" },
  { value: "47", label: "repositorios" },
  { value: "312", label: "PRs mergeados" },
  { value: "18", label: "días de racha" },
];

export const languages = [
  { name: "TypeScript", pct: 42, color: "#3178c6" },
  { name: "CSS", pct: 24, color: "#563d7c" },
  { name: "MDX", pct: 16, color: "#fcb32c" },
  { name: "JavaScript", pct: 12, color: "#f1e05a" },
  { name: "Shell", pct: 6, color: "#89e051" },
];

export const recentActivity = [
  { type: "commit", repo: "fintia/design-system", msg: "feat: add motion tokens to Button", time: "hace 2h" },
  { type: "pr", repo: "orbita/web", msg: "Merge: dark mode for dashboard charts", time: "hace 1d" },
  { type: "star", repo: "pmndrs/react-three-fiber", msg: "Marcó con estrella", time: "hace 2d" },
  { type: "commit", repo: "kuna/checkout", msg: "fix: parallax jank on iOS Safari", time: "hace 3d" },
];
