// Catálogo cerrado de CTAs (seo-ux). Atributos data-*: sirven en Server
// Components y los lee CtaTracker sin JavaScript por botón.
export type Cta = 'projects' | 'contact' | 'cv' | 'email' | 'linkedin' | 'github';

export type CtaLocation =
  | 'header'
  | 'hero'
  | 'experience'
  | 'contact'
  | 'sent'
  | 'footer';

export const ctaAttrs = (cta: Cta, location: CtaLocation) => ({
  'data-cta': cta,
  'data-cta-location': location,
});
