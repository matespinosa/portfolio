# Portfolio — AI-native Product Designer (Next.js)

Tercera variante del portafolio: **senior product designer + frontend developer que construye
producto con IA**. Dirección visual minimalista — negro, blanco y un solo color de acento —
inspirada en agencias digitales tipo Awwwards SOTD (referente: navbardigital.com): tipografía
display muy grande, grid de fondo tipo blueprint, marcas "+" de esquina y una consola de IA como
pieza central del hero.

> Esta variante vive en la rama `claude/portfolio-ai-enhanced`.
> Las otras: `claude/designer-portfolio-site-k6xxz7` (v1 estática editorial) y
> `claude/portfolio-frontend-nextjs` (v2 temática GitHub/terminal).

## Concepto visual

- **Monocromo + un acento**: negro/blanco como base, un único verde lima (`--accent`) para todo
  el énfasis — sin degradados multicolor. Mismo acento en ambos temas.
- **Dark mode**: negro casi puro, grid sutil, halo de acento único (no aurora multicolor).
- **Light mode**: blanco puro, misma estructura.
- Tipografía: **Sora** (display) + **Inter** (texto) + **JetBrains Mono** (labels/consola).

## Secciones e interacciones

1. **Home + consola IA** (pieza central) — el hero incluye una **consola interactiva estilo
   VS Code/Cursor** (`components/AIConsole.tsx`) donde el visitante pregunta en lenguaje natural
   ("¿Qué proyectos ha hecho?", "¿Cuál es su experiencia?", "¿En qué áreas ha trabajado?", "¿Cómo
   usa la IA en su proceso?", "¿Cómo lo contacto?") o escribe su propia pregunta. La respuesta se
   genera localmente (sin backend, `lib/ai-console.ts`) a partir del contenido real del
   portafolio en `lib/data.ts`, con formato tipo bloque de código (`const proyectos = [...]`) y
   enlaces directos a la sección correspondiente — así no hay que navegar todo el sitio para
   entender qué ha hecho Mateo.
2. **Workflow AI-enhanced** — pipeline interactivo de 5 fases (Descubrir → Idear → Diseñar →
   Construir → Lanzar) con tabs que auto-avanzan, herramientas de IA por fase y un mock de prompt.
3. **Proyectos** — bento grid con *spotlight* que sigue el cursor.
4. **Experiencia** — cards con spotlight.
5. **Contacto** — CTA con forma de input de chat de IA → mailto.

Todas las animaciones respetan `prefers-reduced-motion`; las interacciones de hover degradan
bien en touch (tabs, chips de la consola y cards funcionan por tap).

## Stack

- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS con tokens de tema en CSS variables
- Framer Motion (reveals, AnimatePresence, springs, scroll progress)
- next-themes (dark/light persistente)

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
```

## Personalización

Contenido (perfil, workflow, proyectos, experiencia) en [`lib/data.ts`](lib/data.ts).
Respuestas de la consola IA en [`lib/ai-console.ts`](lib/ai-console.ts) — se derivan
automáticamente de `lib/data.ts`, así que al editar proyectos/experiencia las respuestas se
actualizan solas. Colores y tokens en [`app/globals.css`](app/globals.css) (`:root` y `.dark`).
