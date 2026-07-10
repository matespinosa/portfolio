# Portfolio — AI-native Product Designer (Next.js)

Tercera variante del portafolio: **senior product designer + frontend developer que construye
producto con IA**, con un workflow AI-enhanced como pieza central. UI llamativa y moderna
inspirada en referentes de Awwwards (Navbar Digital, Amphora, Kudos): tipografía display grande,
aurora de degradados, glassmorphism, bento grid e interacciones en desktop y mobile.

> Esta variante vive en la rama `claude/portfolio-ai-enhanced`.
> Las otras: `claude/designer-portfolio-site-k6xxz7` (v1 estática editorial) y
> `claude/portfolio-frontend-nextjs` (v2 temática GitHub/terminal).

## Concepto visual

- **Dark mode**: negro violeta profundo con aurora violeta → cian → magenta y grano sutil.
- **Light mode**: lienzo lavanda suave con los mismos degradados.
- Tipografía: **Sora** (display) + **Inter** (texto) + **JetBrains Mono** (labels/prompts).

## Secciones e interacciones

1. **Home** — palabra rotatoria con degradado animado, aurora en movimiento, botones magnéticos,
   barra de progreso de scroll con gradiente.
2. **Workflow AI-enhanced** (protagonista) — pipeline interactivo de 5 fases
   (Descubrir → Idear → Diseñar → Construir → Lanzar) con tabs que auto-avanzan,
   herramientas de IA por fase, "AI boost" y un mock de prompt con caret vivo.
3. **Proyectos** — bento grid asimétrico con *spotlight* que sigue el cursor y nota de
   cómo la IA aceleró cada proyecto.
4. **Experiencia** — cards glass con spotlight.
5. **Contacto** — CTA con forma de input de chat de IA (borde degradado) → mailto.

Todas las animaciones respetan `prefers-reduced-motion`; las interacciones de hover
degradan bien en touch (tabs y cards funcionan por tap).

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
Colores y tokens en [`app/globals.css`](app/globals.css) (`:root` y `.dark`).
