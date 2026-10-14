# Portfolio — guía para agentes

Portfolio de Jesús Matute medido con GA4 y Microsoft Clarity para perfeccionarlo según dónde hacen clic los
reclutadores.

## Lee antes de trabajar

| Documento                                                                            | Cuándo                                                                                                |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| [`docs/platform.md`](docs/platform.md)                                               | Siempre: propósito, métricas, arquitectura y ciclo de mejora                                          |
| [`docs/skills/clean-architecture/SKILL.md`](docs/skills/clean-architecture/SKILL.md) | Antes de crear, mover o revisar archivos en `src/`                                                    |
| [`docs/skills/seo-ux/SKILL.md`](docs/skills/seo-ux/SKILL.md)                         | Al tocar páginas, secciones, CTAs, metadata, scripts de terceros, analítica, rutas o `next.config.ts` |

Las skills están enlazadas en `.claude/skills/`, así que Claude Code las carga solo. Otros agentes deben leerlas desde
`docs/skills/`.

## Diseño: solo Penpot

Penpot es la única fuente de diseño. **Si algo visible no está en Penpot, no se crea.**

- **Dónde:** team _Me_ → proyecto _portfolio_ → archivo _Portolio_ (escrito así en Penpot) → página _Page 1_. Boards:
  `00 · Intro` a `07 · Mensaje enviado`, `Overlay · Detalle de proyecto`, `Motion & Flow spec` y `Z-Flow guide`.
- **Cómo leerlo:** con el MCP de Penpot (`high_level_overview`, `execute_code`, `export_shape`); el archivo debe estar
  abierto con el plugin MCP conectado. Si no hay acceso, detente y pide que lo conecten: nunca implementes de memoria
  ni "aproximado".

Reglas:

1. Antes de crear o cambiar UI visible, lee el board correspondiente (textos, colores, tipografías, medidas e
   interacciones) y expórtalo como imagen para comparar el resultado.
2. No inventes pantallas, secciones, componentes, variantes, colores, fuentes, íconos, textos, interacciones ni
   animaciones. Si falta algo, detente, explica qué falta y propón agregarlo en Penpot. Edita Penpot solo si el
   usuario lo pide.
3. Colores, tipografías y fuentes salen de la librería de Penpot y se vuelven tokens en `src/app/globals.css` y
   `next/font` (Fraunces, IBM Plex Sans y JetBrains Mono). Lo que dejó el scaffolding no es el diseño y se reemplaza:
   los tokens neutrales de shadcn y la fuente Geist de create-next-app.
4. Los textos se copian exactos de Penpot. El contenido (perfil, proyectos, experiencia, stack) sale de Penpot hacia
   `src/content/`.
5. El movimiento es solo el de `Motion & Flow spec` y `Z-Flow guide`.
6. shadcn/ui aporta comportamiento y accesibilidad, no estilo: su apariencia se ajusta a Penpot, y no se agrega un
   componente sin equivalente en Penpot.
7. Penpot solo tiene desktop (pantallas de 1440 × 900; overlay de 600 × 900). En pantallas más chicas se reacomoda lo
   existente (apilar, cambiar columnas y tamaños) con los mismos tokens. Un elemento nuevo, como un menú móvil,
   necesita diseño en Penpot primero. Excepción aprobada por el usuario (2026-10-14): el menú móvil (overlay a pantalla
   completa en `src/components/site/mobile-menu.tsx`) se implementó sin board, solo con tokens y estilos existentes.
   Si se diseña en Penpot, el código se ajusta al board.
8. Estados sin diseño (errores de formulario, carga, 404): reutiliza estilos que ya existen en Penpot, como el texto de
   ayuda del formulario, y avisa que falta su diseño. Nunca inventes un estilo. No crees una página 404 propia hasta
   que exista en Penpot.
9. Sin Penpot solo se permite lo que no cambia el diseño visible: metadata, JSON-LD, sitemap y robots, atributos
   `data-*` de analítica, `aria-*` y texto `sr-only`, el anillo de `focus-visible` con tokens existentes y las variantes
   de `prefers-reduced-motion`.
10. Si una skill recomienda algo visible que no está en Penpot (por ejemplo, las brechas que lista `seo-ux`), es una
    propuesta para Penpot, no una tarea de código.

## Reglas del proyecto

- Funciones y componentes como arrow functions (`export const x = () => …`). No reescribas los archivos que genera
  shadcn en `src/components/ui/`.
- SSG con el modelo de caché anterior de Next 16: no reactives `cacheComponents` ni `partialPrefetching`. `pnpm build`
  solo puede mostrar rutas `○` o `●`.
- Analítica: solo los eventos del catálogo de `seo-ux`, y nunca datos personales.
- Textos de interfaz y documentación en español; identificadores de código en inglés.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
