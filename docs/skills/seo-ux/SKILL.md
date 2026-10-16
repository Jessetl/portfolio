---
name: seo-ux
description: >-
  SEO técnico, UX de conversión y medición de CTAs para este portfolio (Next.js 16 App Router, SSG con el modelo de
  caché anterior —sin cacheComponents—, GA4 vía @next/third-parties y Microsoft Clarity). Define qué CTAs priorizar y
  dónde ubicarlos según dónde hacen clic los usuarios (Ver proyectos, CV, Hablemos/Contacto, LinkedIn,
  GitHub, email), cómo marcarlos y medirlos sin dañar Core Web Vitals, y cómo configurar SSG, metadata, canonical,
  Open Graph, sitemap, robots, JSON-LD, imágenes y fuentes. Úsala SIEMPRE que se cree o revise una página, sección,
  botón, enlace, CTA, formulario o el header; al tocar metadata, títulos, imágenes, fuentes, scripts de terceros,
  analítica, eventos, heatmaps, rutas o next.config; y cuando se pregunte por posicionamiento, Google, Search Console,
  Lighthouse, Core Web Vitals, conversión, clics, rebote o "qué botón poner", aunque no se diga "SEO".
---

# SEO + UX — portfolio

Dos objetivos: que Google rastree, entienda y muestre el portfolio (SEO técnico), y que el visitante —sobre todo
recruiters y clientes técnicos— llegue a una acción: ver un caso, descargar el CV o escribir. Cada cambio debe ayudar a
uno de los dos sin empeorar el otro, y se mide para decidir con datos.

Respeta las capas de `docs/skills/clean-architecture`: los datos de SEO (perfil, proyectos) salen del container; la
analítica es presentación.

> Next.js 16 trae cambios de API. Antes de escribir código de Next, lee la guía correspondiente en
> `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Cómo usar esta skill

1. Página o sección nueva → checklist SEO (sección 6) y CTAs de esa zona (sección 2).
2. CTA nuevo → reglas de la sección 3; márcalo con `ctaAttrs` (sección 4).
3. Script de terceros o analítica → solo como indica la sección 4.
4. Rutas, config o datos → sección 5 (SSG). Verifica con `pnpm build`.
5. Revisión → reporta `archivo:línea — problema — impacto (SEO | UX | CWV) — corrección`.

Código de referencia: `references/ejemplos.md`. Configurar GA4, Clarity y Search Console, y leer los datos:
`references/medicion.md`.

## 1. Qué mueve el posicionamiento y qué no

- **Sí posiciona:** contenido relevante en HTML prerenderizado (nombre, rol, stack, casos), `title` y `description`
  únicos, enlaces internos rastreables, datos estructurados y experiencia de página. Core Web Vitals en p75:
  LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- **No posiciona directamente:** la tasa de rebote y el tiempo en el sitio de GA4. Google no usa datos de Analytics
  para el ranking. Se miden para mejorar la UX y la conversión, no "para Google".
- **No aplica aquí:** `getStaticProps` es del Pages Router. En este proyecto, SSG significa Server Components
  prerenderizados en build más `generateStaticParams`.
- **Para posicionar, la fuente es Search Console** (consultas, impresiones, CTR en resultados, indexación). GA4 y
  Clarity explican qué pasa después del clic.

## 2. Dónde hacen clic y qué CTAs tiene el diseño

Zonas con más clics en portfolios (mapas de calor), contrastadas con las pantallas de Penpot:

| Zona                  | Qué buscan              | CTAs del diseño (v2)                                                       | Brecha a cubrir                                                 |
| --------------------- | ----------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Header (fijo)         | Navegar, CV             | Nav a las 5 secciones, `CV`; en mobile, menú con `Hablemos` y `Descargar CV` | —                                                               |
| Hero (`#inicio`)      | Ver trabajo o contactar | `Ver proyectos` (primario), `Hablemos`, `Descargar CV`, GitHub, LinkedIn   | —                                                               |
| Sobre mí              | Quién eres              | —                                                                          | —                                                               |
| Proyectos             | Detalle, demo, código   | `Hablemos de este proyecto` en cada proyecto                               | No hay `Ver demo` ni `Ver código` cuando el proyecto sea público |
| Experiencia           | Trayectoria, CV         | `Descargar CV`                                                             | —                                                               |
| Contacto              | Escribir                | Email (enlace y copiar), LinkedIn, GitHub, `Enviar mensaje`                | Copiar el email no tiene estado "copiado" en Penpot             |
| Mensaje enviado       | Siguiente paso          | `Volver al inicio`, `Ver proyectos`                                        | —                                                               |
| Footer                | Redes, volver arriba    | GitHub, LinkedIn, email, `Volver arriba`                                   | —                                                               |

Prioridad de los CTAs, de más a menos valor: `Enviar mensaje` y `Hablemos` → `CV` → `Hablemos de este proyecto` →
LinkedIn y GitHub → navegación.

## 3. Reglas de UX para CTAs

1. **Un primario por vista.** El resto, secundario o ghost (las variantes de Penpot). Dos primarios compiten entre sí.
2. **Verbo + objeto.** "Ver proyectos", "Descargar CV", "Hablemos de este proyecto"; nunca "Click aquí" ni "Más". Si
   el texto visible es genérico, el enlace debe nombrar el objeto (texto oculto o `aria-label`). Eso también es mejor
   texto de enlace para Google.
3. **Lo que parece clicable, lo es.** Si una tarjeta lleva a algún lado (LinkedIn y GitHub en Contacto), toda la
   tarjeta es el enlace. Nada decorativo con forma de botón: Clarity lo muestra como _dead clicks_ o _rage clicks_.
4. **Enlaces reales.** Navega con `<Link>` o `<a href>`, nunca con `onClick` en un `div`: Google sigue `href`, no
   handlers, y una vista sin URL no se indexa.
5. **Contraste y tamaño.** Texto ≥ 4,5:1 e íconos y bordes ≥ 3:1 (WCAG AA). Área táctil recomendada de 44 × 44 px (el
   mínimo de WCAG 2.2 AA es 24 × 24). El primario usa el color de acento de los tokens.
6. **Estados completos.** hover, `focus-visible` con anillo visible, active (`scale .97`, spec de Penpot) y
   disabled/`pending` durante el envío.
7. **Confianza pegada al CTA.** Las métricas del hero (7 años, 85 %, 2.000 usuarios) junto a `Ver proyectos`;
   "Respondo en < 24 h" y "Solo uso tus datos para responderte" junto a `Enviar mensaje`; "Disponible para nuevos
   proyectos" en el hero.
8. **Externos y descargas explícitos.** LinkedIn y GitHub con `target="_blank" rel="noopener noreferrer"` y texto
   oculto "(abre en una pestaña nueva)". El CV es un PDF real con nombre descriptivo (`/cv-jesus-matute.pdf`) y
   atributo `download`.
9. **Misma acción, mismo nombre y destino.** `CV` del header y `Descargar CV` bajan el mismo archivo; `Hablemos`
   siempre lleva a Contacto.
10. **Feedback inmediato.** Tras enviar, "Mensaje enviado" confirma y ofrece el siguiente paso.
11. **La intro no bloquea.** La intro (terminal) es un overlay sobre HTML ya renderizado: se salta con clic o
    Enter (como indica el diseño), aparece una vez por sesión y se omite con `prefers-reduced-motion` o al entrar por un
    ancla (`/#contacto`). Nunca retrasa el hero (LCP).

## 4. Medición: GA4 + Clarity

- **GA4** (`@next/third-parties/google`) registra los eventos de negocio. **Clarity** (`next/script`, `lazyOnload`)
  aporta mapas de calor, mapas de scroll, grabaciones y clics frustrados.
- Los CTAs siguen siendo Server Components: se marcan con `ctaAttrs(cta, location, project?)` (atributos `data-cta*`).
  Las secciones del inicio, con `sectionAttrs(section)` (`id` del ancla + `data-section`). `CtaTracker` (root layout)
  escucha todos los clics por delegación; `SectionViews` (en el inicio, no en el layout) observa cuándo cada sección
  cruza la mitad de la pantalla, una vez por vista. Cero JS por botón y SSG intacto.
- Una sola página: el embudo del recorrido (inicio → contacto) sale de `section_view`.
- Catálogo cerrado: no agregues eventos ni valores sin sumarlos aquí.

| Evento          | Cuándo                                                                       | Parámetros                              |
| --------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| `cta_click`     | Clic en un elemento con `data-cta`                                           | `cta`, `location`, `project` (opcional) |
| `section_view`  | Una sección (`data-section`) cruza la mitad de la pantalla; una vez por vista | `section`                               |
| `generate_lead` | El formulario de contacto devuelve `sent`                                    | `form: 'contact'`                       |

- `cta`: `projects` · `contact` · `cv` · `email` · `linkedin` · `github`.
- `location`: `header` · `hero` · `projects` · `experience` · `contact` · `sent` · `footer`.
- `section`: `home` · `about` · `stack` · `projects` · `experience` · `contact`.
- `project`: el `slug` del proyecto en `Hablemos de este proyecto`.
- La medición mejorada de GA4 ya registra `page_view` (también en navegación del cliente), `file_download` (el PDF del
  CV) y clics salientes. `cta_click` agrega _desde dónde_ se hizo el clic.
- Sin datos personales en los eventos (ni el nombre ni el email del formulario): las políticas de GA4 lo prohíben.
- Los scripts se cargan solo en producción y con ID configurado; nunca con `beforeInteractive`. El handler de clic
  solo lee `dataset` y envía (cuida el INP).
- **Consentimiento:** no hay banner (no existe en Penpot). En el EEE, el Reino Unido y Suiza, GA4 arranca con
  Consent Mode denegado (`analytics_storage` y `ad_*`: solo pings sin cookies) y Clarity, sin señal de consentimiento,
  funciona sin cookies. Fuera de esas regiones, GA4 usa cookies de analítica; `ad_*` queda denegado siempre. Un banner
  para pedir consentimiento necesita su diseño en Penpot primero.

## 5. SSG con el modelo de caché anterior ("Legacy")

El proyecto usa el modelo anterior de caché de Next 16 (sin `cacheComponents`): todas las rutas se prerenderizan en
`next build` y se sirven como HTML estático.

- `next.config.ts`: sin `cacheComponents` ni `partialPrefetching` (esta requiere la primera), y con
  `images.formats: ['image/avif', 'image/webp']`.
- Root layout: `export const dynamic = 'error'`. El build falla si algo vuelve dinámica una ruta.
- Rutas con parámetros, si se agregan: `generateStaticParams` + `export const dynamicParams = false`. Un parámetro
  desconocido da 404 y nunca se renderiza en runtime.
- Prohibido en páginas y layouts: `cookies()`, `headers()`, `searchParams`, `fetch` con `cache: 'no-store'` o
  `revalidate: 0`, y las APIs de Cache Components (`'use cache'`, `cacheLife`, `cacheTag`, `ensureStatic`).
- Las Server Actions (formulario de contacto) siguen funcionando: se ejecutan al enviar, no al renderizar.
- Contenido nuevo = nuevo build. Si algún día hace falta actualizar sin desplegar, usa
  `export const revalidate = <segundos>` (ISR) en vez de volver dinámica la ruta.
- Verificación: en la salida de `pnpm build`, cada ruta es `○ (Static)` o `● (SSG)`. Una `ƒ (Dynamic)` es un bug.

### Estructura de URLs

```
/                    una sola página: #inicio, #sobre-mi, #stack, #proyectos, #experiencia y #contacto
/sobre-mi … /contacto rutas de v1: redirigen (308) a su ancla (next.config.ts)
```

- Todo el contenido está en el HTML del inicio, con un `h1` (el nombre) y un `h2` por sección. La nav del header y
  del menú móvil sale de `src/components/site/sections.ts` y enlaza a `/#ancla`, así funciona también desde la 404.
- Las redirecciones 308 conservan los enlaces viejos (LinkedIn, Search Console) y pasan su señal al inicio.
- "Mensaje enviado" es un estado del formulario, no una ruta indexable. La intro es un overlay de la primera visita.

## 6. Checklist SEO por página

- [ ] `<html lang="es">`.
- [ ] Un solo `<h1>`; secciones con `<h2>` en orden; landmarks `header`, `nav`, `main`.
- [ ] El nombre completo y el rol aparecen en texto visible del hero, no solo en el logo.
- [ ] `title` único (50–60 caracteres) y `description` (140–160) por página. El layout define `title.template` y
      `metadataBase`.
- [ ] `alternates.canonical` en cada página, nunca en el layout: una canonical heredada marcaría todas las páginas como
      copia del inicio.
- [ ] `openGraph` del hijo reemplaza al del layout, no se fusiona: repite lo necesario.
- [ ] `src/app/opengraph-image.png` (1200 × 630).
- [ ] JSON-LD `Person` en el inicio (nombre, rol, URL, `sameAs` con LinkedIn y GitHub), con `<` escapado.
- [ ] `sitemap.ts` (solo `/`) y `robots.ts` apuntando al sitemap. Google ignora `priority` y `changeFrequency`;
      `lastModified` solo si es real.
- [ ] Imágenes con `next/image`, `alt` descriptivo y `width`/`height` (o `fill` + `sizes`). La imagen LCP, si la hay,
      con `loading="eager"` o `fetchPriority="high"`: en Next 16 `priority` está deprecado.
- [ ] Fuentes con `next/font` (IBM Plex Sans, JetBrains Mono): sin saltos de layout ni peticiones a Google
      en runtime.
- [ ] Enlaces internos con `<Link>` a las anclas de `src/components/site/sections.ts`.
- [ ] `pnpm build` sin rutas `ƒ`, y Lighthouse ≥ 90 en Performance, Accessibility y SEO para el inicio.

## 7. Antipatrones

| Síntoma                                                           | Impacto                                  | Corrección                                             |
| ----------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| CTA hecho con `<div onClick>`                                     | SEO + accesibilidad                      | `<Link>` o `<a href>`                                  |
| Tarjeta que lleva a un sitio, pero solo el texto es clicable      | UX (dead clicks)                         | Toda la tarjeta es el enlace                           |
| Información clave solo dentro de un modal                         | SEO: no indexable                        | El contenido va en el HTML de la página                |
| `useSearchParams` o `cookies()` en una página                     | Rompe el SSG (el build falla)            | Moverlo a un Client Component o eliminarlo             |
| Analítica con `beforeInteractive` o `<script>` manual en `<head>` | CWV                                      | `@next/third-parties` y `next/script` con `lazyOnload` |
| `onClick={() => sendGAEvent(...)}` en cada botón                  | JS y Client Components de más            | `ctaAttrs` + `CtaTracker`                              |
| Canonical en el layout                                            | SEO: todas las páginas apuntan al inicio | Canonical por página                                   |
| Intro que retiene el hero 2,5 s                                   | LCP + rebote                             | Overlay saltable sobre HTML ya renderizado             |
| Imagen sin dimensiones                                            | CLS                                      | `next/image` con `width`/`height`                      |
| Email o nombre en parámetros de eventos                           | Política de GA4                          | Solo `cta`, `location`, `project`, `section`, `form`   |
| Dos CTAs primarios en la misma vista                              | UX                                       | Uno primario; el resto, secundario                     |
