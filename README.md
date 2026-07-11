# Portfolio — Mateo Espinosa

Portafolio de Senior Product Designer migrado a **Next.js 15 (App Router) + TypeScript**.
Misma estética editorial (tokens CSS, Space Grotesk + Instrument Serif). Sin Tailwind.

## Stack

- Next.js 15 + React 19
- Contenido tipado en `content/`
- Framer Motion (transiciones de página suaves)
- Formulario de contacto → Resend
- Chat / búsqueda en lenguaje natural → Vercel AI SDK con proveedor intercambiable (Claude, Groq/Llama, OpenRouter, Ollama o modo demo sin key)

## Desarrollo

Requiere Node **≥ 18.18** (recomendado 20+). Con nvm:

```bash
nvm use 22
cp .env.example .env.local
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Variables de entorno

| Variable | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Chat (solo servidor) |
| `RESEND_API_KEY` | Email del formulario |
| `CONTACT_TO_EMAIL` | Destino (default: matespinosa09@gmail.com) |
| `CONTACT_FROM_EMAIL` | Remitente verificado en Resend |
| `SITE_URL` | Base para metadata / sitemap |

Sin keys, la home y los casos de estudio funcionan; contacto y chat devolverán 503 hasta configurarlas.

## Contenido

Edita:

- `content/profile.ts` — bio, stats, redes
- `content/projects.ts` — proyectos y casos (marcados `isPlaceholder: true` hasta reemplazar)
- `content/experience.ts` — timeline y tools

## Deploy (Vercel)

1. Conecta el repo a un proyecto Vercel.
2. Copia las variables de `.env.example` a Production + Preview.
3. En Resend, verifica dominio o usa el FROM de prueba en preview.
4. En Anthropic Console, pon alerta de presupuesto (endpoint público).

## Legacy

La versión estática original está en `_legacy/` como referencia.
