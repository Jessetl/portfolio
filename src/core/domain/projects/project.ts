export type ProjectMetric = {
  value: string;
  label: string;
};

/** Contenido del modal de detalle (Overlay · Detalle de proyecto). */
export type ProjectDetail = {
  domain?: string; // subsector del encabezado: "Mercado de capitales"
  subtitle: string;
  metrics: ProjectMetric[];
  challenge: string;
  solution: string;
};

/**
 * Proyecto de la grilla de 04 · Proyectos. `category` es el grupo del filtro
 * ('fintech' | 'logistics'); `sector` es la etiqueta visible. `detail` falta
 * mientras Penpot no tenga el contenido del modal de ese proyecto.
 */
export type Project = {
  detail?: ProjectDetail;
  slug: string;
  category: string;
  sector: string;
  company?: string;
  period: string;
  title: string;
  summary: string;
  tools: string[];
};
