/** Secciones del menú (header y menú móvil), en orden. El número lo muestra el menú móvil. */
export const navSections = [
  { id: 'sobre-mi', number: '01', label: 'Sobre mí' },
  { id: 'stack', number: '02', label: 'Stack' },
  { id: 'proyectos', number: '03', label: 'Proyectos' },
  { id: 'experiencia', number: '04', label: 'Experiencia' },
  { id: 'contacto', number: '05', label: 'Contacto' },
] as const;

/**
 * Scroll spy (spec): la sección activa es la última cuyo borde superior ya
 * pasó el 40 % de la pantalla; -1 en el hero o fuera del inicio. Solo cliente.
 */
export const activeSectionIndex = () => {
  let active = -1;
  navSections.forEach(({ id }, i) => {
    const top = document.getElementById(id)?.getBoundingClientRect().top;
    if (top !== undefined && top <= innerHeight * 0.4) active = i;
  });
  return active;
};
