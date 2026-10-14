# Hacer cumplir las capas con ESLint

La regla de dependencia se rompe sin que nadie lo note: un import de más y el dominio ya depende de Next. Con
`no-restricted-imports` (regla nativa de ESLint, sin dependencias nuevas), `pnpm lint` falla cuando una capa importa
lo que no debe.

Cada capa declara lo que **no** puede importar, según la tabla de la sección 4 de `SKILL.md`. El patrón `**/../**`
prohíbe rutas relativas hacia arriba y obliga a usar el alias `@/`; sin él, `../../infrastructure/x` se saltaría la
regla.

Para activarlo, reemplaza `eslint.config.mjs` en la raíz:

```js title="eslint.config.mjs"
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const FRAMEWORK = [
  'react',
  'react/**',
  'react-dom',
  'react-dom/**',
  'next',
  'next/**',
  'server-only',
];

// Cada capa declara lo que NO puede importar (ver docs/skills/clean-architecture).
const layer = (files, forbidden, message) => ({
  files,
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: forbidden, message },
          {
            group: ['**/../**'],
            message:
              'Usa el alias @/ en lugar de rutas relativas hacia arriba.',
          },
        ],
      },
    ],
  },
});

// El orden importa: si dos bloques cubren el mismo archivo, gana el último (ui/lib después de components).
const architecture = [
  layer(
    ['src/core/domain/**'],
    [
      ...FRAMEWORK,
      '@/core/application/**',
      '@/infrastructure/**',
      '@/components/**',
      '@/hooks/**',
      '@/lib/**',
      '@/app/**',
    ],
    'Dominio: TypeScript puro, sin framework ni capas externas.',
  ),
  layer(
    ['src/core/application/**'],
    [
      ...FRAMEWORK,
      '@/infrastructure/**',
      '@/components/**',
      '@/hooks/**',
      '@/lib/**',
      '@/app/**',
    ],
    'Aplicación: solo dominio y sus propios puertos.',
  ),
  layer(
    ['src/infrastructure/**'],
    ['@/components/**', '@/hooks/**', '@/app/**'],
    'Infraestructura no conoce la UI.',
  ),
  layer(
    ['src/components/**', 'src/hooks/**'],
    ['@/infrastructure/**', '@/core/application/**', '@/app/**'],
    'La UI recibe datos por props y las Server Actions por la prop `action`.',
  ),
  layer(
    ['src/components/ui/**', 'src/lib/**'],
    [
      '@/core/**',
      '@/infrastructure/**',
      '@/components/*',
      '!@/components/ui',
      '@/hooks/**',
      '@/app/**',
    ],
    'Primitivas y utilidades genéricas: sin dominio ni features.',
  ),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...architecture,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);

export default eslintConfig;
```

`src/app/` no tiene restricciones: es el borde y puede importar de todas las capas (al negocio solo entra por
`@/infrastructure/container`; eso se revisa con el checklist).

Ejemplos de lo que detecta:

| Archivo                                          | Import                                              | Resultado |
| ------------------------------------------------ | --------------------------------------------------- | --------- |
| `src/core/domain/projects/project.ts`            | `next/navigation`                                   | error     |
| `src/core/application/projects/list-projects.ts` | `@/infrastructure/projects/json-project-repository` | error     |
| `src/components/projects/projects-section.tsx`   | `@/infrastructure/container`                        | error     |
| `src/components/projects/projects-section.tsx`   | `../../infrastructure/container`                    | error     |
| `src/components/ui/button.tsx`                   | `@/components/projects/projects-section`            | error     |
| `src/components/projects/projects-section.tsx`   | `@/core/domain/projects/project`                    | permitido |
| `src/components/ui/sheet.tsx`                    | `@/components/ui/button`                            | permitido |
| `src/app/page.tsx`                               | `@/infrastructure/container`                        | permitido |
