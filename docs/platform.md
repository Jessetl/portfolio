# Platform

Portfolio de Jesús Matute (Full-Stack Developer) construido como un producto medible: cada sección y cada CTA existen
para llevar a un reclutador o cliente a una acción, y los datos de uso deciden cómo evoluciona el sitio.

> **Estado (2026-10-16), rama `v2`:** rediseño v2 de Penpot (página _Rediseño v2_) en una sola página con anclas:
> hero, Sobre mí, Stack, Proyectos (escaparate fijo como el de la referencia: texto a la izquierda y captura a sangre
> con barrido ligado al scroll; en mobile o con movimiento reducido, tarjetas apiladas), Experiencia, Contacto (con "Mensaje enviado" como estado) y footer.
> Detrás de todo hay un fondo animado en canvas que reacciona al puntero, y los CTA principales son magnéticos (tabla
> "Fondo animado y puntero" del spec de motion). Intro, menú móvil, 404 y error siguen sus boards v2. Las rutas de v1 redirigen (308) a su ancla. Las capturas de
> los proyectos están en `public/projects/`. El formulario envía con una Server Action por Resend, con campo trampa y Cloudflare Turnstile invisible
> contra spam: configura sus variables (tabla de despliegue). El CV se descarga desde `public/cv-jesus-matute.pdf` y el
> ícono `</JM>` (`src/app/icon.png` y `apple-icon.png`) sale de Penpot. SEO técnico con el dominio `jmatute-dev.com`
> (`siteUrl` del perfil): canonical, `sitemap.xml` (solo `/`), `robots.txt` y JSON-LD `Person` en el inicio.

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
| Que lleguen al contenido | `section_view` por sección: embudo del scroll, del hero a Contacto | GA4                              |
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
  infrastructure/            adaptadores: contenido, Resend, Turnstile, env, container
    core/application/        casos de uso + puertos
      core/domain/           entidades y reglas puras
src/content/                 datos del portfolio: perfil, proyectos, experiencia, stack
```

### Rutas

```
/                    una sola página: #inicio, #sobre-mi, #stack, #proyectos, #experiencia y #contacto
/sobre-mi …          rutas de v1 (/sobre-mi, /stack, /proyectos, /experiencia, /contacto): 308 a su ancla
/sitemap.xml         solo /
/robots.txt
```

### Flujos

**Contenido → HTML (en build).** `src/content/*.json` → adaptador → `container` → `page.tsx` → componentes → HTML
estático.

**Medición (en el navegador).**

```
CTA con data-cta ── clic ─► CtaTracker ─┐
Sección (data-section) ── cruza la mitad ─► SectionViews ─┤
Formulario ── enviado ──────────────────┴─► track() ─► GA4 (cta_click, section_view, generate_lead)
                                                     └► Clarity (eventos para filtrar grabaciones)
```

**Contacto.** Formulario (`useActionState`) → `sendContactAction` → `sendContactMessage` (el dominio valida) →
puerto `HumanVerifier` (Turnstile) → puerto `MessageSender` (Resend). El campo trampa y el captcha frenan el spam antes
de enviar; a Resend solo llega un mensaje válido.

### Configuración y despliegue

- Necesita un runtime de Node (no `output: 'export'`): lo usan las Server Actions del contacto y la optimización de
  imágenes.
- `pnpm build` solo puede mostrar rutas `○ (Static)` o `● (SSG)`. El root layout tiene `dynamic = 'error'`.
- Variables de entorno:

| Variable               | Uso                                                                 | Cuándo                       |
| ---------------------- | ------------------------------------------------------------------- | ---------------------------- |
| `RESEND_API_KEY`       | Envío de los mensajes del formulario                                | Siempre que se quiera enviar |
| `CONTACT_TO_EMAIL`     | Dónde llegan; con el remitente de prueba, el email de tu cuenta     | Siempre que se quiera enviar |
| `CONTACT_FROM_EMAIL`   | Remitente; por defecto `Portfolio <onboarding@resend.dev>`          | Al verificar un dominio      |
| `TURNSTILE_SITE_KEY`   | Captcha invisible (pública; se lee en el build)                     | Siempre que se quiera enviar |
| `TURNSTILE_SECRET_KEY` | Verificación del captcha en el servidor                             | Siempre que se quiera enviar |
| `GA_MEASUREMENT_ID`    | GA4                                                                 | Solo producción              |
| `CLARITY_PROJECT_ID`   | Microsoft Clarity                                                   | Solo producción              |

- Sin banner de cookies: en el EEE, el Reino Unido y Suiza, GA4 corre en Consent Mode denegado (sin cookies) y Clarity,
  sin señal de consentimiento, tampoco usa cookies. GA4 y Clarity solo cargan si existen sus variables: defínelas
  únicamente en el entorno Production de Vercel.

## 5. Ciclo de mejora

```
medir (2–4 semanas) → detectar dónde caen los clics o el abandono → hipótesis → un cambio → deploy con fecha → medir
```

- Revisión cada dos semanas: Search Console (consultas y CTR), GA4 (`cta_click`, `section_view`, eventos clave) y
  Clarity (grabaciones de sesiones con `generate_lead` y de sesiones que abandonan).
- Un cambio a la vez, con su fecha, para poder atribuir el resultado.
- Si la métrica no mejora, se revierte.

### Hipótesis iniciales

Brechas entre el diseño y lo que muestran los estudios de clics (análisis en `docs/skills/seo-ux/SKILL.md`, sección
2). Son las primeras candidatas a medir:

1. LinkedIn y GitHub en el hero (v2; antes solo estaban en Contacto) → más clics a LinkedIn de reclutadores.
2. Nombre completo visible en el hero (v2; antes solo aparecía el logo `jesus.matute`) → más impresiones en
   búsquedas por nombre.
3. "Ver demo" y "Ver código" en los casos públicos → más clics de perfiles técnicos.

### Registro de experimentos

Una fila por cambio publicado.

| Fecha | Hipótesis | Cambio | Métrica | Resultado |
| ----- | --------- | ------ | ------- | --------- |

## 6. Referencias

- `docs/skills/clean-architecture`: capas, imports permitidos y ejemplos.
- `docs/skills/seo-ux`: CTAs, SEO técnico, SSG y medición.
- Penpot (team Me → proyecto portfolio → página _Rediseño v2_): página desktop y mobile, intro, menú, 404, error y spec de motion.
