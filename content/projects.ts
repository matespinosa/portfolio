import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "fintia",
    name: "Fintia",
    title: "Fintia — Banca personal sin fricción",
    year: "2025",
    tags: ["Fintech", "App móvil"],
    summary:
      "Rediseño end-to-end de la app de banca. El onboarding pasó de 9 a 3 pasos y la activación de cuentas creció un 47%.",
    mediaVariant: "a",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de app financiera",
      shapes: `
        <rect x="200" y="60" width="240" height="420" rx="28" class="art-device"/>
        <rect x="222" y="92" width="196" height="44" rx="12" class="art-block"/>
        <rect x="222" y="152" width="120" height="18" rx="9" class="art-line"/>
        <rect x="222" y="180" width="196" height="90" rx="14" class="art-accent"/>
        <rect x="222" y="286" width="92" height="72" rx="14" class="art-block"/>
        <rect x="326" y="286" width="92" height="72" rx="14" class="art-block"/>
        <rect x="222" y="374" width="196" height="20" rx="10" class="art-line"/>
        <circle cx="112" cy="150" r="52" class="art-accent"/>
        <rect x="486" y="240" width="110" height="110" rx="20" class="art-block"/>
      `,
    },
    isPlaceholder: true,
    role: "Lead Product Designer",
    timeline: "6 meses · 2024–2025",
    tools: ["Figma", "FigJam", "Maze", "Amplitude"],
    overview:
      // TODO: reemplazar con contenido real del caso
      "Fintia necesitaba reducir la fricción del primer uso sin comprometer compliance. Lideré el rediseño del onboarding, la home financiera y el flujo de activación de cuenta, trabajando con producto, compliance e ingeniería móvil.",
    challenge:
      "El funnel perdía ~62% de usuarios entre registro y primera transferencia. El onboarding pedía demasiada información de golpe y la home no priorizaba la acción siguiente.",
    process: [
      {
        title: "Descubrimiento",
        body: "12 entrevistas con usuarios nuevos y 4 con soporte. Mapeamos los momentos de duda y los campos que generaban abandono.",
      },
      {
        title: "Síntesis & hipótesis",
        body: "Priorizamos tres jobs: verificar identidad, fondear y completar la primera transferencia. Todo lo demás pasó a post-activación.",
      },
      {
        title: "Diseño & prototipos",
        body: "Prototipos de alta fidelidad en Figma, tests moderados con 8 personas y dos iteraciones de copy + jerarquía visual.",
      },
      {
        title: "Handoff & medición",
        body: "Especificaciones por estado, tokens compartidos y dashboard de activación con producto para validar el 47% de uplift.",
      },
    ],
    gallery: [
      {
        title: "Onboarding en 3 pasos",
        caption: "Menos pantallas, más claridad en cada decisión.",
        variant: "a",
      },
      {
        title: "Home de activación",
        caption: "La siguiente acción siempre visible.",
        variant: "b",
      },
      {
        title: "Transferencia guiada",
        caption: "Confirmación sin ruido cognitivo.",
        variant: "c",
      },
    ],
    results: [
      { metric: "47%", label: "↑ activación de cuentas" },
      { metric: "9 → 3", label: "pasos de onboarding" },
      { metric: "-38%", label: "tiempo hasta primera transferencia" },
    ],
    outcome:
      "El rediseño se lanzó a 100% de usuarios nuevos. El equipo adoptó el marco de jobs para features posteriores de crédito.",
  },
  {
    slug: "orbita",
    name: "Orbita",
    title: "Orbita — Analytics para equipos de producto",
    year: "2024",
    tags: ["SaaS B2B", "Design System"],
    summary:
      "Design system multi-marca y rediseño del dashboard. Redujo el tiempo de desarrollo de features un 30%.",
    mediaVariant: "b",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de dashboard",
      shapes: `
        <rect x="90" y="70" width="460" height="310" rx="18" class="art-device"/>
        <rect x="90" y="70" width="120" height="310" rx="18" class="art-block"/>
        <rect x="234" y="100" width="150" height="16" rx="8" class="art-line"/>
        <rect x="234" y="136" width="290" height="110" rx="14" class="art-accent"/>
        <rect x="234" y="264" width="136" height="86" rx="14" class="art-block"/>
        <rect x="388" y="264" width="136" height="86" rx="14" class="art-block"/>
        <circle cx="560" cy="110" r="36" class="art-accent"/>
      `,
    },
    isPlaceholder: true,
    role: "Product Designer · Design Systems",
    timeline: "9 meses · 2023–2024",
    tools: ["Figma", "Storybook", "Notion", "Jira"],
    overview:
      // TODO: reemplazar con contenido real del caso
      "Orbita crecía con tres marcas white-label y un dashboard inconsistente. Definí el sistema de componentes, tokens y patrones de analytics, y rediseñé las vistas core de producto.",
    challenge:
      "Cada feature reinventaba tablas, filtros y empty states. El tiempo de diseño + ingeniería por release se alargaba y la deuda visual se notaba en demos enterprise.",
    process: [
      {
        title: "Auditoría",
        body: "Inventario de 180+ pantallas y clasificación de patrones repetidos vs. one-offs.",
      },
      {
        title: "Fundaciones",
        body: "Tokens de color, tipografía, spacing y elevación multi-marca con temas por cliente.",
      },
      {
        title: "Componentes",
        body: "Librería de data viz, filtros compuestos y layouts de página documentados en Figma + Storybook.",
      },
      {
        title: "Adopción",
        body: "Workshops con diseño e ingeniería, checklist de contribución y métricas de uso del sistema.",
      },
    ],
    gallery: [
      {
        title: "Dashboard rediseñado",
        caption: "Jerarquía clara para métricas y exploración.",
        variant: "b",
      },
      {
        title: "Tokens multi-marca",
        caption: "Un sistema, varias pieles.",
        variant: "a",
      },
      {
        title: "Patrones de tabla",
        caption: "Filtros, densidad y empty states unificados.",
        variant: "d",
      },
    ],
    results: [
      { metric: "30%", label: "↓ tiempo de desarrollo" },
      { metric: "40+", label: "componentes documentados" },
      { metric: "3", label: "marcas sobre el mismo sistema" },
    ],
    outcome:
      "El design system pasó a ser el default de nuevas features. Diseño redujo variación innecesaria y QA visual bajó en releases.",
  },
  {
    slug: "kuna",
    name: "Kuna",
    title: "Kuna — Marketplace de diseño local",
    year: "2023",
    tags: ["E-commerce", "UX Research"],
    summary:
      "Investigación con +60 usuarios y rediseño del checkout. La conversión móvil subió un 28% en el primer trimestre.",
    mediaVariant: "c",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de e-commerce",
      shapes: `
        <rect x="120" y="90" width="180" height="270" rx="18" class="art-block"/>
        <rect x="330" y="90" width="180" height="270" rx="18" class="art-device"/>
        <rect x="352" y="118" width="136" height="130" rx="14" class="art-accent"/>
        <rect x="352" y="266" width="100" height="14" rx="7" class="art-line"/>
        <rect x="352" y="292" width="136" height="36" rx="18" class="art-block"/>
        <circle cx="540" cy="330" r="46" class="art-accent"/>
        <rect x="142" y="118" width="90" height="14" rx="7" class="art-line"/>
        <rect x="142" y="146" width="136" height="120" rx="14" class="art-accent-soft"/>
      `,
    },
    isPlaceholder: true,
    role: "Product Designer",
    timeline: "4 meses · 2023",
    tools: ["Figma", "Maze", "Hotjar", "Looker"],
    overview:
      // TODO: reemplazar con contenido real del caso
      "Kuna vendía diseño local con un checkout móvil frágil. Conduje research cuantitativo y cualitativo, y rediseñé el funnel de compra priorizando mobile-first.",
    challenge:
      "La conversión móvil estaba ~40% por debajo de desktop. Usuarios abandonaban en envío y métodos de pago poco claros.",
    process: [
      {
        title: "Research",
        body: "60+ encuestas, 10 entrevistas y análisis de sesión para ubicar fricción real vs. percibida.",
      },
      {
        title: "Journey & priorización",
        body: "Mapa del checkout con oportunidades rankeadas por impacto × esfuerzo.",
      },
      {
        title: "Rediseño",
        body: "Checkout en pasos cortos, preview de costos temprano y guías de pago local.",
      },
      {
        title: "Validación",
        body: "A/B test en tráfico móvil y seguimiento de funnel por dispositivo.",
      },
    ],
    gallery: [
      {
        title: "Checkout móvil",
        caption: "Costos visibles antes del compromiso.",
        variant: "c",
      },
      {
        title: "Catálogo",
        caption: "Descubrimiento más rápido de makers locales.",
        variant: "a",
      },
      {
        title: "Confirmación",
        caption: "Expectativas claras post-compra.",
        variant: "b",
      },
    ],
    results: [
      { metric: "28%", label: "↑ conversión móvil" },
      { metric: "-22%", label: "abandono en envío" },
      { metric: "60+", label: "usuarios en research" },
    ],
    outcome:
      "El nuevo checkout se convirtió en plantilla para campañas estacionales y marketplaces verticales del grupo.",
  },
  {
    slug: "vita",
    name: "Vita",
    title: "Vita — Salud preventiva en tu bolsillo",
    year: "2022",
    tags: ["HealthTech", "iOS · Android"],
    summary:
      "Diseño desde cero de una app de hábitos saludables. 4.8★ en las stores y +200K descargas el primer año.",
    mediaVariant: "d",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de app de salud",
      shapes: `
        <rect x="230" y="50" width="220" height="400" rx="30" class="art-device"/>
        <circle cx="340" cy="170" r="62" class="art-accent"/>
        <rect x="268" y="260" width="144" height="16" rx="8" class="art-line"/>
        <rect x="268" y="292" width="184" height="60" rx="14" class="art-block"/>
        <rect x="268" y="366" width="184" height="60" rx="14" class="art-block"/>
        <circle cx="130" cy="300" r="56" class="art-accent-soft"/>
        <rect x="500" y="120" width="90" height="90" rx="18" class="art-block"/>
      `,
    },
    isPlaceholder: true,
    role: "Founding Product Designer",
    timeline: "8 meses · 2021–2022",
    tools: ["Figma", "Protopie", "Notion"],
    overview:
      // TODO: reemplazar con contenido real del caso
      "Vita partió de cero: positioning, IA visual y producto móvil para hábitos preventivos. Diseñé onboarding motivacional, tracking diario y loops de retención sin culpa.",
    challenge:
      "Apps de salud suelen saturar con métricas. Necesitábamos hábitos sostenibles, accesibles y con tono humano — no un dashboard clínico.",
    process: [
      {
        title: "Concepto",
        body: "Workshops con founders y coaches para definir el job: constancia amable, no perfección.",
      },
      {
        title: "Flujos core",
        body: "Onboarding de 90s, check-in diario y racha flexible con recuperación sin castigo.",
      },
      {
        title: "Sistema visual",
        body: "Paleta calmada, tipografía clara y micro-copy que reduce ansiedad.",
      },
      {
        title: "Lanzamiento",
        body: "Beta cerrada, iteración de notificaciones y pulido de accesibilidad iOS/Android.",
      },
    ],
    gallery: [
      {
        title: "Check-in diario",
        caption: "Un gesto, no un formulario.",
        variant: "d",
      },
      {
        title: "Progreso semanal",
        caption: "Tendencias sin vergüenza.",
        variant: "c",
      },
      {
        title: "Onboarding",
        caption: "Personalización en menos de dos minutos.",
        variant: "a",
      },
    ],
    results: [
      { metric: "4.8★", label: "rating en stores" },
      { metric: "200K+", label: "descargas año 1" },
      { metric: "41%", label: "retención D30" },
    ],
    outcome:
      "Vita validó product-market fit en hábitos preventivos y abrió partnerships con clínicas digitales.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
