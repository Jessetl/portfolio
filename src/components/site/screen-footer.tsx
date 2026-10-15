'use client';

import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { screens } from './screens';

/**
 * Board "Footer" de Penpot: progreso del recorrido y anterior/siguiente. Solo
 * aparece en las pantallas 01–06 (y en 07, como cierre). Una fila desde 1024 px; debajo, el progreso
 * queda arriba y las acciones a la derecha (tablet) o apiladas con
 * "Siguiente" primero (móvil).
 */
export const ScreenFooter = () => {
  const pathname = usePathname();
  const index = screens.findIndex(({ href }) => href === pathname);
  if (index === -1) return null;

  const previous = screens[index - 1];
  const next = screens[index + 1];

  return (
    <footer className='mx-auto w-full max-w-360 px-4 sm:px-8 xl:px-20'>
      <div className='h-px bg-border/60' />
      {/* 07 · Mensaje enviado (estado de Contacto) cambia el recorrido por este cierre. */}
      <p className='hidden py-5 font-mono text-mono text-accent-text lg:h-[95px] lg:items-center lg:py-0 [body:has(#message-sent)_&]:flex'>
        {'// fin del recorrido'}
      </p>
      <nav
        aria-label='Recorrido'
        className='flex flex-col gap-5 py-5 lg:h-[95px] lg:flex-row lg:items-center lg:justify-between lg:py-0 [body:has(#message-sent)_&]:hidden'
      >
        <div className='flex items-center gap-4 lg:gap-6'>
          <p className='shrink-0 font-mono text-base leading-ui font-semibold'>
            {screens[index].number}
            <span className='text-muted-foreground'>
              {' '}
              / {String(screens.length).padStart(2, '0')}
            </span>
          </p>
          <div
            aria-hidden
            className='h-1 flex-1 rounded bg-muted lg:w-50 lg:flex-none'
          >
            <div
              className='h-full rounded bg-primary'
              style={{ width: `${((index + 1) / screens.length) * 100}%` }}
            />
          </div>
          {/* Atajo de mouse: la nav del header ya ofrece lo mismo al teclado. */}
          <ul aria-hidden className='flex gap-2'>
            {screens.map(({ href }, i) => (
              <li key={href}>
                <Link
                  href={href}
                  tabIndex={-1}
                  className={cn(
                    'block size-2 rounded-full',
                    i === index ? 'bg-primary' : 'bg-border',
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end'>
          {previous && (
            <Link
              href={previous.href}
              className={cn(buttonVariants({ variant: 'ghost' }))}
            >
              <ArrowLeft aria-hidden />
              Anterior
            </Link>
          )}
          {next ? (
            <Link href={next.href} className={cn(buttonVariants())}>
              Siguiente: {next.label}
              <ArrowRight aria-hidden />
            </Link>
          ) : (
            <Link
              href='/'
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Volver al inicio
              <ArrowUp aria-hidden />
            </Link>
          )}
        </div>
      </nav>
    </footer>
  );
};
