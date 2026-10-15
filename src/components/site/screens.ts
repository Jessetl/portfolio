/** Pantallas 01–06 de Penpot, en el orden del recorrido: nav del header y footer. */
export const screens = [
  { href: '/', number: '01', label: 'Inicio' },
  { href: '/sobre-mi', number: '02', label: 'Sobre mí' },
  { href: '/stack', number: '03', label: 'Stack' },
  { href: '/proyectos', number: '04', label: 'Proyectos' },
  { href: '/experiencia', number: '05', label: 'Experiencia' },
  { href: '/contacto', number: '06', label: 'Contacto' },
] as const;

/** Activa si es la ruta exacta o una ruta anidada de esa pantalla (p. ej. /proyectos/x). */
export const isActive = (href: string, pathname: string) =>
  pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

// Posición de cada pantalla en el flujo en Z del prototipo (Z-Flow guide).
const zFlow: Record<string, readonly [row: number, col: number]> = {
  '/': [0, 0],
  '/sobre-mi': [0, 1],
  '/stack': [0, 2],
  '/proyectos': [1, 0],
  '/experiencia': [1, 1],
  '/contacto': [1, 2],
};

/**
 * `transitionTypes` para ir de una pantalla a otra (Motion & Flow spec): en la
 * misma fila, push horizontal (`step-*` 500 ms en Anterior/Siguiente, `push-*`
 * 450 ms en nav, puntos y logo); al cambiar de fila, push vertical de 600 ms.
 */
export const transitionTo = (
  from: string,
  to: string,
  kind: 'step' | 'jump' = 'jump',
) => {
  const a = zFlow[from];
  const b = zFlow[to];
  if (!b || from === to) return undefined;
  // Desde 08 · No encontrada (fuera del flujo en Z), Penpot usa dissolve.
  if (!a) return ['dissolve'];
  if (a[0] !== b[0]) return [b[0] > a[0] ? 'push-up' : 'push-down'];
  return [`${kind === 'step' ? 'step' : 'push'}-${b[1] > a[1] ? 'left' : 'right'}`];
};
