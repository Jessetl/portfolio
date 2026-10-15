import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// "Chip / …" de Penpot: píldora mono con padding 6/12. El borde es interior
// (ring inset) como en Penpot, así no suma alto.
const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono font-medium text-foreground',
  {
    variants: {
      surface: {
        outline: 'bg-card ring-1 ring-border ring-inset', // disponible, Enter
        muted: 'bg-muted', // tags de stack y proyectos
        card: 'bg-card', // foto-perfil.webp
        // IA en el flujo de trabajo (Stack). Un ring no puede ser punteado: este
        // borde sí suma 2 px, como los chips de 29 px del board.
        dashed: 'border border-dashed border-border/70 bg-card',
      },
      size: {
        default: 'text-chip-lg', // 13px
        sm: 'text-chip', // 12px
        xs: 'text-chip-xs', // 11px, "Más reciente"
      },
    },
    defaultVariants: { surface: 'outline', size: 'default' },
  },
);

export const Chip = ({
  children,
  dot = false,
  surface,
  size,
  className,
}: {
  children: ReactNode;
  dot?: boolean;
  className?: string;
} & VariantProps<typeof chipVariants>) => (
  <span className={cn(chipVariants({ surface, size }), className)}>
    {dot && <span aria-hidden className='size-2 rounded-full bg-foreground' />}
    {children}
  </span>
);
