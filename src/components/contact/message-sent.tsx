'use client';

import { ArrowUp, Check } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { track } from '@/components/analytics/track';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Anillos del board (360/270/180 px), más tenues hacia afuera.
const rings = [
  'size-90 ring-border/8',
  'size-67.5 ring-border/14',
  'size-45 ring-border/22',
];

/**
 * 07 · Mensaje enviado: reemplaza a 06 al enviar. El id avisa a ScreenFooter
 * que muestre "// fin del recorrido". El foco pasa al título para que los
 * lectores de pantalla anuncien el cambio.
 */
export const MessageSent = ({ name, email }: { name: string; email: string }) => {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus();
    // Lead: solo el tipo de formulario, nunca el nombre ni el email.
    track({ name: 'generate_lead', params: { form: 'contact' } });
  }, []);

  return (
    <section id='message-sent' className='flex flex-col items-center text-center'>
      {/* En el board los anillos empiezan 8 px sobre el área de contenido:
          se descuenta también el padding superior de la pantalla de Contacto. */}
      <div
        aria-hidden
        className='relative -mt-10 grid size-90 place-items-center xl:-mt-14'
      >
        {rings.map((ring) => (
          <span
            key={ring}
            className={cn(
              'absolute inset-0 m-auto animate-pulse rounded-full ring-1 ring-inset motion-reduce:animate-none',
              ring,
            )}
          />
        ))}
        <span className='grid size-30 animate-pop-in place-items-center rounded-full bg-primary/20 motion-reduce:animate-none'>
          <Check className='size-14' strokeWidth={2.5} absoluteStrokeWidth />
        </span>
      </div>
      <h1
        ref={heading}
        tabIndex={-1}
        className='mt-5.5 font-heading text-h2 font-medium outline-none'
      >
        ¡Mensaje enviado!
      </h1>
      <p className='mt-2.5 max-w-140 text-body-xl text-muted-foreground'>
        Gracias por escribir, {name.split(/\s+/)[0]}. Te responderé en menos de 24
        horas en {email}.
      </p>
      <div className='mt-9 flex flex-col-reverse gap-4 sm:flex-row'>
        <Link
          href='/proyectos'
          transitionTypes={['step-right']}
          {...ctaAttrs('projects', 'sent')}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          Ver proyectos
        </Link>
        <Link href='/' transitionTypes={['dissolve']} className={cn(buttonVariants())}>
          Volver al inicio
          <ArrowUp aria-hidden />
        </Link>
      </div>
    </section>
  );
};
