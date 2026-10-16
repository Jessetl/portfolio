// Secciones del inicio (seo-ux): el id es el ancla de la URL y `data-section`
// el valor de `section_view` que mide SectionViews.
const ids = {
  home: 'inicio',
  about: 'sobre-mi',
  stack: 'stack',
  projects: 'proyectos',
  experience: 'experiencia',
  contact: 'contacto',
} as const;

export type Section = keyof typeof ids;

export const sectionAttrs = (section: Section) => ({
  id: ids[section],
  'data-section': section,
});
