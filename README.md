# Portfolio · Jesús Matute

Portfolio de Jesús Matute, Full-Stack Developer, publicado en [jmatute-dev.com](https://jmatute-dev.com). Se mide con
GA4 y Microsoft Clarity para mejorarlo según dónde hacen clic los reclutadores.

## Stack

- Next.js 16 (App Router, SSG con el modelo de caché anterior), React 19 y TypeScript.
- Tailwind CSS v4 y shadcn/ui sobre Base UI.
- Contacto con Resend; antispam con campo trampa y Cloudflare Turnstile.
- Analítica con GA4 y Microsoft Clarity. Hosting en Vercel.

## Desarrollo

Requiere Node 24 y pnpm.

```bash
pnpm install
cp .env.example .env.local  # completa las variables
pnpm dev
```

| Script       | Qué hace                                                              |
| ------------ | --------------------------------------------------------------------- |
| `pnpm dev`   | Servidor de desarrollo en http://localhost:3000                       |
| `pnpm build` | Build de producción: todas las rutas deben ser `○` (Static) o `●` (SSG) |
| `pnpm lint`  | ESLint, incluidas las reglas de capas de la arquitectura             |
| `pnpm test`  | Tests del dominio y de los casos de uso (`node:test`)                 |

## Diseño

Penpot es la única fuente de diseño: team _Me_ → proyecto _portfolio_ → archivo _Portolio_. Si algo visible no está en
Penpot, no se crea. Las reglas están en [`AGENTS.md`](AGENTS.md).

## Documentación

- [`AGENTS.md`](AGENTS.md): reglas para trabajar en el proyecto, incluidos los agentes.
- [`docs/platform.md`](docs/platform.md): propósito, métricas, arquitectura, despliegue y variables de entorno.
- [`docs/skills/clean-architecture`](docs/skills/clean-architecture/SKILL.md): capas y dónde va cada pieza.
- [`docs/skills/seo-ux`](docs/skills/seo-ux/SKILL.md): SEO, CTAs y medición.

## Despliegue

Vercel publica producción con cada push a `main`. Las variables van en **Settings → Environment Variables**; las de GA4
y Clarity, solo en Production. La clave del sitio de Turnstile y los IDs de analítica se leen al compilar: después de
cambiarlas, haz **Redeploy**.
