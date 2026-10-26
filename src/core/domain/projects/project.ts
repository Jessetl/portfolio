/** Captura del proyecto (en public/) con su texto alternativo. */
export type Screenshot = {
  src: string;
  alt: string;
};

/**
 * Proyecto del escaparate de 03 · Proyectos: título, rol, período, sector y
 * dominio ("Fintech · Mercado de capitales"), tres logros y las tecnologías.
 */
export type Project = {
  slug: string;
  title: string;
  role: string;
  period: string;
  sector: string;
  domain: string;
  highlights: string[];
  tools: string[];
  screenshot: Screenshot;
};
