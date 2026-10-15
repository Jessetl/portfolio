# Platform

Portfolio de Jesús Matute (Full-Stack Developer) construido como un producto medible: cada sección y cada CTA existen
para llevar a un reclutador o cliente a una acción, y los datos de uso deciden cómo evoluciona el sitio.

> **Estado (2026-10-14):** el diseño está completo en Penpot; las reglas de arquitectura y de SEO/UX están en
> `docs/skills/`; la configuración SSG y la librería de analítica están aplicadas. Hay layout responsive (header,
> footer, menú móvil y tokens de Penpot), una ruta por pantalla, la intro animada (00) y las pantallas de Inicio (01),
> Sobre mí (02), Stack (03), Proyectos (04, grilla y filtro), Experiencia (05) y Contacto (06, con su estado 07 ·
> Mensaje enviado) completas. El formulario envía con una Server Action a un webhook: configura `CONTACT_WEBHOOK_URL`
> en el entorno de despliegue. Componentes reutilizables en `src/components/ui/`: `Chip`, `WindowFrame`, `Stat`,
> `IconBox`, los íconos de marca y la superficie de tarjeta `cardSurface`. El detalle de proyecto es un modal sobre
> `/proyectos`, como en el prototipo de Penpot; el contenido de los cuatro detalles sale del perfil profesional y solo
> el portal de cotización tiene ilustración en el detalle. Falta el PDF del CV (`public/cv-jesus-matute.pdf`). El retrato de Sobre mí es el placeholder de Penpot
> hasta tener la foto.

## 1. Propósito

1. **Conseguir contactos de calidad.** Reclutadores y clientes técnicos que escriben, descargan el CV o revisan un
   caso de estudio.
2. **Medir qué les interesa.** Dónde hacen clic, hasta qué sección llegan, qué casos abren y desde dónde llegan.
3. **Perfeccionarlo con datos.** Cada cambio de diseño o contenido parte de una hipótesis basada en esas métricas y se
   conserva solo si la mejora.

No es un sitio terminado: es un experimento continuo.

## 2. Usuarios

| Usuario                      | Qué busca                                              | Acción que buscamos                   |
| ---------------------------- | ------------------------------------------------------ | ------------------------------------- |
| Reclutador                   | Perfil rápido, experiencia, CV, LinkedIn               | Descargar CV, contactar               |
| Hiring manager técnico       | Casos de estudio, stack, arquitectura, código          | Ver caso, "Hablemos de este proyecto" |
| Cliente (proyecto freelance) | Resultados en su industria (fintech, banca, logística) | Contactar                             |

## 3. Métricas

| Objetivo                 | Métrica                                                          | Fuente                           |
| ------------------------ | ---------------------------------------------------------------- | -------------------------------- |
| Que me encuentren        | Impresiones, CTR y posición en búsquedas de nombre + rol         | Search Console                   |
| Que lleguen al contenido | `page_view` por ruta: embudo de `/` a `/contacto`                | GA4                              |
| Qué les interesa         | `cta_click` por `cta` × `location`, y por `project` en los casos | GA4                              |
| Conversión               | `generate_lead` (formulario) y `file_download` (CV)              | GA4, eventos clave               |
| Fricción                 | Dead clicks, rage clicks, mapas de scroll, grabaciones           | Microsoft Clarity                |
| Velocidad                | LCP, INP y CLS de usuarios reales                                | Search Console (Core Web Vitals) |

El catálogo de eventos está en `docs/skills/seo-ux/SKILL.md` (sección 4). Cómo configurar las herramientas y leer los
datos: `docs/skills/seo-ux/references/medicion.md`.

## 4. Arquitectura

### Stack

| Pieza      | Elección                                                             | Motivo                                                 |
| ---------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| Framework  | Next.js 16 (App Router)                                              | Server Components, Server Actions, metadata            |
| Render     | SSG con el modelo de caché anterior (sin `cacheComponents`)          | HTML prerenderizado: SEO y Core Web Vitals             |
| UI         | React 19, TypeScript, Tailwind v4, shadcn/ui (Base UI), lucide-react | Componentes accesibles y tokens de diseño              |
| Movimiento | GSAP + `@gsap/react`                                                 | Spec de motion de Penpot, con `prefers-reduced-motion` |
| Medición   | GA4 (`@next/third-parties`) + Microsoft Clarity                      | Eventos de negocio + comportamiento                    |
| Diseño     | Penpot (team Me → proyecto portfolio)                                | Fuente de verdad visual                                |

### Capas

Clean Architecture: las dependencias apuntan hacia adentro. Las reglas completas están en
`docs/skills/clean-architecture`.

```
app/                         borde: rutas, layouts, metadata, Server Actions
  components/ hooks/ lib/    UI: secciones del diseño, CTAs, analítica, animación
  infrastructure/            adaptadores: contenido, webhook de contacto, env, container
    core/application/        casos de uso + puertos
      core/domain/           entidades y reglas puras
src/content/                 datos del portfolio: perfil, proyectos, experiencia, stack
```

### Rutas

```
/                    01 · Inicio
/sobre-mi            02 · Sobre mí
/stack               03 · Stack
/proyectos           04 · Proyectos
/experiencia         05 · Experiencia
/contacto            06 · Contacto ("Mensaje enviado" es un estado del formulario)
/sitemap.xml         las 6 rutas
/robots.txt
```

### Flujos

**Contenido → HTML (en build).** `src/content/*.json` → adaptador → `container` → `page.tsx` → componentes → HTML
estático.

**Medición (en el navegador).**

```
CTA con data-cta ── clic ─► CtaTracker ─┐
Formulario ── enviado ──────────────────┴─► track() ─► GA4 (cta_click, generate_lead)
                                                     └► Clarity (eventos para filtrar grabaciones)
Cada ruta ── carga ─► GA4 page_view (medición mejorada): embudo del recorrido
```

**Contacto.** Formulario (`useActionState`) → `sendContactAction` → `sendContactMessage` (el dominio valida) →
puerto `MessageSender` → webhook.

### Configuración y despliegue

- Necesita un runtime de Node (no `output: 'export'`): lo usan las Server Actions del contacto y la optimización de
  imágenes.
- `pnpm build` solo puede mostrar rutas `○ (Static)` o `● (SSG)`. El root layout tiene `dynamic = 'error'`.
- Variables de entorno:

| Variable              | Uso                                    | Cuándo                       |
| --------------------- | -------------------------------------- | ---------------------------- |
| `CONTACT_WEBHOOK_URL` | Destino de los mensajes del formulario | Siempre que se quiera enviar |
| `GA_MEASUREMENT_ID`   | GA4                                    | Solo producción              |
| `CLARITY_PROJECT_ID`  | Microsoft Clarity                      | Solo producción              |

- GA4 y Clarity usan cookies: con tráfico del EEE o el Reino Unido, se cargan solo después del consentimiento.

## 5. Ciclo de mejora

```
medir (2–4 semanas) → detectar dónde caen los clics o el abandono → hipótesis → un cambio → deploy con fecha → medir
```

- Revisión cada dos semanas: Search Console (consultas y CTR), GA4 (`cta_click`, `page_view` por ruta, eventos clave) y
  Clarity (grabaciones de sesiones con `generate_lead` y de sesiones que abandonan).
- Un cambio a la vez, con su fecha, para poder atribuir el resultado.
- Si la métrica no mejora, se revierte.

### Hipótesis iniciales

Brechas entre el diseño y lo que muestran los estudios de clics (análisis en `docs/skills/seo-ux/SKILL.md`, sección
2). Son las primeras candidatas a medir:

1. LinkedIn y GitHub en "Sobre mí" (hoy solo están en Contacto) → más clics a LinkedIn de reclutadores.
2. Nombre completo visible en el hero (hoy solo aparece el logo `jesus.matute`) → más impresiones en búsquedas por
   nombre.
3. "Ver demo" y "Ver código" en los casos públicos → más clics de perfiles técnicos.

### Registro de experimentos

Una fila por cambio publicado.

| Fecha | Hipótesis | Cambio | Métrica | Resultado |
| ----- | --------- | ------ | ------- | --------- |

## 6. Referencias

- `docs/skills/clean-architecture`: capas, imports permitidos y ejemplos.
- `docs/skills/seo-ux`: CTAs, SEO técnico, SSG y medición.
- Penpot (team Me → proyecto portfolio): pantallas 00–07, overlay de detalle de proyecto y spec de motion.
