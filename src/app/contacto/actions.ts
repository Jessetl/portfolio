'use server';

import type { ContactFormState } from '@/components/contact/contact-flow';
import { sendContactMessage } from '@/infrastructure/container';

// Controlador delgado: lee FormData sin confiar en ella, llama al caso de uso y
// traduce el resultado. Devuelve lo enviado para que React, al reiniciar el
// formulario, no borre lo que escribió la persona si hubo un error.
export const sendContactAction = async (
  _state: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> => {
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === 'string' ? value : '';
  };
  const values = {
    name: text('name'),
    email: text('email'),
    projectType: text('projectType'),
    body: text('body'),
  };

  try {
    const result = await sendContactMessage(values);
    return result.ok
      ? { status: 'sent', name: result.value.name, email: result.value.email }
      : { status: 'invalid', errors: result.errors, values };
  } catch (error) {
    console.error('sendContactAction', error);
    return { status: 'error', values };
  }
};
