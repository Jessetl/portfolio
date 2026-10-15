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
            message: 'Usa el alias @/ en lugar de rutas relativas hacia arriba.',
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
