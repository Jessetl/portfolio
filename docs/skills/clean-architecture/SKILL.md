---
name: clean-architecture
description: >-
  Clean Architecture para este portfolio (Next.js 16 App Router, React 19, TypeScript, Tailwind v4, shadcn/ui, GSAP):
  define en qué capa y carpeta va cada pieza —entidades y reglas de negocio, casos de uso, puertos, adaptadores,
  Server Actions, Server/Client Components, componentes de UI, hooks, animaciones y tokens de diseño— y qué imports
  están permitidos entre capas. Úsala SIEMPRE antes de crear, mover o revisar archivos en src/: al agregar una
  sección o pantalla del diseño de Penpot, un componente, un formulario, una Server Action, un fetch, contenido
  (proyectos, experiencia, stack), una integración externa (email, CMS, API) o lógica de datos; y cuando se pregunte
  dónde poner algo, cómo organizar carpetas, cómo separar la UI de la lógica de negocio o si un cambio respeta la
  arquitectura, aunque no se mencione "clean architecture".
---

# Clean Architecture — portfolio

El negocio del portfolio (qué es un proyecto, una experiencia, una tecnología del stack, un mensaje de contacto y sus
reglas) no sabe que existen Next.js, React ni el proveedor de email. La UI no sabe de dónde vienen los datos. Así,
cambiar el diseño, la fuente de contenido o un servicio externo toca una sola capa.

> Esta versión de Next.js trae cambios de API. Antes de escribir código de Next, lee la guía correspondiente en
> `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Cómo usar esta skill

1. Clasifica el cambio con la sección 5 («¿Dónde va esto?»). Si es solo visual (replicar una pantalla de Penpot),
   quédate en `components/` y en los tokens; no crees capas de negocio.
2. Si toca datos o reglas, construye de adentro hacia afuera: dominio → puerto y caso de uso → adaptador →
   `container.ts` → página o Server Action → componente. Cada paso compila solo con lo anterior.
3. Antes de terminar, recorre el checklist (sección 9).
4. Si revisas código, reporta cada violación como `archivo:línea — regla rota — dónde debería ir`.

Estilo: funciones, componentes, fábricas de casos de uso y métodos de adaptadores como arrow functions
(`export const x = () => …`), igual que en los ejemplos. No reescribas los archivos que genera shadcn en
`components/ui/`.

Código completo de referencia: `references/ejemplos.md`. Hacer cumplir las reglas con ESLint:
`references/eslint-capas.md`.

## 1. La regla de dependencia

```
app/                          framework · borde exterior
  components/ hooks/ lib/     adaptadores de UI   ┐ mismo anillo,
  infrastructure/             adaptadores de I/O  ┘ no se importan entre sí
    core/application/         casos de uso + puertos
      core/domain/            entidades + reglas puras · centro
```

- **El código solo importa hacia adentro.** `core/` no conoce React, Next, `fetch`, `process.env` ni la UI.
- **Inversión de dependencias.** Cuando el centro necesita algo del exterior (leer contenido, enviar un email), declara
  un **puerto** (interface) en `core/application/`; `infrastructure/` lo implementa y `container.ts` los conecta. El
  adaptador depende del puerto, nunca al revés.
- **Datos planos entre capas.** Entre Server y Client Components los datos viajan como props serializables: las
  instancias de clase y sus métodos no cruzan esa frontera. Por eso las entidades son `type` + funciones puras.

## 2. Mapa de carpetas

```
src/
├── app/                        # Next: rutas, layouts, metadata, Server Actions. Delgado.
│   ├── layout.tsx              # fuentes (next/font) → variables CSS
│   ├── globals.css             # tokens de diseño de Penpot (@theme)
│   └── <ruta>/actions.ts       # 'use server': controladores de mutaciones
├── components/
│   ├── ui/                     # primitivas shadcn: genéricas, sin dominio
│   ├── motion/                 # wrappers de animación (GSAP), 'use client'
│   └── <feature>/              # secciones y pantallas del diseño
├── hooks/                      # hooks de cliente reutilizables (useReducedMotion…)
├── lib/                        # utilidades genéricas sin negocio (cn)
├── core/
│   ├── domain/<feature>/       # entidades, value objects, reglas puras
│   └── application/<feature>/  # casos de uso + ports.ts
├── infrastructure/
│   ├── container.ts            # composition root (server-only)
│   ├── env.ts                  # único lugar que lee process.env
│   └── <feature>/              # adaptadores que implementan puertos
└── content/                    # datos del portfolio (JSON/MDX); solo lo lee infrastructure
```

Features del diseño en Penpot:

| Pantalla                            | Feature                    |
| ----------------------------------- | -------------------------- |
| 00 · Intro (terminal)               | `intro`: solo presentación |
| 01 · Inicio, 02 · Sobre mí          | `profile`                  |
| 03 · Stack                          | `stack`                    |
| 04 · Proyectos + overlay de detalle | `projects`                 |
| 05 · Experiencia                    | `experience`               |
| 06 · Contacto, 07 · Mensaje enviado | `contact`                  |

## 3. Responsabilidades por capa

### Dominio — `src/core/domain/<feature>/`

- **Va:** tipos de entidades y value objects; reglas e invariantes como funciones puras (`sortForShowcase`,
  `createContactMessage`, `isCurrent`, `durationInMonths`); errores esperados como códigos (`'invalid-email'`).
- **No va:** React, `next/*`, `fetch`, `process.env`, lectura implícita del reloj (recibe `now` como parámetro),
  textos de interfaz, clases CSS, fechas formateadas.
- **Por qué:** es lo que más dura y lo más fácil de probar. Si importa algo del framework, deja de poder probarse y
  reutilizarse sin él.

### Aplicación — `src/core/application/<feature>/`

- **Va:** un caso de uso por intención del usuario (`listProjects`, `sendContactMessage`), escrito como fábrica que
  recibe sus puertos: `makeSendContactMessage({ sender })`. `ports.ts` con las interfaces que necesita, nombradas por
  rol (`ProjectRepository`, `MessageSender`) y con tipos de dominio en la firma, nunca tipos de un SDK. Resultados
  esperados como uniones discriminadas (`{ ok: true } | { ok: false; errors }`).
- **No va:** `redirect`, `revalidatePath`, caché de Next, `FormData`, textos de UI, SDKs.
- **Por qué:** describe _qué_ hace la app sin decidir _con qué_; por eso se prueba con fakes en memoria de los puertos.

### Infraestructura — `src/infrastructure/`

- **Va:** adaptadores que implementan puertos (leer `src/content/`, webhook o proveedor de email, CMS); traducción del
  formato externo a tipos de dominio (nunca devuelvas el JSON crudo del proveedor); `env.ts`, único módulo que lee
  `process.env`; `container.ts`, que arma cada caso de uso con su adaptador.
- **Regla:** cada archivo empieza con `import 'server-only'` (Next 16 lo resuelve sin instalar el paquete) para que
  nunca entre al bundle del cliente.
- **Por qué:** concentra en un lugar lo que cambia por razones externas (otro proveedor, otra fuente de contenido).

### Presentación — `src/app/`, `src/components/`, `src/hooks/`, `src/lib/`

**`app/`: controladores delgados**

- `page.tsx` y `layout.tsx` son Server Components: piden datos a `@/infrastructure/container`, los pasan por props y
  componen secciones. Sin reglas de negocio.
- Server Actions (`'use server'`): leen `FormData`, llaman al caso de uso, traducen el resultado a un estado de UI
  serializable y deciden `redirect`/`revalidatePath`. Nómbralas con sufijo `Action`: el plugin de TypeScript de Next
  solo acepta props de función en Client Components si se llaman `action` o terminan en `Action`. Colócalas junto a
  la ruta que las usa (`actions.ts`).
- Los errores inesperados se capturan aquí (`try/catch` en la action, `error.tsx` en lecturas); al cliente solo le
  llega un estado mínimo.

**`components/ui/`: primitivas**

- Generadas con shadcn (`pnpm dlx shadcn add …`). Genéricas: sin props de dominio y sin fetch. Se extienden con
  variantes `cva` y tokens.

**`components/<feature>/`: secciones del diseño**

- Reciben datos listos por props (tipos de dominio o un view model propio) y los muestran. No importan
  `@/infrastructure/*` ni casos de uso; una mutación llega como prop `action`, lo que además permite probarlas con una
  función falsa.
- Son Server Components por defecto. `'use client'` va solo en la hoja que necesita estado, eventos, efectos o APIs
  del navegador (formulario, overlay, animación); el contenido renderizado en el servidor se le pasa como `children`.
- El formato para mostrar (fechas en español, "Actual", porcentajes, códigos de error → texto) va en funciones puras
  junto al componente (`format-period.ts`).
- El microcopy de la interfaz (labels, botones, errores) vive aquí; el contenido del portfolio (proyectos,
  experiencia, stack) vive en `src/content/`.

**`components/motion/` y `hooks/`: movimiento e interacción**

- GSAP (`useGSAP`, `ScrollTrigger`), IntersectionObserver y transiciones entre pantallas: solo presentación, con
  `'use client'`.
- Toda animación respeta `prefers-reduced-motion` (spec de Penpot: solo opacity, 150 ms); con GSAP usa
  `gsap.matchMedia()`.
- El dominio no tiene campos de animación (`delay`, `stagger`); se derivan del índice en la UI.

**`lib/`: utilidades genéricas**

- Solo lo que serviría en cualquier proyecto (`cn`). Si una función menciona proyectos, stack o contacto, no va en
  `lib/`.

**Tokens de diseño**

- Colores y tipografías de Penpot como variables en `src/app/globals.css` (`@theme`). Los componentes usan clases de
  token (`bg-primary`, `font-heading`), nunca valores hex ni tamaños sueltos.

## 4. Imports permitidos

| Un archivo en ↓ puede importar → | `core/domain`               | `core/application` | `infrastructure`     | `components/<feature>`, `hooks` | `components/ui`, `lib` |
| -------------------------------- | --------------------------- | ------------------ | -------------------- | ------------------------------- | ---------------------- |
| `core/domain`                    | ✓                           | ✗                  | ✗                    | ✗                               | ✗                      |
| `core/application`               | ✓                           | ✓                  | ✗                    | ✗                               | ✗                      |
| `infrastructure`                 | ✓                           | ✓ (puertos)        | ✓                    | ✗                               | ✗                      |
| `components/<feature>`, `hooks`  | ✓ (tipos y funciones puras) | ✗                  | ✗                    | ✓                               | ✓                      |
| `components/ui`, `lib`           | ✗                           | ✗                  | ✗                    | ✗                               | ✓                      |
| `app`                            | ✓                           | ✓ (tipos)          | ✓ (solo `container`) | ✓                               | ✓                      |

React y Next solo aparecen en `app/`, `components/`, `hooks/` e `infrastructure/`. Importa siempre con el alias `@/`:
una ruta `../` puede saltarse una capa sin que se note.

## 5. ¿Dónde va esto?

Recorre las preguntas en orden; la primera respuesta afirmativa decide:

1. ¿Habla con el exterior (archivos, `fetch`, email, CMS, `process.env`, un SDK)? → `infrastructure/`, detrás de un
   puerto.
2. ¿Es una regla o cálculo sobre conceptos del portfolio que seguiría siendo cierto fuera de la web? → `core/domain/`.
3. ¿Orquesta pasos (validar → enviar → responder)? → caso de uso en `core/application/`.
4. ¿Depende de la URL, `params`, cookies, metadata o `redirect`, o es la mutación de un formulario? → `app/` (página o
   Server Action), delgado.
5. ¿Es aspecto, texto de interfaz, layout, animación o estado de interacción (abierto, hover, `pending`)? →
   `components/` o `hooks/`.
6. ¿Es una utilidad genérica sin negocio? → `lib/`.

| Necesito…                                      | Va en                                                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Mostrar primero los proyectos destacados       | `core/domain/projects/project.ts` (`sortForShowcase`)                                             |
| Calcular la duración de una experiencia        | `core/domain/experience/` (recibe `now` por parámetro)                                            |
| Mostrar "2022 — Actual"                        | `components/experience/format-period.ts`                                                          |
| Nivel del stack entre 0 y 100                  | `core/domain/stack/`                                                                              |
| Animar la barra de dominio de 0 a n %          | `components/stack/` + `components/motion/`                                                        |
| Validar el formulario de contacto              | `core/domain/contact/` (lo invoca el caso de uso)                                                 |
| Enviar el mensaje (email o webhook)            | `infrastructure/contact/` implementa `MessageSender`                                              |
| Leer `CONTACT_WEBHOOK_URL`                     | `infrastructure/env.ts`                                                                           |
| Mostrar "Mensaje enviado"                      | La action devuelve `{ status: 'sent' }` (o hace `redirect`); un componente de `contact/` lo pinta |
| Overlay de detalle de proyecto                 | `components/projects/` (`'use client'`, Sheet de shadcn)                                          |
| Efecto de escritura de la terminal de la intro | `components/intro/`                                                                               |
| Variante nueva de botón                        | `components/ui/button.tsx` (`cva`)                                                                |
| Datos de proyectos, experiencia y stack        | `src/content/`, leídos por un adaptador                                                           |

## 6. Flujos de referencia

**Lectura:** `app/page.tsx` → `listProjects()` del container → caso de uso → `ProjectRepository` (el adaptador lee
`src/content/`) → entidades → props → `components/projects/`.

**Escritura:** `components/contact/contact-form.tsx` (`'use client'`, `useActionState(action)`) → `sendContactAction`
en `app/` → `sendContactMessage()` del container → el dominio valida → puerto `MessageSender` → adaptador → resultado
→ estado de UI.

El código completo de ambos flujos está en `references/ejemplos.md`.

## 7. Pragmatismo: capas por responsabilidad, no por simetría

Es un portfolio: la arquitectura tiene que salir barata.

- No crees un caso de uso que solo reenvía al repositorio. Para lecturas sin reglas, `container.ts` expone el método
  del repositorio y la página lo llama. Crea el caso de uso cuando aparezca una regla, una validación o más de un paso.
- Un puerto por frontera de I/O real (contenido, envío de mensajes), no uno por función.
- Sin contenedor de DI, decoradores, clases base ni `BaseRepository` genéricos: `container.ts` es un módulo con
  constantes.
- Carpetas por feature dentro de cada capa (`core/domain/projects/`), no carpetas globales por tipo técnico
  (`entities/`, `services/`, `utils/`).
- Una feature sin reglas de negocio (la intro) solo existe en `components/`.

## 8. Antipatrones

| Síntoma                                                     | Corrección                                                      |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| `projects.filter(...).sort(...)` dentro del JSX             | Función pura en `core/domain/`                                  |
| `fetch` o `process.env` en un componente                    | Adaptador + `container.ts`; la página pasa los datos por props  |
| `'use client'` en una sección entera solo por una animación | Wrapper en `components/motion/` que recibe `children`           |
| Server Action con validación y llamadas HTTP inline         | Validación en dominio, I/O en adaptador; la action solo traduce |
| Caso de uso que llama a `redirect()` o `revalidatePath()`   | Moverlo a la Server Action                                      |
| Pasar a un Client Component el registro completo del CMS    | Mapearlo a un tipo mínimo en el adaptador                       |
| `components/ui/button.tsx` con una prop `project`           | Componer en `components/projects/`                              |
| Funciones de proyectos o contacto en `lib/`                 | Moverlas a su feature                                           |
| Hex de color o tamaño de fuente fijo en un componente       | Token en `globals.css`                                          |
| Mensajes en español dentro del dominio                      | Códigos en el dominio, textos en presentación                   |
| Entidad como clase con métodos                              | `type` + funciones puras                                        |

## 9. Checklist

- [ ] Nada en `core/` importa React, Next, `@/infrastructure` ni `@/components`, ni lee `process.env`.
- [ ] Cada archivo de `infrastructure/` empieza con `import 'server-only'`.
- [ ] `app/` accede al negocio solo a través de `@/infrastructure/container`.
- [ ] `'use client'` está en el componente hoja más pequeño posible.
- [ ] Las props hacia Client Components son planas y mínimas.
- [ ] Los errores esperados son valores; los inesperados se capturan en el borde (action o `error.tsx`).
- [ ] Las animaciones respetan `prefers-reduced-motion`.
- [ ] Las reglas nuevas de dominio se pueden probar sin Next ni DOM (fakes en memoria de los puertos).
- [ ] `pnpm lint` y `pnpm build` pasan (con las reglas de `references/eslint-capas.md`, el lint detecta imports
      prohibidos).
