import 'server-only';

// Único lector de process.env. Funciones, no constantes: se leen al ejecutar,
// así el build no falla si falta una variable.
const required = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
};

export const env = {
  resendApiKey: () => required('RESEND_API_KEY'),
  // Con el remitente de prueba de Resend, solo llega al email de tu cuenta.
  contactToEmail: () => required('CONTACT_TO_EMAIL'),
  contactFromEmail: () =>
    process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>',
  turnstileSecretKey: () => required('TURNSTILE_SECRET_KEY'),
  // Pública: va al navegador. Sin ella no se dibuja el captcha y el envío falla.
  turnstileSiteKey: () => process.env.TURNSTILE_SITE_KEY ?? '',
};
