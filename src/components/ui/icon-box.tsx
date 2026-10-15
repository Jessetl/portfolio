import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** "Icon bg" de Penpot (boards 02, 03 y 06): caja de 44 px con el ícono en acento. */
export const IconBox = ({
  icon: Icon,
  className,
}: {
  icon: LucideIcon;
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn(
      'flex size-11 items-center justify-center rounded-lg bg-primary/18 text-accent-text',
      className,
    )}
  >
    <Icon />
  </span>
);
