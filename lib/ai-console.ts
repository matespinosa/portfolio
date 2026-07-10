// Motor de respuestas de la "consola IA" del hero. Todo determinista y
// local (sin llamadas a un backend): empareja palabras clave contra el
// contenido real del portafolio en lib/data.ts y devuelve una respuesta
// con formato de código + enlaces directos a la sección relevante.

import { experience, profile, projects, workflow, marqueeItems } from "./data";

export type ConsoleLink = { label: string; href: string };

export type ConsoleAnswer = {
  comment: string;
  code: string[];
  links: ConsoleLink[];
};

export const suggestedPrompts = [
  "¿Qué proyectos ha hecho?",
  "¿Cuál es su experiencia?",
  "¿En qué áreas ha trabajado?",
  "¿Cómo usa la IA en su proceso?",
  "¿Cómo lo contacto?",
];

const industries = Array.from(
  new Set(projects.flatMap((p) => p.tags))
);

function projectsAnswer(): ConsoleAnswer {
  return {
    comment: "// proyectos recientes, ordenados de más a menos reciente",
    code: [
      "const proyectos = [",
      ...projects.map(
        (p) =>
          `  { nombre: "${p.title}", foco: "${p.subtitle}", impacto: "${p.stat.value} ${p.stat.label}" },`
      ),
      "];",
    ],
    links: [{ label: "Ver todos los proyectos", href: "#work" }],
  };
}

function experienceAnswer(): ConsoleAnswer {
  return {
    comment: "// trayectoria profesional, la más reciente primero",
    code: [
      "const experiencia = [",
      ...experience.map(
        (e) => `  { rol: "${e.role}", empresa: "${e.company}", periodo: "${e.period}" },`
      ),
      "];",
    ],
    links: [{ label: "Ver experiencia completa", href: "#experience" }],
  };
}

function areasAnswer(): ConsoleAnswer {
  return {
    comment: "// industrias y disciplinas en las que ha trabajado",
    code: [
      `const industrias = [${industries.map((i) => `"${i}"`).join(", ")}];`,
      `const disciplinas = ["Product Design", "Frontend", "Design Systems", "UX Research"];`,
    ],
    links: [
      { label: "Ver proyectos por industria", href: "#work" },
      { label: "Ver experiencia", href: "#experience" },
    ],
  };
}

function aiWorkflowAnswer(): ConsoleAnswer {
  return {
    comment: "// así integra IA en cada fase de su proceso",
    code: [
      "const workflowIA = [",
      ...workflow.map((w) => `  { fase: "${w.title}", boost: "${w.boost}" },`),
      "];",
    ],
    links: [{ label: "Ver el workflow completo", href: "#workflow" }],
  };
}

function skillsAnswer(): ConsoleAnswer {
  return {
    comment: "// stack y herramientas principales",
    code: [`const stack = [${marqueeItems.map((s) => `"${s}"`).join(", ")}];`],
    links: [
      { label: "Ver workflow con IA", href: "#workflow" },
      { label: "Ver proyectos", href: "#work" },
    ],
  };
}

function contactAnswer(): ConsoleAnswer {
  return {
    comment: "// datos de contacto",
    code: [
      "const contacto = {",
      `  email: "${profile.email}",`,
      `  disponible: ${profile.available},`,
      `  ubicación: "${profile.location}",`,
      "};",
    ],
    links: [{ label: "Enviar mensaje", href: "#contact" }],
  };
}

function fallbackAnswer(): ConsoleAnswer {
  return {
    comment: "// no encontré una coincidencia exacta — un resumen rápido",
    code: [
      "const resumen = {",
      `  nombre: "${profile.name}",`,
      `  rol: "${profile.role}",`,
      `  proyectos: ${projects.length},`,
      `  experiencia: "${experience[0].period}",`,
      `  disponible: ${profile.available},`,
      "};",
    ],
    links: [
      { label: "Ver proyectos", href: "#work" },
      { label: "Ver experiencia", href: "#experience" },
      { label: "Ver workflow IA", href: "#workflow" },
      { label: "Contacto", href: "#contact" },
    ],
  };
}

type Rule = { test: RegExp; answer: () => ConsoleAnswer };

// El orden importa: la primera regla que matchee gana.
const rules: Rule[] = [
  { test: /contact|correo|email|hablar|escribir|precio|tarifa|disponib/i, answer: contactAnswer },
  { test: /\bia\b|inteligencia artificial|\bai\b|workflow|proceso|prompt|cursor|claude/i, answer: aiWorkflowAnswer },
  { test: /(área|areas|industria|sector|especialidad|foco|rubro)/i, answer: areasAnswer },
  { test: /experiencia|trayectoria|años|carrera|empresas|donde ha trabajado|dónde ha trabajado/i, answer: experienceAnswer },
  { test: /proyecto|portafolio|portfolio|caso|trabajos|qué ha hecho|que ha hecho|shipp|lanzad/i, answer: projectsAnswer },
  { test: /skills?|habilidad|stack|tecnolog|herramientas/i, answer: skillsAnswer },
];

export function getConsoleAnswer(query: string): ConsoleAnswer {
  const q = query.trim();
  if (!q) return fallbackAnswer();
  for (const rule of rules) {
    if (rule.test.test(q)) return rule.answer();
  }
  return fallbackAnswer();
}
