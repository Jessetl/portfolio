# Ejemplos de referencia

Dos flujos completos del portfolio: lectura (proyectos) y escritura (formulario de contacto), más el wrapper de
animación. Cada bloque indica su ruta en `title`. Todos compilan con el `tsconfig.json` del proyecto y pasan las reglas
de `eslint-capas.md`.

Estilo: todo con arrow functions (funciones, componentes, fábricas de casos de uso, métodos de adaptadores y firmas de
los puertos).

Contenido:

1. Lectura: proyectos
2. Escritura: contacto
3. Composition root y página
4. Movimiento: wrapper de cliente con GSAP
5. Probar sin framework

## 1. Lectura: proyectos

El contenido es un dato; solo lo lee la infraestructura.

```json title="src/content/projects.json"
[
  {
    "slug": "portfolio",
    "title": "Portfolio",
    "summary": "Sitio personal con Next.js 16 y animaciones con GSAP.",
    "tags": ["Next.js", "TypeScript", "GSAP"],
    "year": 2026,
    "featured": true
  }
]
```

Dominio: tipo plano y una regla pura.

```ts title="src/core/domain/projects/project.ts"
export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  year: number;
  featured: boolean;
};

/** Orden de exhibición: destacados primero, después los más recientes. */
export const sortForShowcase = (projects: readonly Project[]): Project[] =>
  [...projects].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.year - a.year,
  );
```

Aplicación: el puerto describe lo que se necesita, no cómo se obtiene.

```ts title="src/core/application/projects/ports.ts"
import type { Project } from '@/core/domain/projects/project';

export interface ProjectRepository {
  list: () => Promise<Project[]>;
  findBySlug: (slug: string) => Promise<Project | null>;
}
```

```ts title="src/core/application/projects/list-projects.ts"
import { sortForShowcase } from '@/core/domain/projects/project';
import type { ProjectRepository } from './ports';

export const makeListProjects =
  ({ projects }: { projects: ProjectRepository }) =>
  async () =>
    sortForShowcase(await projects.list());
```

Infraestructura: implementa el puerto y traduce el formato del archivo al dominio. Si mañana el contenido viene de un
CMS, solo cambia este archivo.

```ts title="src/infrastructure/projects/json-project-repository.ts"
import 'server-only';

import type { ProjectRepository } from '@/core/application/projects/ports';
import type { Project } from '@/core/domain/projects/project';
import raw from '@/content/projects.json';

type RawProject = (typeof raw)[number];

const toProject = (item: RawProject): Project => ({
  slug: item.slug,
  title: item.title,
  summary: item.summary,
  tags: item.tags,
  year: item.year,
  featured: item.featured,
});

export const jsonProjectRepository: ProjectRepository = {
  list: async () => raw.map(toProject),
  findBySlug: async (slug) => {
    const item = raw.find((project) => project.slug === slug);
    return item ? toProject(item) : null;
  },
};
```

Presentación: Server Component que solo recibe y muestra. El hover sigue la spec de Penpot (−4 px y borde de
acento, 200 ms) y se desactiva con movimiento reducido.

```tsx title="src/components/projects/projects-section.tsx"
import { Reveal } from '@/components/motion/reveal';
import type { Project } from '@/core/domain/projects/project';

export const ProjectsSection = ({ projects }: { projects: Project[] }) => (
  <section aria-labelledby='projects-title'>
    <h2 id='projects-title' className='font-heading text-3xl'>
      Proyectos
    </h2>
    <Reveal className='grid gap-6 md:grid-cols-2'>
      {projects.map((project) => (
        <article
          key={project.slug}
          className='rounded-lg border p-6 transition duration-200 ease-out hover:-translate-y-1 hover:border-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        >
          <h3 className='font-heading text-xl'>{project.title}</h3>
          <p className='text-muted-foreground'>{project.summary}</p>
        </article>
      ))}
    </Reveal>
  </section>
);
```

## 2. Escritura: contacto

Dominio: la validación real vive aquí y devuelve códigos, no textos.

```ts title="src/core/domain/contact/contact-message.ts"
export type ContactMessage = {
  name: string;
  email: string;
  body: string;
};

export type ContactMessageError =
  | 'invalid-name'
  | 'invalid-email'
  | 'invalid-body';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createContactMessage = (
  input: ContactMessage,
):
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactMessageError[] } => {
  const name = input.name.trim();
  const email = input.email.trim();
  const body = input.body.trim();

  const errors: ContactMessageError[] = [];
  if (name.length === 0 || name.length > 100) errors.push('invalid-name');
  if (email.length > 254 || !EMAIL.test(email)) errors.push('invalid-email');
  if (body.length < 10 || body.length > 5000) errors.push('invalid-body');

  return errors.length > 0
    ? { ok: false, errors }
    : { ok: true, value: { name, email, body } };
};
```

Aplicación: el caso de uso valida y delega el envío al puerto. Un fallo del envío es inesperado: se lanza y lo
captura el borde.

```ts title="src/core/application/contact/ports.ts"
import type { ContactMessage } from '@/core/domain/contact/contact-message';

export interface MessageSender {
  send: (message: ContactMessage) => Promise<void>;
}
```

```ts title="src/core/application/contact/send-contact-message.ts"
import {
  createContactMessage,
  type ContactMessage,
  type ContactMessageError,
} from '@/core/domain/contact/contact-message';
import type { MessageSender } from './ports';

export type SendContactMessageResult =
  | { ok: true }
  | { ok: false; errors: ContactMessageError[] };

export const makeSendContactMessage =
  ({ sender }: { sender: MessageSender }) =>
  async (input: ContactMessage): Promise<SendContactMessageResult> => {
    const message = createContactMessage(input);
    if (!message.ok) return message;

    await sender.send(message.value);
    return { ok: true };
  };
```

Infraestructura: `env.ts` es el único lector de `process.env`. Se expone como funciones para leer en tiempo de
ejecución y que el build no falle si falta una variable.

```ts title="src/infrastructure/env.ts"
import 'server-only';

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
};

export const env = {
  contactWebhookUrl: () => required('CONTACT_WEBHOOK_URL'),
};
```

```ts title="src/infrastructure/contact/webhook-message-sender.ts"
import 'server-only';

import type { MessageSender } from '@/core/application/contact/ports';
import { env } from '@/infrastructure/env';

export const webhookMessageSender: MessageSender = {
  send: async (message) => {
    const response = await fetch(env.contactWebhookUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });
    if (!response.ok)
      throw new Error(`El webhook de contacto respondió ${response.status}`);
  },
};
```

Presentación: el formulario es la hoja `'use client'`. Recibe la Server Action por prop (no la importa), define su
propio estado de UI y traduce los códigos del dominio a textos.

```tsx title="src/components/contact/contact-form.tsx"
'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import type { ContactMessageError } from '@/core/domain/contact/contact-message';

export type ContactFormState =
  | { status: 'idle' | 'sent' | 'error' }
  | { status: 'invalid'; errors: ContactMessageError[] };

const errorText: Record<ContactMessageError, string> = {
  'invalid-name': 'Escribe tu nombre (máximo 100 caracteres).',
  'invalid-email': 'Revisa tu email.',
  'invalid-body': 'El mensaje debe tener entre 10 y 5000 caracteres.',
};

export const ContactForm = ({
  action,
}: {
  action: (
    state: ContactFormState,
    formData: FormData,
  ) => Promise<ContactFormState>;
}) => {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  });

  if (state.status === 'sent') return <p role='status'>¡Mensaje enviado!</p>;

  return (
    <form action={formAction} className='grid gap-4'>
      <label className='grid gap-1'>
        Nombre
        <input name='name' required maxLength={100} />
      </label>
      <label className='grid gap-1'>
        Email
        <input name='email' type='email' required />
      </label>
      <label className='grid gap-1'>
        Mensaje
        <textarea name='body' required minLength={10} maxLength={5000} />
      </label>

      {state.status === 'invalid' && (
        <ul role='alert'>
          {state.errors.map((error) => (
            <li key={error}>{errorText[error]}</li>
          ))}
        </ul>
      )}
      {state.status === 'error' && (
        <p role='alert'>No se pudo enviar. Intenta de nuevo.</p>
      )}

      <Button type='submit' disabled={pending}>
        {pending ? 'Enviando…' : 'Enviar'}
      </Button>
    </form>
  );
};
```

`app/`: la Server Action es un controlador delgado. Lee `FormData` sin confiar en ella, llama al caso de uso y traduce
el resultado. No devuelve datos internos. En un archivo `'use server'`, cada export debe ser una función async; una
arrow `async` cumple.

```ts title="src/app/actions.ts"
'use server';

import type { ContactFormState } from '@/components/contact/contact-form';
import { sendContactMessage } from '@/infrastructure/container';

export const sendContactAction = async (
  _state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };

  try {
    const result = await sendContactMessage({
      name: text('name'),
      email: text('email'),
      body: text('body'),
    });
    return result.ok
      ? { status: 'sent' }
      : { status: 'invalid', errors: result.errors };
  } catch (error) {
    console.error('sendContactAction', error);
    return { status: 'error' };
  }
};
```

## 3. Composition root y página

El único archivo que sabe qué adaptador implementa cada puerto. `getProject` es una lectura sin reglas: se expone el
repositorio directamente, sin caso de uso.

```ts title="src/infrastructure/container.ts"
import 'server-only';

import { makeSendContactMessage } from '@/core/application/contact/send-contact-message';
import { makeListProjects } from '@/core/application/projects/list-projects';
import { webhookMessageSender } from '@/infrastructure/contact/webhook-message-sender';
import { jsonProjectRepository } from '@/infrastructure/projects/json-project-repository';

export const listProjects = makeListProjects({
  projects: jsonProjectRepository,
});
export const getProject = jsonProjectRepository.findBySlug;
export const sendContactMessage = makeSendContactMessage({
  sender: webhookMessageSender,
});
```

```tsx title="src/app/page.tsx"
import { ContactForm } from '@/components/contact/contact-form';
import { ProjectsSection } from '@/components/projects/projects-section';
import { listProjects } from '@/infrastructure/container';

import { sendContactAction } from './actions';

const Page = async () => {
  const projects = await listProjects();

  return (
    <main>
      <ProjectsSection projects={projects} />
      <ContactForm action={sendContactAction} />
    </main>
  );
};

export default Page;
```

## 4. Movimiento: wrapper de cliente con GSAP

La animación se aísla en un Client Component que recibe `children`; la sección que lo usa sigue siendo Server
Component. Valores de la spec de Penpot: reveal con opacity 0→1, y 16→0, 400 ms, stagger 60 ms y `back.out(1.4)`; con
movimiento reducido, solo opacity en 150 ms.

```tsx title="src/components/motion/reveal.tsx"
'use client';

import { useRef, type ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const Reveal = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items) return;
      const scrollTrigger = { trigger: ref.current, start: 'top 85%' };

      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(items, {
          opacity: 0,
          y: 16,
          duration: 0.4,
          stagger: 0.06,
          ease: 'back.out(1.4)',
          scrollTrigger,
        });
      });
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from(items, { opacity: 0, duration: 0.15, scrollTrigger });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
};
```

## 5. Probar sin framework

Los casos de uso se prueban reemplazando cada puerto por un objeto en memoria, sin mocks de Next ni red. Con el runner
que adopte el proyecto:

```ts
const sent: ContactMessage[] = [];
const sendContactMessage = makeSendContactMessage({
  sender: { send: async (message) => void sent.push(message) },
});

const result = await sendContactMessage({
  name: 'Ada',
  email: 'ada@example.com',
  body: 'Hola, me interesa tu trabajo.',
});
// result → { ok: true } · sent.length → 1

const invalid = await sendContactMessage({
  name: '',
  email: 'no-es-email',
  body: 'corto',
});
// invalid → { ok: false, errors: ['invalid-name', 'invalid-email', 'invalid-body'] } · sent.length → 1
```
