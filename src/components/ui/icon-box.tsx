import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

/** "IconBox" v2 de Penpot: caja bg/muted de 44 px con borde y el ícono en acento. */
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
      'flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted text-accent ring-1 ring-line-strong ring-inset [&_svg]:size-5',
      className,
    )}
  >
    <Icon />
  </span>
);
