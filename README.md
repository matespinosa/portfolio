# Portfolio — Mateo Espinosa

Portafolio de Senior Product Designer migrado a **Next.js 15 (App Router) + TypeScript**.
Cinco variantes visuales conmutables (sin Tailwind): Editorial, Agency, Terminal, Signal y Mono.

## Variantes visuales

Pill flotante abajo a la izquierda para cambiar de skin (persiste en `localStorage`):

| Skin | Origen de rama | Look |
|---|---|---|
| **Editorial** | `designer-portfolio` + `case-study-pages` | Cálida, Space Grotesk + Instrument Serif, acento terracota |
| **Agency** | `portfolio-ai-enhanced` | Monocromo + lima, Sora/Inter, grid blueprint |
| **Terminal** | `green-proposal-redesign` | Dev mode: secciones de terminal moderna (prompt tipeado, repos, git log, ssh), domo dither Three.js, fósforo verde + JetBrains Mono |
| **Signal** | `signal-skin-globe-chat-cursors` | Dark-tech violeta, globo 3D, cursores colaborativos |
| **Mono** | `portfolio-professional-black-and-white` | B&N editorial, retrato integrado, GSAP |

## Stack

- Next.js 15 + React 19
- Contenido tipado en `content/`
- Skins CSS vía `data-skin` (`lib/skins.ts` + `components/layout/VisualPill.tsx`)
- Framer Motion (transiciones de página suaves)
- Formulario de contacto → Resend
- Chat / búsqueda en lenguaje natural → Vercel AI SDK con proveedor intercambiable (Claude, Groq/Llama, OpenRouter, Ollama o modo demo sin key)

## Desarrollo

Requiere Node **22.x** (AI SDK 7 y sus proveedores no soportan versiones anteriores). Con nvm:

```bash
nvm use 22
cp .env.example .env.local
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

> **Nota iCloud:** este repo está en iCloud Drive. `npm run dev` ya **no** borra
> `.next` al arrancar (eso colgaba el terminal). Si ves errores raros de caché:
> Ctrl+C y `npm run clean && npm run dev` (puede tardar). Ideal: mover el proyecto
> fuera de iCloud (`~/Projects/...`).

## Chat del portafolio

El chat es un asistente conversacional que responde **solo con el contenido del sitio**
(casos de estudio, experiencia, skills) y devuelve respuestas ricas: tarjetas de
proyecto con miniatura y métrica, chips de preguntas de seguimiento y CTA de contacto.

### Cómo funciona

```
Usuario → ChatWidget (useChat, streaming SSE)
        → POST /api/chat  (rate limit por IP + validación)
        → lib/chatModel.ts  elige el proveedor según env
        → streamText() con system prompt generado desde content/ (lib/systemPrompt.ts)
        → El modelo responde markdown + marcadores: [[project:slug]] [[cta:contact]] [[suggest:…]]
        → AssistantMessage.tsx parsea el stream y pinta tarjetas/chips en vivo
```

No hay base de datos vectorial: todo el contenido tipado de `content/` cabe en el
system prompt (RAG "de contexto completo"). Si el portafolio crece mucho, el paso
natural es filtrar proyectos por relevancia antes de armar el prompt.

### Proveedores de LLM

Se elige con `CHAT_PROVIDER` o auto-detección por key disponible (ver `.env.example`):

| Proveedor | Modelo default | Costo | Notas |
|---|---|---|---|
| `anthropic` | claude-haiku-4-5 | De pago (bajo) | Mejor calidad y manejo de instrucciones |
| `groq` | llama-3.3-70b-versatile | **Gratis** (free tier) | Open source, muy rápido — recomendado si quieres $0 |
| `openrouter` | llama-3.3-70b-instruct:free | **Gratis** (con límites) | Acceso a muchos modelos open source |
| `ollama` | llama3.2 | **Gratis** (local) | Corre en tu máquina; no sirve en Vercel |
| `demo` | — | Gratis | Sin LLM: retrieval por keywords sobre `content/` |

Sin ninguna key, el chat entra en **modo demo** automáticamente: sigue funcionando
con respuestas predefinidas, ideal para desarrollo y previews.

## Variables de entorno

| Variable | Uso |
|---|---|
| `CHAT_PROVIDER` | Forzar proveedor del chat (opcional) |
| `CHAT_MODEL` | Sobrescribir modelo (opcional) |
| `ANTHROPIC_API_KEY` / `GROQ_API_KEY` / `OPENROUTER_API_KEY` | Key del proveedor elegido |
| `OLLAMA_BASE_URL` | URL de Ollama local (opcional) |
| `RESEND_API_KEY` | Email del formulario |
| `CONTACT_TO_EMAIL` | Destino (default: matespinosa09@gmail.com) |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend |
| `SITE_URL` | Base para metadata / sitemap |

Sin keys, la home y los casos de estudio funcionan; el contacto devuelve 503 y el
chat usa el modo demo.

## Contenido

Edita:

- `content/profile.ts` — bio, stats, redes
- `content/projects.ts` — proyectos y casos (marcados `isPlaceholder: true` hasta reemplazar)
- `content/experience.ts` — timeline y tools

## Deploy (Vercel)

1. Conecta el repo a un proyecto Vercel.
2. Confirma en **Settings → Build and Deployment** que la versión de Node sea **22.x**.
3. Copia las variables de `.env.example` a Production + Preview.
4. En Resend, verifica dominio o usa el FROM de prueba en preview.
5. En Anthropic Console, pon alerta de presupuesto (endpoint público).

### URLs del proyecto

- Producción (alias del equipo): `https://portfolio-matespinosas-projects.vercel.app`
- Rama `main` / default: `https://portfolio-git-main-matespinosas-projects.vercel.app`
- La URL antigua `portfolio-plum-ten-p857rtimra.vercel.app` ya no existe (404).

### Si el sitio pide login de Vercel o el chat falla

El chat **sí funciona** en modo demo sin API keys. Si en Vercel ves login de Vercel
o el chat responde con error 401 / "Protected deployment", el proyecto tiene
**Deployment Protection (Vercel Authentication)** activo en Production.

Arréglalo en el dashboard (no se puede cambiar desde el repo):

1. Abre el proyecto en [vercel.com](https://vercel.com) → **Settings** → **Deployment Protection**.
2. En Production, pon protección en **None** (o solo Preview Deployments).
3. Guarda y abre de nuevo el alias de producción (sin SSO).
4. El botón **Pregúntame** debería responder aunque no haya `ANTHROPIC_API_KEY` /
   `GROQ_API_KEY` (modo demo).

Opcional: añade una key (`GROQ_API_KEY` recomendado si quieres $0) para respuestas
con LLM real en vez del retrieval por keywords.

## Legacy

La versión estática original está en `_legacy/` como referencia.
