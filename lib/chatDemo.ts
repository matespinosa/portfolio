import { profile } from "@/content/profile";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";

/**
 * Modo demo del chat: sin LLM ni API keys.
 * Hace retrieval simple por keywords sobre el contenido tipado y arma una
 * respuesta con el mismo protocolo de bloques ricos ([[project:...]], etc.)
 * que usan los modelos reales, así la UI se comporta idéntico.
 */

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function scoreProject(query: string): { slug: string; score: number }[] {
  const terms = normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  return projects
    .map((p) => {
      const haystack = normalize(
        [p.name, p.title, p.tags.join(" "), p.summary, p.overview, p.role, p.tools.join(" ")].join(" "),
      );
      const score = terms.reduce((acc, t) => (haystack.includes(t) ? acc + 1 : acc), 0);
      return { slug: p.slug, score };
    })
    .sort((a, b) => b.score - a.score);
}

const CONTACT_WORDS = ["contact", "contrat", "hablar", "email", "correo", "disponib", "trabajar juntos", "reunion", "llamada", "presupuesto", "precio"];
const EXPERIENCE_WORDS = ["experiencia", "trayectoria", "carrera", "empresas", "donde ha trabajado", "cv", "recorrido", "anos", "años"];
const SKILL_WORDS = ["skill", "habilidad", "herramient", "proceso", "metodo", "research", "ux", "ui", "figma", "que hace", "que sabe"];

function includesAny(query: string, words: string[]): boolean {
  const q = normalize(query);
  return words.some((w) => q.includes(normalize(w)));
}

export function buildDemoAnswer(query: string): string {
  const q = query.trim();

  if (includesAny(q, CONTACT_WORDS)) {
    return [
      "Sí. La vía más directa es el formulario de contacto o escribirle por email:",
      "",
      "[[cta:contact]]",
      "",
      "[[suggest:¿Qué proyectos ha liderado?]]",
      "[[suggest:Cuéntame su trayectoria]]",
    ].join("\n");
  }

  if (includesAny(q, EXPERIENCE_WORDS)) {
    const lines = experience
      .slice(0, 3)
      .map((e) => `- **${e.period}** — ${e.role} en ${e.company}. ${e.description}`);
    return [
      `Mateo lleva **+8 años** diseñando productos digitales, de startups tempranas a productos con millones de usuarios. Lo más reciente:`,
      "",
      ...lines,
      "",
      "Dos proyectos que resumen bien esa trayectoria:",
      `[[project:${projects[0].slug}]]`,
      `[[project:${projects[1].slug}]]`,
      "",
      "[[suggest:¿Qué herramientas usa?]]",
      "[[suggest:¿Está disponible para proyectos?]]",
    ].join("\n");
  }

  const ranked = scoreProject(q);
  const top = ranked.filter((r) => r.score > 0).slice(0, 2);

  if (top.length > 0) {
    const first = projects.find((p) => p.slug === top[0].slug)!;
    const result = first.results[0];
    const body = [
      `Sobre eso, el caso más relevante es **${first.name}** (${first.year}): ${first.summary}`,
      "",
      `[[project:${first.slug}]]`,
    ];
    if (top.length > 1) {
      const second = projects.find((p) => p.slug === top[1].slug)!;
      body.push("", `También te puede interesar **${second.name}**: ${second.summary}`, "", `[[project:${second.slug}]]`);
    }
    body.push(
      "",
      `[[suggest:¿Qué resultados tuvo ${first.name}?]]`,
      "[[suggest:¿Cómo es su proceso de diseño?]]",
      "[[suggest:¿Está disponible para proyectos?]]",
    );
    if (result) {
      body.splice(1, 0, `El resultado clave: **${result.metric}** ${result.label}.`);
    }
    return body.join("\n");
  }

  if (includesAny(q, SKILL_WORDS)) {
    const skills = profile.skills.map((s) => `- **${s.title}** — ${s.description}`);
    return [
      "Su práctica cubre cuatro frentes:",
      "",
      ...skills,
      "",
      "Un ejemplo aplicado de design systems:",
      `[[project:orbita]]`,
      "",
      "[[suggest:¿Qué proyectos de fintech ha hecho?]]",
      "[[suggest:Cuéntame su trayectoria]]",
    ].join("\n");
  }

  // Fallback: presentación general
  return [
    `${profile.intro}`,
    "",
    "Estos son dos casos de estudio para empezar:",
    `[[project:${projects[0].slug}]]`,
    `[[project:${projects[3].slug}]]`,
    "",
    "[[suggest:¿Tiene experiencia con design systems?]]",
    "[[suggest:¿Cómo es su proceso de research?]]",
    "[[suggest:¿Está disponible para proyectos?]]",
  ].join("\n");
}
