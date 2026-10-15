// Node corre los tests en TypeScript sin compilar; esto resuelve el alias @/ de tsconfig.
// ponytail: solo módulos .ts (dominio y aplicación); un test de componentes .tsx necesitaría otro runner.
import { registerHooks } from 'node:module';

const src = new URL('../src/', import.meta.url);

registerHooks({
  resolve: (specifier, context, next) =>
    next(specifier.startsWith('@/') ? new URL(`${specifier.slice(2)}.ts`, src).href : specifier, context),
});
