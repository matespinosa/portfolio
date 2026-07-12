import type { Project } from "./types";

export const projects: Project[] = [
  {
    slug: "mibanco-onboarding",
    name: "miBanco",
    title: "miBanco — Onboarding de productos financieros",
    year: "2023",
    tags: ["Banking", "Onboarding", "UX Research"],
    summary:
      "Onboarding para consolidación de deuda y préstamos personales, con discovery completo y design system para miBanco.",
    mediaVariant: "a",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de onboarding financiero",
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
    isPlaceholder: false,
    role: "Product Designer · Modyo Services",
    timeline: "2022 - 2024 · Modyo",
    tools: ["Figma", "FigJam", "Storybook", "User testing"],
    overview:
      "En Modyo Services lideré el onboarding de consolidación de deuda y préstamos personales para miBanco, y aporté al design system del banco. El trabajo incluyó discovery completo: benchmarks, entrevistas, tests de usabilidad y journey maps.",
    challenge:
      "Productos financieros con flujos densos y regulatorios necesitaban una experiencia clara para usuarios que buscan crédito o consolidar deuda, sin perder confianza ni cumplimiento.",
    process: [
      {
        title: "Discovery",
        body: "Benchmarks, entrevistas y journey maps para portales bancarios en Chile y México, identificando fricción en solicitud y seguimiento.",
      },
      {
        title: "Design system",
        body: "Componentes y patrones alineados al design system de miBanco para escalar pantallas de onboarding con consistencia.",
      },
      {
        title: "Flujos de producto",
        body: "Diseño end-to-end del onboarding de consolidación de deuda y préstamos personales, priorizando claridad en cada paso.",
      },
      {
        title: "Validación",
        body: "User tests para iterar copy, jerarquía y estados de error antes del handoff a desarrollo.",
      },
    ],
    gallery: [
      {
        title: "Onboarding de productos",
        caption: "Pasos claros para solicitar y avanzar sin ruido.",
        variant: "a",
      },
      {
        title: "Patrones del sistema",
        caption: "UI consistente con el design system del banco.",
        variant: "b",
      },
      {
        title: "Journeys mapeados",
        caption: "De la necesidad de crédito a la activación del producto.",
        variant: "c",
      },
    ],
    results: [
      { metric: "2", label: "productos de crédito onboarded" },
      { metric: "DS", label: "design system para miBanco" },
      { metric: "LATAM", label: "discovery Chile & México" },
    ],
    outcome:
      "Onboarding de productos financieros listo para escalar sobre el design system de miBanco, con research documentado para el equipo de producto.",
  },
  {
    slug: "credicorp-capital",
    name: "Credicorp Capital",
    title: "Credicorp Capital — Canal enterprise unificado",
    year: "2025",
    tags: ["B2B Banking", "Enterprise", "Research"],
    summary:
      "UX/Product lead del canal unificado brokerage + fiduciary: una sola experiencia para clientes enterprise mixtos.",
    mediaVariant: "b",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de canal enterprise",
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
    isPlaceholder: false,
    role: "Sr Product Designer",
    timeline: "2024 - 2025",
    tools: ["Figma", "FigJam", "Customer interviews", "User testing"],
    overview:
      "Credicorp Capital es un banco de inversión latinoamericano con brokerage, asset management y servicios fiduciarios. Como Sr Product Designer lideré el canal enterprise unificado para clientes con necesidades mixtas.",
    challenge:
      "Brokerage y fiduciary vivían en experiencias separadas. Había que validar una sola experiencia para distintos tipos de cliente enterprise sin romper flujos críticos ni confianza institucional.",
    process: [
      {
        title: "Entrevistas",
        body: "Customer interviews para identificar necesidades, pain points y overlap entre perfiles brokerage y fiduciary.",
      },
      {
        title: "Unificación",
        body: "Definición del canal enterprise único: arquitectura de información, journeys y prioridades por tipo de cliente.",
      },
      {
        title: "User testing",
        body: "Tests con usuarios para validar que una sola experiencia sirviera a clientes mixtos sin fricción innecesaria.",
      },
      {
        title: "Entrega",
        body: "Specs y colaboración con producto e ingeniería para llevar el canal unificado a implementación.",
      },
    ],
    gallery: [
      {
        title: "Canal unificado",
        caption: "Brokerage + fiduciary en una sola experiencia.",
        variant: "b",
      },
      {
        title: "Flujos enterprise",
        caption: "Jerarquía clara para clientes institucionales.",
        variant: "a",
      },
      {
        title: "Validación con usuarios",
        caption: "Decisiones respaldadas por entrevistas y tests.",
        variant: "d",
      },
    ],
    results: [
      { metric: "1", label: "canal enterprise unificado" },
      { metric: "2", label: "líneas de negocio integradas" },
      { metric: "UX", label: "lead de research & producto" },
    ],
    outcome:
      "Una experiencia enterprise validada con usuarios, alineada a brokerage y fiduciary, lista para operar como canal único.",
  },
  {
    slug: "kapital-factoring",
    name: "Kapital Bank",
    title: "Kapital Bank — Módulo de factoring Colombia",
    year: "2025",
    tags: ["Fintech", "Factoring", "B2B"],
    summary:
      "Diseño end-to-end del módulo de factoring para Kapital Colombia: venta de facturas, desembolsos y controles de plataforma.",
    mediaVariant: "c",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de módulo de factoring",
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
    isPlaceholder: false,
    role: "Product Designer",
    timeline: "2025",
    tools: ["Figma", "FigJam", "Product ops"],
    overview:
      "Kapital Bank es una fintech mexicana que ayuda a pymes a acceder a productos financieros. Lideré las iniciativas UX/Product para Colombia y diseñé el módulo de factoring de punta a punta.",
    challenge:
      "Las pymes necesitaban vender facturas y recibir desembolsos con claridad operativa. La plataforma también requería controles y operaciones estables para el mercado Colombia.",
    process: [
      {
        title: "Scope Colombia",
        body: "Priorización de iniciativas UX/Product para el mercado local y alineación con el modelo de factoring de Kapital.",
      },
      {
        title: "Flujo de factoring",
        body: "Diseño end-to-end de venta de facturas y desembolsos, con estados claros para comercio y operaciones.",
      },
      {
        title: "Operaciones & controles",
        body: "Optimización de operaciones y controles de plataforma para Kapital Colombia.",
      },
    ],
    gallery: [
      {
        title: "Venta de facturas",
        caption: "Flujo B2B para liquidar cartera.",
        variant: "c",
      },
      {
        title: "Desembolsos",
        caption: "Estados y confirmaciones sin ambigüedad.",
        variant: "a",
      },
      {
        title: "Controles de plataforma",
        caption: "Operaciones visibles para el equipo local.",
        variant: "b",
      },
    ],
    results: [
      { metric: "E2E", label: "módulo de factoring diseñado" },
      { metric: "CO", label: "mercado Colombia" },
      { metric: "Ops", label: "controles de plataforma" },
    ],
    outcome:
      "Módulo de factoring listo para pymes en Colombia, con flujos de venta/desembolso y operaciones de plataforma alineadas.",
  },
  {
    slug: "modyo-platform",
    name: "Modyo Platform",
    title: "Modyo Platform — Design System, Modyo 10 & low-code",
    year: "2024",
    tags: ["Design System", "Product Design", "Research"],
    summary:
      "Design system de 60+ componentes, reestructuración de Modyo 10 y el primer módulo low-code. −48% tiempo de desarrollo y 92% task-success en tests moderados.",
    mediaVariant: "d",
    art: {
      viewBox: "0 0 640 440",
      ariaLabel: "Mockup de Modyo Platform y design system",
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
    isPlaceholder: false,
    role: "Product Designer — Design system, Product Design, Research",
    timeline: "2022 - 2024 · Cliente: Modyo",
    tools: ["Figma", "Storybook", "FigJam", "Mixpanel", "User interviews"],
    overview:
      "Modyo es una Digital Experience Platform (DXP) usada por bancos y fintechs en Latinoamérica para crear, desplegar y operar sitios seguros sobre arquitectura micro-frontend. Con el tiempo la DXP creció a base de features sueltos: equipos distintos, estilos visuales mezclados y componentes duplicados sin fin. Investigué, diseñé, validé y shippeé las piezas clave — design system, Modyo 10 y el primer módulo low-code — para que diseño, código y negocio remaran juntos.",
    challenge:
      "Terminología confusa (Spaces vs Channels), navegación arbitraria y una librería oficial incompleta que obligaba a reescribir componentes. Había que unificar la plataforma sin frenar a engineers, PMs y marketers que ya sufrían el flujo viejo.",
    process: [
      {
        title: "Research & benchmark",
        body: "10 entrevistas con engineers, platform managers y marketing (21–35 años). Dolor principal: Spaces vs Channels y navegación poco clara. Benchmark de 7 productos (Stripe Docs, Zapier, Terraform Cloud, Jira Admin, Framer…): UI de alto contraste, sidebar colapsable, docs in-product y builders low-code.",
      },
      {
        title: "Design System architect",
        body: "Paleta accesible, tipografía modular y 60+ componentes en Figma & Storybook para que dev y QA hablaran el mismo idioma. Docs vivas dentro de la app: adiós al “¿cuál azul es ese?”.",
      },
      {
        title: "Modyo 10 — IA & módulos",
        body: "Menú plano → seis grupos (Overview, Pages, Widgets, Templates, Navigation, Settings). Spaces → Experiences, Channels → Sites, con descripciones inline. Empty states ilustrados, breadcrumb fijo, side panel persistente en Widgets/Templates, Code Editor in-app (dark, linting, hot-reload) y Content Library unificada.",
      },
      {
        title: "Low-code: Forms & Onboarding",
        body: "Editor drag-and-drop para formularios multi-step sin tocar front. Integración plug-and-play con APIs de KYC, scoring y anti-fraude. Lógica condicional, versionado/rollback y eventos de adopción trackeados en Mixpanel.",
      },
    ],
    gallery: [
      {
        title: "Design System",
        caption: "60+ componentes listos en Figma & Storybook.",
        variant: "d",
      },
      {
        title: "Modyo 10",
        caption: "Nueva IA, terminología clara y módulos unificados.",
        variant: "c",
      },
      {
        title: "Forms & Onboarding",
        caption: "Primer módulo low-code con builder visual.",
        variant: "a",
      },
    ],
    results: [
      { metric: "48%", label: "↓ tiempo de desarrollo (meta 40%)" },
      { metric: "92%", label: "task-success en tests moderados" },
      { metric: "78%", label: "índice de mejora UX (inconsistencias resueltas)" },
      { metric: "7", label: "bancos negociando Origination Builder (meta 5)" },
    ],
    outcome:
      "Rol híbrido: user detective, arquitecto de design system, prototipador, guardian de handoff (PRs + QA) y coach entre branding, producto y desarrollo. El sistema y Modyo 10 quedaron shippeados con documentación viva y un pipeline low-code que abrió prospectos de ventas.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllProjectSlugs(): string[] {
  return projects.map((p) => p.slug);
}
