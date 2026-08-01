import { profile } from "@/content/profile";

/**
 * Registro único de comandos de la superficie (⌘K).
 *
 * Un token conocido ejecuta de inmediato; cualquier otra frase va a la IA
 * (/api/chat). La lista de `ayuda`, el autocompletado y las sugerencias
 * derivan todas de este archivo: si un comando no está aquí, no existe.
 */

export interface CommandCtx {
  /** Navega a otra ruta (router.push). */
  navigate: (href: string) => void;
  /** Salta a un ancla del home; fuera del home, navega hacia él. */
  jump: (hash: string) => void;
  /** Alterna el tema y devuelve el resultante. */
  toggleTheme: () => "light" | "dark";
  /** Copia texto al portapapeles. */
  copy: (text: string) => Promise<void>;
}

export interface CommandResult {
  /** Línea de feedback exacta que muestra el panel. */
  output: string;
  /** Si true, la superficie se cierra tras un beat de feedback. */
  closes: boolean;
}

export interface CommandDef {
  token: string;
  /** Qué hace — para el listado y para `ayuda`. */
  hint: string;
  /** `help` se resuelve en la superficie (muestra el listado). */
  special?: "help";
  run?: (ctx: CommandCtx) => Promise<CommandResult> | CommandResult;
}

const LINKEDIN = profile.socials[0]?.href ?? "https://www.linkedin.com";

export const COMMANDS: CommandDef[] = [
  {
    token: "proyectos",
    hint: "ir a proyectos",
    run: (ctx) => {
      ctx.jump("#proyectos-mono");
      return { output: "→ ~/proyectos", closes: true };
    },
  },
  {
    token: "mibanco",
    hint: "caso miBanco — onboarding",
    run: (ctx) => {
      ctx.navigate("/proyectos/mibanco-onboarding");
      return { output: "→ ~/proyectos/mibanco", closes: true };
    },
  },
  {
    token: "credicorp",
    hint: "caso Credicorp Capital — canal enterprise",
    run: (ctx) => {
      ctx.navigate("/proyectos/credicorp-capital");
      return { output: "→ ~/proyectos/credicorp", closes: true };
    },
  },
  {
    token: "kapital",
    hint: "caso Kapital Bank — factoring",
    run: (ctx) => {
      ctx.navigate("/proyectos/kapital-factoring");
      return { output: "→ ~/proyectos/kapital", closes: true };
    },
  },
  {
    token: "modyo",
    hint: "caso Modyo — plataforma",
    run: (ctx) => {
      ctx.navigate("/proyectos/modyo-platform");
      return { output: "→ ~/proyectos/modyo", closes: true };
    },
  },
  {
    token: "sobre",
    hint: "quién soy",
    run: (ctx) => {
      ctx.jump("#sobre-mi-mono");
      return { output: "→ ~/sobre", closes: true };
    },
  },
  {
    token: "trayectoria",
    hint: "experiencia",
    run: (ctx) => {
      ctx.jump("#experiencia-mono");
      return { output: "→ ~/trayectoria", closes: true };
    },
  },
  {
    token: "contacto",
    hint: "ir al formulario",
    run: (ctx) => {
      ctx.jump("#contacto");
      return { output: "→ ~/contacto", closes: true };
    },
  },
  {
    token: "email",
    hint: "copiar mi email",
    run: async (ctx) => {
      await ctx.copy(profile.email);
      return { output: `copiado · ${profile.email}`, closes: false };
    },
  },
  {
    token: "linkedin",
    hint: "abrir perfil",
    run: () => {
      window.open(LINKEDIN, "_blank", "noopener,noreferrer");
      return { output: "abriendo ↗ linkedin.com/in/mateo-espinosa", closes: false };
    },
  },
  // TODO: comando `cv` cuando exista el PDF real en /public (descarga directa).
  {
    token: "tema",
    hint: "alternar claro / oscuro",
    run: (ctx) => ({ output: `tema · ${ctx.toggleTheme()}`, closes: false }),
  },
  { token: "ayuda", hint: "listar todos los comandos", special: "help" },
];

/** Sugerencias al abrir con el input vacío — herederas de los chips del chat. */
export const SUGGESTED: ReadonlyArray<{ kind: "cmd" | "ai"; value: string }> = [
  { kind: "cmd", value: "proyectos" },
  { kind: "cmd", value: "trayectoria" },
  { kind: "cmd", value: "contacto" },
  { kind: "ai", value: "¿Cómo es tu proceso UX?" },
  { kind: "ai", value: "¿Qué sistemas de diseño has construido?" },
];

/** Minúsculas y sin tildes: `Diseño` y `diseno` matchean igual. */
export function normalizeToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function matchCommands(value: string): CommandDef[] {
  const needle = normalizeToken(value);
  if (!needle) return [];
  return COMMANDS.filter((c) => c.token.startsWith(needle));
}
