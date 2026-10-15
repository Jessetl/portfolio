import 'server-only';

// Único lector de process.env. Funciones, no constantes: se leen al ejecutar,
// así el build no falla si falta una variable.
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
};

export const env = {
  contactWebhookUrl: () => required('CONTACT_WEBHOOK_URL'),
};
