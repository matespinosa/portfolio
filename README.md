# Portfolio — Product & Frontend Designer (Next.js)

Versión alternativa del portafolio con una identidad visual de **product designer + frontend designer**:
temática de código y actividad de repositorio estilo GitHub, con animaciones ricas
pero controladas. Inspirado en referentes de [Awwwards](https://www.awwwards.com/).

> Esta es la variante en la rama `claude/portfolio-frontend-nextjs`.
> La versión estática (HTML/CSS/JS) vive en la rama `claude/designer-portfolio-site-k6xxz7`.

## Concepto visual

- **Dark mode**: fondo casi negro, verde terminal/GitHub (`#39d353`) como acento, grid tipo blueprint.
- **Light mode**: "IDE claro", limpio, con el mismo verde de acento.
- Tipografía: **Space Grotesk** (display) + **JetBrains Mono** (código/UI técnica).

## Secciones

1. **Home** — hero con esfera de partículas 3D (Three.js), parallax al scroll y botones magnéticos.
2. **Sobre mí** — bloque tipo editor de código (`const designer = {…}`) con syntax highlighting.
3. **Proyectos** — tarjetas con parallax individual y stats de impacto al hover.
4. **Actividad (building in public)** — la sección estrella: **grafo de contribuciones estilo GitHub**
   que se anima celda por celda al hacer scroll, stats, barra de lenguajes y feed de actividad reciente.
5. **Experiencia** — timeline con hover.
6. **Contacto** — terminal interactiva con cursor parpadeante.

## Stack técnico

- [Next.js 14](https://nextjs.org/) (App Router) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) con tokens de tema en CSS variables
- [Framer Motion](https://www.framer.com/motion/) — reveals, parallax, stagger, botones magnéticos
- [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) — hero 3D
- [next-themes](https://github.com/pacocoursey/next-themes) — dark/light con persistencia
- Respeta `prefers-reduced-motion` en todas las animaciones

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción
npm run start    # sirve el build
```

## Personalización

Todo el contenido (perfil, proyectos, experiencia, stats, lenguajes) vive en
[`lib/data.ts`](lib/data.ts). Los colores y tokens del tema están en
[`app/globals.css`](app/globals.css) (`:root` y `.dark`).

El grafo de contribuciones se genera de forma determinista en
[`lib/contributions.ts`](lib/contributions.ts) — se puede conectar a la API real de
GitHub para mostrar datos en vivo.
