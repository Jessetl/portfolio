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
