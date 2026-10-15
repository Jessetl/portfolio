/** Grupo de herramientas. `icon` es una clave que la UI traduce a un ícono. */
export type StackCategory = {
  icon: string;
  title: string;
  subtitle: string;
  tools: string[];
};

export type Stack = {
  categories: StackCategory[];
  ai: string[];
};
