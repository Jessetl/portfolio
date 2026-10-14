import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Ventana de la intro y de la tarjeta de código de Inicio: barra de 44 px con
 * los tres puntos y el título centrado, radio 16 y sombra dura de 6 px.
 */
export const WindowFrame = ({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'overflow-hidden rounded-[16px] border bg-ink shadow-terminal',
      className,
    )}
  >
    <div className='relative flex h-11 items-center bg-card px-4.5'>
      <span aria-hidden className='flex gap-1.5'>
        <span className='size-3 rounded-full bg-white' />
        <span className='size-3 rounded-full bg-terminal-dot-2' />
        <span className='size-3 rounded-full bg-terminal-dot-3' />
      </span>
      <p className='absolute inset-x-0 text-center font-mono text-caption text-terminal-muted'>
        {title}
      </p>
    </div>
    {children}
  </div>
);
