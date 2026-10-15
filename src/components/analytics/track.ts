import type { Cta, CtaLocation } from './cta';

export type AnalyticsEvent =
  | {
      name: 'cta_click';
      params: { cta: Cta; location: CtaLocation; project?: string };
    }
  | { name: 'generate_lead'; params: { form: 'contact' } };

type AnalyticsWindow = Window & {
  gtag?: (command: 'event', name: string, params: object) => void;
  clarity?: (command: 'event', name: string) => void;
};

/**
 * Único punto que conoce GA4 y Clarity. Sin los scripts (local, previews) no
 * hace nada. Nunca datos personales: solo los parámetros del catálogo.
 */
export const track = ({ name, params }: AnalyticsEvent) => {
  const { gtag, clarity } = window as AnalyticsWindow;
  gtag?.('event', name, params);
  // En Clarity, el evento sirve para filtrar grabaciones.
  clarity?.('event', name);
};
