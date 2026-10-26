import type { ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

/**
 * Botón secondary de 44 px solo con ícono (GitHub, LinkedIn, mail). El nombre
 * va como texto oculto; los externos abren en otra pestaña y lo avisan.
 */
export const IconLink = ({
  href,
  label,
  icon: Icon,
  external = false,
  ...attrs
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  external?: boolean;
} & Omit<ComponentProps<'a'>, 'href'>) => (
  <a
    href={href}
    {...attrs}
    {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
    className={buttonVariants({ variant: 'secondary', size: 'icon' })}
  >
    <Icon aria-hidden />
    <span className='sr-only'>
      {label}
      {external && ' (abre en una pestaña nueva)'}
    </span>
  </a>
);
