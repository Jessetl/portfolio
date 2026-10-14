# Ejemplos de referencia

Implementación de la skill sobre los ejemplos de `docs/skills/clean-architecture/references/ejemplos.md`. Los bloques
marcados como **versión extendida** reemplazan al archivo del mismo nombre de esa skill. Cada bloque indica su ruta en
`title`; todos compilan, pasan las reglas de ESLint por capas y el `next build` resultante es 100 % estático.

Estilo: arrow functions en todo. La única excepción es el snippet oficial de Clarity, que va sin modificar dentro de un
string.

> **Pendiente de actualizar (2026-10-14).** El sitio quedó con una ruta por pantalla (`src/components/site/screens.ts`),
> no con una sola página con anchors. Al aplicar estos ejemplos:
>
> - Los enlaces van a rutas (`/proyectos`, `/contacto`), no a `sectionHref(...)`.
> - `sections.ts`, `sectionAttrs` y `SectionViews` no se usan: el embudo sale del `page_view` de cada ruta.
> - El header y el footer reales están en `src/components/site/`; aquí solo cambia el `ctaAttrs` del botón `CV`.
> - El overlay de casos debe cerrarse también al ir a `/contacto`: el slot `@modal` necesita un catch-all que devuelva
>   `null`, no solo `@modal/page.tsx`.
>
> Estos ejemplos se reescriben y se vuelven a validar cuando se implementen la analítica y la pantalla de proyectos.

Contenido:

1. Configuración SSG
2. Datos del perfil
3. Marcado y medición de CTAs
4. Layout, header y metadata global
5. Inicio: CTAs, secciones y JSON-LD
6. Casos de estudio: ruta SSG + overlay interceptado
7. Sitemap y robots
8. Lead del formulario

## 1. Configuración SSG

```ts title="next.config.ts"
import type { NextConfig } from 'next';

// SSG con el modelo de caché anterior de Next 16: sin cacheComponents ni
// partialPrefetching (esta requiere la primera).
const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
```

## 2. Datos del perfil

Nombre, rol, URL y enlaces alimentan la metadata, el JSON-LD, el header y el sitemap. Son contenido: viven en
`src/content/` y llegan por el container. Reemplaza `siteUrl` y `email` por los reales.

```json title="src/content/profile.json"
{
  "name": "Jesús Matute",
  "role": "Full-Stack Developer",
  "headline": "Construyo productos fintech de punta a punta.",
  "summary": "De la interfaz a la API: React y Next.js en el cliente; Node.js, NestJS y Laravel en el servidor. 7 años creando plataformas para banca, cripto, crédito y logística.",
  "siteUrl": "https://tu-dominio.com",
  "location": { "city": "Cagua", "country": "VE" },
  "links": {
    "email": "hola@tu-dominio.com",
    "linkedin": "https://www.linkedin.com/in/jesus-matute",
    "github": "https://github.com/Jessetl",
    "cv": "/cv-jesus-matute.pdf"
  }
}
```

```ts title="src/core/domain/profile/profile.ts"
export type Profile = {
  name: string;
  role: string;
  headline: string;
  summary: string;
  siteUrl: string;
  location: { city: string; country: string };
  links: { email: string; linkedin: string; github: string; cv: string };
};
```

```ts title="src/core/application/profile/ports.ts"
import type { Profile } from '@/core/domain/profile/profile';

export interface ProfileRepository {
  get: () => Promise<Profile>;
}
```

```ts title="src/infrastructure/profile/json-profile-repository.ts"
import 'server-only';

import type { ProfileRepository } from '@/core/application/profile/ports';
import raw from '@/content/profile.json';

export const jsonProfileRepository: ProfileRepository = {
  get: async () => raw,
};
```

**Versión extendida.** Los IDs de analítica son opcionales: sin valor (desarrollo, previews) no se carga ningún script.

```ts title="src/infrastructure/env.ts"
import 'server-only';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
};

export const env = {
  contactWebhookUrl: () => required('CONTACT_WEBHOOK_URL'),
  gaMeasurementId: () => process.env.GA_MEASUREMENT_ID,
  clarityProjectId: () => process.env.CLARITY_PROJECT_ID,
};
```

**Versión extendida.**

```ts title="src/infrastructure/container.ts"
import 'server-only';

import { makeSendContactMessage } from '@/core/application/contact/send-contact-message';
import { makeListProjects } from '@/core/application/projects/list-projects';
import { webhookMessageSender } from '@/infrastructure/contact/webhook-message-sender';
import { env } from '@/infrastructure/env';
import { jsonProfileRepository } from '@/infrastructure/profile/json-profile-repository';
import { jsonProjectRepository } from '@/infrastructure/projects/json-project-repository';

export const getProfile = jsonProfileRepository.get;
export const listProjects = makeListProjects({
  projects: jsonProjectRepository,
});
export const getProject = jsonProjectRepository.findBySlug;
export const sendContactMessage = makeSendContactMessage({
  sender: webhookMessageSender,
});
export const getAnalyticsIds = () => ({
  ga: env.gaMeasurementId(),
  clarity: env.clarityProjectId(),
});
```

## 3. Marcado y medición de CTAs

Las secciones del inicio en un solo lugar: anchors, navegación y `section_view` usan los mismos nombres.

```ts title="src/components/site/sections.ts"
export const sections = {
  home: { id: 'inicio', label: 'Inicio' },
  about: { id: 'sobre-mi', label: 'Sobre mí' },
  stack: { id: 'stack', label: 'Stack' },
  projects: { id: 'proyectos', label: 'Proyectos' },
  experience: { id: 'experiencia', label: 'Experiencia' },
  contact: { id: 'contacto', label: 'Contacto' },
} as const;

export type Section = keyof typeof sections;

export const sectionHref = (section: Section) => `/#${sections[section].id}`;

/** `id` para el anchor y `data-section` para el evento `section_view`. */
export const sectionAttrs = (section: Section) => ({
  id: sections[section].id,
  'data-section': section,
});
```

El catálogo cerrado de CTAs. `ctaAttrs` devuelve atributos `data-*`, así que sirve en Server Components sin agregar
JavaScript.

```ts title="src/components/analytics/cta.ts"
export type Cta =
  | 'projects'
  | 'contact'
  | 'case_study'
  | 'cv'
  | 'email'
  | 'linkedin'
  | 'github';

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'about'
  | 'projects'
  | 'project_detail'
  | 'experience'
  | 'contact'
  | 'sent';

export const ctaAttrs = (
  cta: Cta,
  location: CtaLocation,
  project?: string,
) => ({
  'data-cta': cta,
  'data-cta-location': location,
  ...(project ? { 'data-cta-project': project } : {}),
});
```

`track` es el único punto que conoce GA4 y Clarity.

```ts title="src/components/analytics/track.ts"
import { sendGAEvent } from '@next/third-parties/google';

import type { Section } from '@/components/site/sections';

import type { Cta, CtaLocation } from './cta';

export type AnalyticsEvent =
  | {
      name: 'cta_click';
      params: { cta: Cta; location: CtaLocation; project?: string };
    }
  | { name: 'section_view'; params: { section: Section } }
  | { name: 'generate_lead'; params: { form: 'contact' } };

type Clarity = (command: 'event', name: string) => void;

/** Envía el evento a GA4 y lo marca en Clarity para filtrar grabaciones. */
export const track = ({ name, params }: AnalyticsEvent) => {
  sendGAEvent('event', name, params);
  const { clarity } = window as Window & { clarity?: Clarity };
  clarity?.('event', name);
};
```

`CtaTracker` va en el root layout: un único listener de clics, por delegación, para todos los CTAs del sitio.

```tsx title="src/components/analytics/cta-tracker.tsx"
'use client';

import { useEffect } from 'react';

import type { Cta, CtaLocation } from './cta';
import { track } from './track';

export const CtaTracker = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>('[data-cta]');
      if (!element) return;
      const { cta, ctaLocation, ctaProject } = element.dataset;
      track({
        name: 'cta_click',
        params: {
          cta: cta as Cta,
          location: ctaLocation as CtaLocation,
          ...(ctaProject ? { project: ctaProject } : {}),
        },
      });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () =>
      document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
};
```

`SectionViews` va en la página que tiene secciones (el inicio), no en el layout. Se monta una vez por vista: abrir el
overlay de un caso encima no vuelve a contar las secciones que siguen montadas debajo.

```tsx title="src/components/analytics/section-views.tsx"
'use client';

import { useEffect } from 'react';

import type { Section } from '@/components/site/sections';

import { track } from './track';

export const SectionViews = () => {
  useEffect(() => {
    // Franja en el centro del viewport: cuenta también secciones más altas
    // que la pantalla.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          const { section } = (entry.target as HTMLElement).dataset;
          track({
            name: 'section_view',
            params: { section: section as Section },
          });
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );

    document
      .querySelectorAll('[data-section]')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return null;
};
```

Los scripts: GA4 se carga después de la hidratación (`@next/third-parties`) y Clarity en tiempo ocioso
(`lazyOnload`).

```tsx title="src/components/analytics/analytics-scripts.tsx"
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

// Snippet oficial de Microsoft Clarity, sin modificar.
const clarityLoader = (projectId: string) => `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId)});`;

export const AnalyticsScripts = ({
  gaId,
  clarityId,
}: {
  gaId?: string;
  clarityId?: string;
}) => (
  <>
    {gaId && <GoogleAnalytics gaId={gaId} />}
    {clarityId && (
      <Script id='ms-clarity' strategy='lazyOnload'>
        {clarityLoader(clarityId)}
      </Script>
    )}
  </>
);
```

## 4. Layout, header y metadata global

El layout define `metadataBase`, el template de títulos y el Open Graph base; **no** define canonical (va en cada
página). `dynamic = 'error'` hace que el build falle si una ruta deja de ser estática. `modal` es el slot del
overlay de casos (sección 6).

```tsx title="src/app/layout.tsx"
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import { CtaTracker } from '@/components/analytics/cta-tracker';
import { SiteHeader } from '@/components/site/site-header';
import { getAnalyticsIds, getProfile } from '@/infrastructure/container';

import './globals.css';

export const dynamic = 'error';

export const generateMetadata = async (): Promise<Metadata> => {
  const profile = await getProfile();
  return {
    metadataBase: new URL(profile.siteUrl),
    title: {
      default: `${profile.name} · ${profile.role}`,
      template: `%s · ${profile.name}`,
    },
    description: profile.summary,
    openGraph: { type: 'website', locale: 'es_VE', siteName: profile.name },
    twitter: { card: 'summary_large_image' },
  };
};

// Las fuentes (next/font: Fraunces, IBM Plex Sans, JetBrains Mono) van como
// variables CSS en <html>.
const RootLayout = async ({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) => {
  const profile = await getProfile();
  const { ga, clarity } = getAnalyticsIds();

  return (
    <html lang='es'>
      <body>
        <SiteHeader name={profile.name} cvHref={profile.links.cv} />
        {children}
        {modal}
        <CtaTracker />
      </body>
      <AnalyticsScripts gaId={ga} clarityId={clarity} />
    </html>
  );
};

export default RootLayout;
```

El header aparece en todas las pantallas del diseño: es el lugar del CTA `CV`. El logo `</JM>` es decorativo para
lectores de pantalla; el enlace se anuncia con el nombre.

```tsx title="src/components/site/site-header.tsx"
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import {
  sectionHref,
  sections,
  type Section,
} from '@/components/site/sections';
import { buttonVariants } from '@/components/ui/button';

export const SiteHeader = ({
  name,
  cvHref,
}: {
  name: string;
  cvHref: string;
}) => (
  <header className='sticky top-0 z-40 flex items-center justify-between gap-6 bg-background/80 px-6 py-4 backdrop-blur'>
    <Link href='/' className='font-mono font-semibold'>
      <span aria-hidden>{'</JM>'}</span>
      <span className='sr-only'>{name}, inicio</span>
    </Link>
    <nav aria-label='Secciones'>
      <ul className='flex gap-4'>
        {(Object.keys(sections) as Section[]).map((section) => (
          <li key={section}>
            <Link href={sectionHref(section)}>{sections[section].label}</Link>
          </li>
        ))}
      </ul>
    </nav>
    <a
      href={cvHref}
      download
      className={buttonVariants({ variant: 'outline' })}
      {...ctaAttrs('cv', 'header')}
    >
      CV<span className='sr-only'> (descargar PDF)</span>
    </a>
  </header>
);
```

## 5. Inicio: CTAs, secciones y JSON-LD

**Versión extendida.** Canonical propia, JSON-LD `Person` con `<` escapado y el nombre completo en texto visible. Sobre
mí, Stack y Experiencia siguen el mismo patrón de `sectionAttrs`.

```tsx title="src/app/page.tsx"
import type { Metadata } from 'next';

import { SectionViews } from '@/components/analytics/section-views';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactLinks } from '@/components/contact/contact-links';
import { HeroActions } from '@/components/profile/hero-actions';
import { ProjectsSection } from '@/components/projects/projects-section';
import { sectionAttrs } from '@/components/site/sections';
import { getProfile, listProjects } from '@/infrastructure/container';

import { sendContactAction } from './actions';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const Page = async () => {
  const [profile, projects] = await Promise.all([getProfile(), listProjects()]);

  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: profile.siteUrl,
    sameAs: [profile.links.linkedin, profile.links.github],
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location.city,
      addressCountry: profile.location.country,
    },
  };

  return (
    <main>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, '\\u003c'),
        }}
      />
      <section {...sectionAttrs('home')} aria-labelledby='hero-title'>
        <p className='font-mono text-sm'>
          {profile.name} · {profile.role}
        </p>
        <h1 id='hero-title' className='font-heading text-5xl'>
          {profile.headline}
        </h1>
        <p>{profile.summary}</p>
        <HeroActions />
      </section>
      <ProjectsSection projects={projects} />
      <section {...sectionAttrs('contact')} aria-labelledby='contact-title'>
        <h2 id='contact-title' className='font-heading text-3xl'>
          ¿Construimos algo juntos?
        </h2>
        <ContactLinks links={profile.links} />
        <ContactForm action={sendContactAction} />
      </section>
      <SectionViews />
    </main>
  );
};

export default Page;
```

Un primario por vista: `Ver proyectos`. `Hablemos` es secundario.

```tsx title="src/components/profile/hero-actions.tsx"
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import { sectionHref } from '@/components/site/sections';
import { buttonVariants } from '@/components/ui/button';

export const HeroActions = () => (
  <div className='flex flex-wrap gap-3'>
    <Link
      href={sectionHref('projects')}
      className={buttonVariants({ size: 'lg' })}
      {...ctaAttrs('projects', 'hero')}
    >
      Ver proyectos
    </Link>
    <Link
      href={sectionHref('contact')}
      className={buttonVariants({ variant: 'secondary', size: 'lg' })}
      {...ctaAttrs('contact', 'hero')}
    >
      Hablemos
    </Link>
  </div>
);
```

Enlaces de contacto: los externos abren en pestaña nueva y lo anuncian.

```tsx title="src/components/contact/contact-links.tsx"
import { ctaAttrs } from '@/components/analytics/cta';
import type { Profile } from '@/core/domain/profile/profile';

const newTab = { target: '_blank', rel: 'noopener noreferrer' } as const;

export const ContactLinks = ({ links }: { links: Profile['links'] }) => (
  <ul className='grid gap-3'>
    <li>
      <a href={`mailto:${links.email}`} {...ctaAttrs('email', 'contact')}>
        {links.email}
      </a>
    </li>
    <li>
      <a href={links.linkedin} {...newTab} {...ctaAttrs('linkedin', 'contact')}>
        LinkedIn<span className='sr-only'> (abre en una pestaña nueva)</span>
      </a>
    </li>
    <li>
      <a href={links.github} {...newTab} {...ctaAttrs('github', 'contact')}>
        GitHub<span className='sr-only'> (abre en una pestaña nueva)</span>
      </a>
    </li>
  </ul>
);
```

**Versión extendida.** Toda la tarjeta es clicable: el `::after` del enlace (el título) cubre la tarjeta y
"Ver caso →" es decorativo. El foco se ve en la tarjeta entera.

```tsx title="src/components/projects/projects-section.tsx"
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import { Reveal } from '@/components/motion/reveal';
import { sectionAttrs } from '@/components/site/sections';
import type { Project } from '@/core/domain/projects/project';

export const ProjectsSection = ({ projects }: { projects: Project[] }) => (
  <section {...sectionAttrs('projects')} aria-labelledby='projects-title'>
    <h2 id='projects-title' className='font-heading text-3xl'>
      Proyectos
    </h2>
    <Reveal className='grid gap-6 md:grid-cols-2'>
      {projects.map((project) => (
        <article
          key={project.slug}
          className='relative rounded-lg border p-6 transition duration-200 ease-out focus-within:ring-2 focus-within:ring-ring hover:-translate-y-1 hover:border-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        >
          <h3 className='font-heading text-xl'>
            <Link
              href={`/proyectos/${project.slug}`}
              className='after:absolute after:inset-0 focus-visible:outline-none'
              {...ctaAttrs('case_study', 'projects', project.slug)}
            >
              {project.title}
            </Link>
          </h3>
          <p className='text-muted-foreground'>{project.summary}</p>
          <span aria-hidden className='mt-4 inline-block font-mono text-sm'>
            Ver caso →
          </span>
        </article>
      ))}
    </Reveal>
  </section>
);
```

## 6. Casos de estudio: ruta SSG + overlay interceptado

Cada caso tiene URL propia prerenderizada (indexable y compartible). Al navegar desde la grilla, la ruta interceptada
`@modal/(.)proyectos/[slug]` lo muestra como el overlay del diseño. Si se entra directo o se recarga, se ve la página
completa.

```
src/app/
├── layout.tsx                       # recibe el slot `modal`
├── proyectos/[slug]/page.tsx        # página completa (SSG)
└── @modal/
    ├── default.tsx                  # null: carga directa o recarga
    ├── page.tsx                     # null: cierra el overlay al volver a "/"
    └── (.)proyectos/[slug]/page.tsx # overlay al navegar desde la grilla
```

El contenido del caso, compartido por la página y el overlay:

```tsx title="src/components/projects/project-case.tsx"
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import { sectionHref } from '@/components/site/sections';
import { buttonVariants } from '@/components/ui/button';
import type { Project } from '@/core/domain/projects/project';

export const ProjectCase = ({ project }: { project: Project }) => (
  <article className='grid gap-6'>
    <header>
      <p className='font-mono text-sm text-muted-foreground'>
        {project.year} · {project.tags.join(' · ')}
      </p>
      <h1 className='font-heading text-3xl'>{project.title}</h1>
    </header>
    <p>{project.summary}</p>
    <Link
      href={sectionHref('contact')}
      className={buttonVariants({ size: 'lg' })}
      {...ctaAttrs('contact', 'project_detail', project.slug)}
    >
      Hablemos de este proyecto
    </Link>
  </article>
);
```

```tsx title="src/app/proyectos/[slug]/page.tsx"
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProjectCase } from '@/components/projects/project-case';
import { getProject, listProjects } from '@/infrastructure/container';

type Props = { params: Promise<{ slug: string }> };

// Solo existen los slugs del contenido: el resto es 404, nunca render en runtime.
export const dynamicParams = false;

export const generateStaticParams = async () =>
  (await listProjects()).map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const project = await getProject((await params).slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.slug}` },
    openGraph: {
      type: 'article',
      title: project.title,
      description: project.summary,
      url: `/proyectos/${project.slug}`,
    },
  };
};

const ProjectPage = async ({ params }: Props) => {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  return (
    <main className='mx-auto max-w-3xl px-6 py-16'>
      <ProjectCase project={project} />
    </main>
  );
};

export default ProjectPage;
```

El overlay usa `<dialog>` nativo: foco atrapado y Esc gratis. Esc, clic fuera o "Cerrar" vuelven atrás en el
historial.

```tsx title="src/components/projects/project-overlay.tsx"
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

export const ProjectOverlay = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onClose={() => router.back()}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      className='m-0 ml-auto h-dvh max-h-none w-full max-w-xl bg-background p-0 backdrop:bg-black/60'
    >
      <div className='grid h-full content-start gap-6 overflow-y-auto p-8'>
        <form method='dialog'>
          <button type='submit' className='font-mono text-sm'>
            Cerrar
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
};
```

```tsx title="src/app/@modal/(.)proyectos/[slug]/page.tsx"
import { notFound } from 'next/navigation';

import { ProjectCase } from '@/components/projects/project-case';
import { ProjectOverlay } from '@/components/projects/project-overlay';
import { getProject, listProjects } from '@/infrastructure/container';

export const dynamicParams = false;

export const generateStaticParams = async () =>
  (await listProjects()).map(({ slug }) => ({ slug }));

const ProjectModal = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  return (
    <ProjectOverlay title={project.title}>
      <ProjectCase project={project} />
    </ProjectOverlay>
  );
};

export default ProjectModal;
```

```tsx title="src/app/@modal/default.tsx"
const Default = () => null;

export default Default;
```

```tsx title="src/app/@modal/page.tsx"
// Al navegar a "/" (p. ej. "Hablemos de este proyecto"), el slot coincide con
// esta página y el overlay se cierra.
const ModalClosed = () => null;

export default ModalClosed;
```

## 7. Sitemap y robots

Google ignora `priority` y `changeFrequency`: solo URLs (y `lastModified` si fuera real).

```ts title="src/app/sitemap.ts"
import type { MetadataRoute } from 'next';

import { getProfile, listProjects } from '@/infrastructure/container';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [{ siteUrl }, projects] = await Promise.all([
    getProfile(),
    listProjects(),
  ]);

  return [
    { url: siteUrl },
    ...projects.map(({ slug }) => ({ url: `${siteUrl}/proyectos/${slug}` })),
  ];
};

export default sitemap;
```

```ts title="src/app/robots.ts"
import type { MetadataRoute } from 'next';

import { getProfile } from '@/infrastructure/container';

const robots = async (): Promise<MetadataRoute.Robots> => {
  const { siteUrl } = await getProfile();
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
};

export default robots;
```

## 8. Lead del formulario

En `src/components/contact/contact-form.tsx` (de clean-architecture), después de `useActionState`. Solo el tipo de
formulario: nunca el nombre ni el email.

```tsx
import { useActionState, useEffect } from 'react';

import { track } from '@/components/analytics/track';

// …dentro de ContactForm, después de useActionState:
useEffect(() => {
  if (state.status === 'sent')
    track({ name: 'generate_lead', params: { form: 'contact' } });
}, [state.status]);
```
