export type Stat = {
  value: string;
  label: string;
};

/** Principio de trabajo de Sobre mí. `icon` es una clave que la UI traduce a un ícono. */
export type CoreValue = {
  icon: string;
  title: string;
  text: string;
};

export type ExternalLink = {
  label: string;
  href: string;
};

export type Profile = {
  name: string;
  role: string;
  email: string;
  links: { linkedin: ExternalLink; github: ExternalLink };
  availability: string;
  headline: { text: string; accent: string };
  summary: string;
  stats: Stat[];
  bio: string[];
  location: string;
  values: CoreValue[];
};
