# Portfolio — Senior Product Designer

Sitio de portafolio para un Senior Product Designer. Estética editorial inspirada
en referentes de [Awwwards](https://www.awwwards.com/) y [Siteinspire](https://www.siteinspire.com/):
tipografía grande, mucho espacio en blanco, un solo color de acento y
micro-interacciones sutiles (nada de animación exagerada).

## Secciones

- **Home** — hero con titular editorial, badge de disponibilidad y stats animadas
- **Proyectos** — tarjetas de casos de estudio con mockups SVG y métricas de impacto
- **Sobre mí** — bio + servicios (sección recomendada para portafolios senior)
- **Experiencia** — timeline profesional + herramientas
- **Contacto** — email destacado y redes sociales

## Stack

HTML + CSS + JavaScript puro. Sin frameworks ni dependencias — solo Google Fonts
(Space Grotesk + Instrument Serif).

Características:

- Tema claro/oscuro con persistencia en `localStorage` (respeta `prefers-color-scheme`)
- Reveals al hacer scroll con `IntersectionObserver` (stagger automático)
- Respeta `prefers-reduced-motion`
- Totalmente responsive (menú móvil incluido)
- Navegación con estado activo según la sección visible

## Cómo verlo

Es un sitio estático: abre `index.html` en el navegador o sirve la carpeta:

```bash
npx serve .
# o
python3 -m http.server 8000
```

Listo para desplegar en GitHub Pages, Netlify o Vercel sin build.

## Personalización

- **Contenido**: todo el texto vive en `index.html` (proyectos, experiencia, bio).
- **Colores y tipografía**: tokens CSS al inicio de `styles.css` (`:root` y `[data-theme="dark"]`).
- **Imágenes reales**: reemplaza los `<svg class="project__art">` por `<img>` de tus proyectos.
