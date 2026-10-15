// Tipos de proyecto del formulario de 06 · Contacto (los textos viven en la UI).
export const projectTypes = ['web-app', 'job', 'consulting', 'other'] as const;
export type ProjectType = (typeof projectTypes)[number];

export type ContactMessage = {
  name: string;
  email: string;
  projectType: ProjectType;
  body: string;
};

export type ContactMessageInput = Record<keyof ContactMessage, string>;

export type ContactMessageError =
  | 'invalid-name'
  | 'invalid-email'
  | 'invalid-project-type'
  | 'invalid-body';

// Límites del board: "Mínimo 20 caracteres" y contador "0 / 500".
export const NAME_MAX = 100;
export const BODY_MIN = 20;
export const BODY_MAX = 500;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isProjectType = (value: string): value is ProjectType =>
  (projectTypes as readonly string[]).includes(value);

export const createContactMessage = (
  input: ContactMessageInput,
):
  | { ok: true; value: ContactMessage }
  | { ok: false; errors: ContactMessageError[] } => {
  const name = input.name.trim();
  const email = input.email.trim();
  const body = input.body.trim();
  const { projectType } = input;

  const errors: ContactMessageError[] = [];
  if (name.length === 0 || name.length > NAME_MAX) errors.push('invalid-name');
  if (email.length > 254 || !EMAIL.test(email)) errors.push('invalid-email');
  if (!isProjectType(projectType)) errors.push('invalid-project-type');
  if (body.length < BODY_MIN || body.length > BODY_MAX)
    errors.push('invalid-body');

  if (errors.length > 0 || !isProjectType(projectType))
    return { ok: false, errors };
  return { ok: true, value: { name, email, projectType, body } };
};
