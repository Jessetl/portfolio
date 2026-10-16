import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// Chips v2 de Penpot. Los bordes son interiores (ring inset) como en Penpot y
// no suman alto; el punteado no puede ser un ring, así que ese descuenta 1 px
// del padding.
const chipVariants = cva('inline-flex items-center rounded-full', {
  variants: {
    variant: {
      // Tool / … (herramientas, Enter)
      tool: 'bg-muted px-3 py-1.5 font-mono text-chip text-fg ring-1 ring-line-strong ring-inset',
      // IA en mi flujo de trabajo
      dashed: 'border border-dashed border-line-strong px-[11px] py-[5px] font-mono text-chip text-fg',
      // Disponible, Respondo en < 24 h, Más reciente: con punto que late
      status: 'gap-2 bg-raised py-[7px] pr-3.5 pl-3 text-small ring-1 ring-line-strong ring-inset',
    },
  },
  defaultVariants: { variant: 'tool' },
});

export const Chip = ({
  children,
  variant,
  className,
}: {
  children: ReactNode;
  className?: string;
} & VariantProps<typeof chipVariants>) => (
  <span className={cn(chipVariants({ variant }), className)}>
    {variant === 'status' && (
      // Punto "Disponible" (spec): pulso de 2 s infinito.
      <span
        aria-hidden
        className='size-2 shrink-0 animate-pulse rounded-full bg-cyan shadow-dot motion-reduce:animate-none'
      />
    )}
    {children}
  </span>
);
