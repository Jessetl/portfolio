'use client';

import { ArrowUp, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { track } from '@/components/analytics/track';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * `v2 · Contacto · Mensaje enviado`: reemplaza al formulario al enviar. El
 * foco pasa al título para que los lectores de pantalla anuncien el cambio.
 */
export const MessageSent = ({ name, email }: { name: string; email: string }) => {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    // Lead: solo el tipo de formulario, nunca el nombre ni el email.
    track({ name: 'generate_lead', params: { form: 'contact' } });
  }, []);

  return (
    <section
      id='message-sent'
      className='flex flex-col items-center rounded-[20px] bg-base px-5 pt-14 pb-12 text-center ring-1 ring-line-strong ring-inset lg:rounded-3xl lg:px-10'
    >
      <span
        aria-hidden
        className='grid size-22 animate-pop-in place-items-center rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--cyan)_25%,transparent),color-mix(in_srgb,var(--blue)_8%,transparent))] shadow-check ring-1 ring-cyan/50 ring-inset motion-reduce:animate-none'
      >
        <Check className='size-10 text-cyan' />
      </span>
      <h3 ref={heading} tabIndex={-1} className='mt-7 text-sent font-semibold outline-none'>
        ¡Mensaje enviado!
      </h3>
      <p className='mt-3 max-w-110 text-body text-fg-muted'>
        Gracias por escribir, {name.split(/\s+/)[0]}. Te responderé en menos de 24 horas en{' '}
        {email}.
      </p>
      <div className='mt-8 flex flex-col-reverse gap-3 sm:flex-row'>
        <Link
          href='/#proyectos'
          {...ctaAttrs('projects', 'sent')}
          className={buttonVariants({ variant: 'secondary' })}
        >
          Ver proyectos
          <ArrowUp aria-hidden />
        </Link>
        <Link href='/#inicio' className={cn(buttonVariants())}>
          Volver al inicio
          <ArrowUp aria-hidden />
        </Link>
      </div>
    </section>
  );
};
