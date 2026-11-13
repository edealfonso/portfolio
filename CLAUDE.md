# Portfolio de Elsa de Alfonso

Portfolio personal de una sola pantalla. Next.js (App Router) + Sanity, pensado para publicarse en Vercel.

@AGENTS.md

## Qué es

- **Header:** "Elsa de Alfonso · Full Stack Software Engineer", con About y Contact a la derecha.
- **Lista de proyectos** bajo el rótulo fijo "Selected projects", colgada desde arriba a una distancia fija y generosa del header (no centrada: así no se mueve al filtrar), con entrada animada (las líneas se dibujan, los títulos suben escalonados).
- **Hover:** el título se desplaza un poco a la derecha (Elsa probó título naranja y cambio de fondo y los descartó) y una ventana con el vídeo o la captura del proyecto sigue al cursor, y aparecen sus 2-3 tecnologías clave.
- **Clic:** popup con el tipo arriba a la derecha en gris (Website / Web platform / Platform contribution; Elsa descartó la fila "Type" con icono), qué es, mi parte, stack completo y links. Hay dos links distintos: `url` → "Visit site" (el resultado es trabajo de Elsa) y `companyUrl` → "About the company" (solo contexto, para productos internos).
- **Filtro por tecnología:** los tags del popup son clicables; los de la fila solo en móvil (en escritorio la ventana de cursor queda encima, así que son etiquetas y el clic abre el proyecto). Solo un filtro a la vez; se muestra sobre la lista como "Filtered by" con una ✕ para quitarlo. Los proyectos conservan su número original al filtrar.
- **About y Contact** son popups, no páginas.
- **Pie:** "© 2026 Elsa de Alfonso" al fondo de la página. No hay cookies ni analítica, así que no hay banner.
- **Móvil / sin hover:** no hay ventana de cursor; cada fila muestra sus tecnologías y una miniatura (el placeholder si no hay medios), y el popup lleva el vídeo o la captura arriba.

## Decisiones de diseño

- Estética: blanco roto, tipografía fina (Inter 200-300), etiquetas pequeñas en mono y mayúsculas (JetBrains Mono), un único acento naranja. Los colores son variables en `app/(site)/globals.css`.
- Interfaz en inglés, un solo idioma.
- Elsa quiere aire vertical generoso en los popups y transiciones suaves.
- Habrá proyectos internos (por ejemplo una plataforma de pagos) sin link público y con nombre genérico: el popup oculta los links que no existan. Sin vídeo ni captura se muestra siempre el mismo placeholder: una interfaz inventada y difuminada (`Placeholder` en `Portfolio.tsx`), decisión de Elsa para no enseñar capturas reales de productos internos.
- El nombre es "Portfolio" a secas, no "Web Portfolio".

## Estructura

- `app/(site)/` — la web: `page.tsx` (carga datos), `Portfolio.tsx` (todo el cliente), `globals.css`.
- `app/(studio)/studio/[[...tool]]/` — Sanity Studio embebido en `/studio`, con su propio layout raíz.
- `sanity/schema.ts` — tipos `project` y `about` (documento único con id `about`).
- `sanity/data.ts` — consulta GROQ con `"use cache"`; si no hay proyectos en Sanity, devuelve datos de ejemplo.
- `sanity.config.ts` lleva `"use client"`: sin eso el build falla al importar `sanity` desde un componente de servidor.

## Servicios

- **Sanity:** proyecto "Portfolio", ID `kumaz2g0`, dataset público `production`. CORS permitido para `localhost:3000`, `localhost:3210` y `https://elsadealfonso.vercel.app`.
- **Vercel:** proyecto `portfolio`, publicado en https://elsadealfonso.vercel.app y conectado al repo público `edealfonso/portfolio`: cada push a `main` se publica solo. `vercel.json` fija el framework a Next.js porque Vercel lo detectaba como Sanity Studio (por `sanity.cli.ts`) y el build fallaba.
- **Formulario de contacto:** Web3Forms, envío desde el cliente. La clave va en `NEXT_PUBLIC_WEB3FORMS_KEY`; sin ella el botón de enviar queda desactivado.
- Variables en `.env.local` (plantilla en `.env.local.example`).

## Comandos

- `npm run dev` — desarrollo
- `npm run build` — build de producción
- `npm run lint` — ESLint

## Pendiente

1. Clave de Web3Forms (la pide Elsa con su Gmail) y probar un envío real.
2. Los 7 primeros proyectos y el About están en Sanity (importados desde `sanity/seed.ndjson`; a partir de ahora se editan en `/studio`, reimportar el seed pisaría los cambios). Falta que Elsa revise los textos y añada más proyectos.
3. Subir vídeos o capturas, foto y CV desde `/studio`, y probar la ventana de cursor con medios reales.
4. Probar el filtro en móvil.
5. Si hay dominio propio: añadirlo en Vercel y a CORS de Sanity.
