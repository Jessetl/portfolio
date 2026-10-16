'use client';

import { ChevronDown, Send, Shield } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Magnetic } from '@/components/motion/magnetic';
import { Button } from '@/components/ui/button';
import {
  BODY_MAX,
  BODY_MIN,
  NAME_MAX,
  type ContactMessageError,
  type ProjectType,
} from '@/core/domain/contact/contact-message';
import { cn } from '@/lib/utils';

import type { ContactFormState } from './contact-flow';
import { Turnstile } from './turnstile';

const projectTypeLabels: Record<ProjectType, string> = {
  'web-app': 'Aplicación web',
  job: 'Vacante / oferta de empleo',
  consulting: 'Consultoría técnica',
  other: 'Otro',
};

// Sin diseño en Penpot: textos mínimos con el estilo del texto de ayuda. La
// validación nativa (required, type, minLength) frena casi todo antes de enviar.
const errorText: Record<ContactMessageError, string> = {
  'invalid-name': 'Escribe tu nombre.',
  'invalid-email': 'Revisa tu email.',
  'invalid-project-type': 'Elige un tipo de proyecto.',
  'invalid-body': `El mensaje debe tener entre ${BODY_MIN} y ${BODY_MAX} caracteres.`,
};

// Campo v2: bg/raised, borde interior border/strong y radio 12. Penpot no
// tiene foco: se usa el anillo de foco de los tokens.
const field =
  'w-full rounded-xl bg-raised px-3.5 text-body text-fg ring-1 ring-line-strong ring-inset outline-none placeholder:text-fg-subtle focus-visible:ring-2 focus-visible:ring-ring lg:px-4';

const Field = ({
  id,
  label,
  className,
  children,
}: {
  id: string;
  label: string;
  className?: string;
  children: ReactNode;
}) => (
  <div className={cn('grid gap-2', className)}>
    <label htmlFor={id} className='text-small text-fg-muted'>
      {label}
    </label>
    {children}
  </div>
);

/** Formulario v2 de 05 · Contacto: en mobile, campos apilados y el botón a todo el ancho. */
export const ContactForm = ({
  action,
  pending,
  state,
  turnstileSiteKey,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
  state: ContactFormState;
  turnstileSiteKey: string;
}) => {
  const values = 'values' in state ? state.values : undefined;
  const [length, setLength] = useState(values?.body.length ?? 0);

  return (
    <form
      action={action}
      className='flex flex-col gap-4 rounded-[20px] bg-base px-4.5 pt-6 pb-5 ring-1 ring-line-strong ring-inset lg:gap-4.5 lg:rounded-3xl lg:px-8 lg:pt-8 lg:pb-7'
    >
      <div className='flex flex-col gap-4 lg:gap-1'>
        <h3 className='text-title font-semibold'>Envíame un mensaje</h3>
        <p className='text-small text-fg-subtle'>Todos los campos son obligatorios.</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <Field id='contact-name' label='Nombre'>
          <input
            id='contact-name'
            name='name'
            required
            maxLength={NAME_MAX}
            autoComplete='name'
            placeholder='María López'
            defaultValue={values?.name}
            className={cn(field, 'h-12')}
          />
        </Field>
        <Field id='contact-email' label='Email'>
          <input
            id='contact-email'
            name='email'
            type='email'
            required
            autoComplete='email'
            placeholder='maria@empresa.com'
            defaultValue={values?.email}
            className={cn(field, 'h-12')}
          />
        </Field>
      </div>
      <Field id='contact-type' label='Tipo de proyecto'>
        <div className='relative'>
          <select
            id='contact-type'
            name='projectType'
            required
            defaultValue={values?.projectType ?? 'web-app'}
            className={cn(field, 'h-12 cursor-pointer appearance-none pr-12 text-fg-subtle user-valid:text-fg')}
          >
            {Object.entries(projectTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className='pointer-events-none absolute top-[15px] right-3.5 size-4.5 text-fg-subtle lg:right-4'
          />
        </div>
      </Field>
      <Field id='contact-body' label='Mensaje'>
        <textarea
          id='contact-body'
          name='body'
          required
          minLength={BODY_MIN}
          maxLength={BODY_MAX}
          placeholder='Cuéntame sobre tu proyecto, plazos y presupuesto…'
          aria-describedby='contact-body-help'
          defaultValue={values?.body}
          onChange={(event) => setLength(event.target.value.length)}
          className={cn(field, 'h-32.5 resize-none py-3 lg:h-35 lg:py-3.5')}
        />
      </Field>
      <div className='flex justify-between gap-4 text-small text-fg-subtle'>
        <p id='contact-body-help'>Mínimo {BODY_MIN} caracteres</p>
        <p aria-hidden className='font-mono'>
          {length} / {BODY_MAX}
        </p>
      </div>

      {/* Antispam sin interfaz: campo trampa (oculto también para lectores de
          pantalla; los bots lo llenan) y captcha invisible. */}
      <div aria-hidden className='sr-only'>
        <label>
          Sitio web
          <input name='website' tabIndex={-1} autoComplete='off' />
        </label>
      </div>
      {turnstileSiteKey && <Turnstile siteKey={turnstileSiteKey} resetKey={state} />}

      {state.status === 'invalid' && (
        <ul role='alert' className='text-small text-fg-subtle'>
          {state.errors.map((error) => (
            <li key={error}>{errorText[error]}</li>
          ))}
        </ul>
      )}
      {state.status === 'error' && (
        <p role='alert' className='text-small text-fg-subtle'>
          No se pudo enviar el mensaje. Intenta de nuevo.
        </p>
      )}

      <div className='flex flex-col gap-4 lg:flex-row-reverse lg:items-center lg:justify-between lg:border-t lg:border-line lg:pt-4.5'>
        <Magnetic className='w-full lg:w-auto'>
          <Button type='submit' disabled={pending} className='w-full'>
            Enviar mensaje
            <Send aria-hidden />
          </Button>
        </Magnetic>
        <p className='flex items-center justify-center gap-2 text-small text-fg-subtle'>
          <Shield aria-hidden className='size-3.5 shrink-0 lg:size-4' />
          Solo uso tus datos para responderte.
        </p>
      </div>
    </form>
  );
};
