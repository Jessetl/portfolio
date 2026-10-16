'use client';

import { useActionState, ViewTransition, type ReactNode } from 'react';

import type {
  ContactMessageError,
  ContactMessageInput,
} from '@/core/domain/contact/contact-message';

import { ContactForm } from './contact-form';
import { MessageSent } from './message-sent';

export type ContactFormState =
  | { status: 'idle' }
  | {
      status: 'invalid';
      errors: ContactMessageError[];
      values: ContactMessageInput;
    }
  | { status: 'error'; values: ContactMessageInput }
  | { status: 'sent'; name: string; email: string };

/**
 * Cuerpo de 05 · Contacto: canales (renderizados en el servidor, `info`) y
 * formulario; al enviar, "Mensaje enviado" reemplaza al formulario. Dos
 * columnas desde 1280 px; antes, apilados.
 */
export const ContactFlow = ({
  info,
  action,
  turnstileSiteKey,
}: {
  info: ReactNode;
  action: (
    state: ContactFormState,
    formData: FormData,
  ) => Promise<ContactFormState>;
  turnstileSiteKey: string;
}) => {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  });

  return (
    <div className='relative mt-7 grid grid-cols-1 items-start gap-5 lg:mt-14 xl:mx-auto xl:max-w-272 xl:grid-cols-[minmax(0,420fr)_minmax(0,620fr)] xl:gap-12'>
      {info}
      {/* Enviar formulario (spec): se desvanece en "Mensaje enviado" en 500 ms.
          Las claves separan los dos estados para que solo ese cambio se anime. */}
      {state.status === 'sent' ? (
        <ViewTransition key='sent' enter='form-dissolve' default='none'>
          <MessageSent name={state.name} email={state.email} />
        </ViewTransition>
      ) : (
        <ViewTransition key='form' exit='form-dissolve' default='none'>
          <ContactForm
            action={formAction}
            pending={pending}
            state={state}
            turnstileSiteKey={turnstileSiteKey}
          />
        </ViewTransition>
      )}
    </div>
  );
};
