'use client';

import { useActionState, type ReactNode } from 'react';

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
 * 06 · Contacto y su estado 07 · Mensaje enviado. La info de contacto llega
 * renderizada en el servidor (`info`); al enviar, la pantalla entera pasa a 07.
 */
export const ContactFlow = ({
  info,
  action,
}: {
  info: ReactNode;
  action: (
    state: ContactFormState,
    formData: FormData,
  ) => Promise<ContactFormState>;
}) => {
  const [state, formAction, pending] = useActionState(action, {
    status: 'idle',
  });

  if (state.status === 'sent')
    return <MessageSent name={state.name} email={state.email} />;

  return (
    <div className='grid gap-12 xl:grid-cols-[minmax(0,1fr)_600px] xl:gap-10'>
      {info}
      <ContactForm action={formAction} pending={pending} state={state} />
    </div>
  );
};
