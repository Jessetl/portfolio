'use client';

import { ChevronDown, Send, Shield } from 'lucide-react';
import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { cardSurface } from '@/components/ui/card';
import {
  BODY_MAX,
  BODY_MIN,
  NAME_MAX,
  type ContactMessageError,
  type ProjectType,
} from '@/core/domain/contact/contact-message';
import { cn } from '@/lib/utils';

import type { ContactFormState } from './contact-flow';

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

// Campo de Penpot: fondo bg/background, borde interior de 1 px y radio 10; con
// foco, borde de 2 px y halo de acento.
const field =
  'w-full rounded-lg bg-background px-4 text-field text-foreground ring-1 ring-border ring-inset outline-none placeholder:text-muted-foreground/80 focus:shadow-focus focus:ring-2';

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
  <div className={cn('grid gap-1.5', className)}>
    <label htmlFor={id} className='font-mono text-caption font-medium'>
      {label}
    </label>
    {children}
  </div>
);

export const ContactForm = ({
  action,
  pending,
  state,
}: {
  action: (formData: FormData) => void;
  pending: boolean;
  state: ContactFormState;
}) => {
  const values = 'values' in state ? state.values : undefined;
  const [length, setLength] = useState(values?.body.length ?? 0);

  return (
    <form
      data-reveal
      action={action}
      className={cn(cardSurface, 'p-6 shadow-hard sm:p-8 sm:pb-7 xl:-mt-2')}
    >
      <h2 className='font-heading text-card-title-lg font-medium'>
        Envíame un mensaje
      </h2>
      <p className='text-body-xs text-muted-foreground'>
        Todos los campos son obligatorios.
      </p>

      <div className='mt-5 grid gap-4 sm:grid-cols-2'>
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
        <Field id='contact-type' label='Tipo de proyecto' className='sm:col-span-2'>
          <div className='relative'>
            <select
              id='contact-type'
              name='projectType'
              required
              defaultValue={values?.projectType ?? 'web-app'}
              className={cn(field, 'h-12 cursor-pointer appearance-none pr-12')}
            >
              {Object.entries(projectTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden
              className='pointer-events-none absolute top-3 right-3 text-muted-foreground'
            />
          </div>
        </Field>
        <Field id='contact-body' label='Mensaje' className='sm:col-span-2'>
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
            className={cn(field, 'h-35 resize-none py-3.5')}
          />
          <div className='mt-0.5 flex justify-between gap-4 text-caption text-muted-foreground'>
            <p id='contact-body-help'>Mínimo {BODY_MIN} caracteres</p>
            <p aria-hidden className='font-mono'>
              {length} / {BODY_MAX}
            </p>
          </div>
        </Field>
      </div>

      {state.status === 'invalid' && (
        <ul role='alert' className='mt-4 text-caption text-muted-foreground'>
          {state.errors.map((error) => (
            <li key={error}>{errorText[error]}</li>
          ))}
        </ul>
      )}
      {state.status === 'error' && (
        <p role='alert' className='mt-4 text-caption text-muted-foreground'>
          No se pudo enviar el mensaje. Intenta de nuevo.
        </p>
      )}

      <div className='mt-7.5 flex flex-col gap-4 border-t border-border/60 pt-5.75 sm:flex-row sm:items-center sm:justify-between'>
        <p className='flex items-center gap-2 text-caption text-muted-foreground'>
          <Shield aria-hidden className='shrink-0' />
          Solo uso tus datos para responderte.
        </p>
        <Button type='submit' disabled={pending}>
          Enviar mensaje
          <Send aria-hidden />
        </Button>
      </div>
    </form>
  );
};
