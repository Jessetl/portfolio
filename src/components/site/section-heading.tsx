import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Encabezado de sección v2: eyebrow `01 / Sobre mí` en mayúsculas + H2. */
export const SectionHeading = ({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string;
  children: ReactNode;
  className?: string;
}) => (
  <div className={cn('flex flex-col gap-3.5', className)}>
    <p className='font-mono text-eyebrow font-medium text-accent uppercase'>{eyebrow}</p>
    <h2 className='text-h2 font-semibold'>{children}</h2>
  </div>
);
