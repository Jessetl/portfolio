import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Encabezado de las pantallas 02–06 en Penpot: `02. // sobre_mí` + título. */
export const ScreenHeading = ({
  number,
  label,
  children,
  className,
  titleClassName,
}: {
  number: string;
  label: string;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}) => (
  <header className={cn('flex flex-col gap-3 pt-8 xl:pt-12', className)}>
    <p className='font-mono text-mono font-medium tracking-label'>
      <span className='text-accent-text'>{number}.</span>
      <span className='text-muted-foreground'>
        {' // '}
        {label}
      </span>
    </p>
    <h1 className={cn('font-heading text-h2 font-medium', titleClassName)}>
      {children}
    </h1>
  </header>
);
