'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { transitionTo } from './screens';

/**
 * Logo del header de Penpot. Bajo 360 px el texto queda solo para lectores.
 * `animate` en false lo usa el menú móvil: ahí el overlay abierto quedaría
 * debajo del contenido que se desliza.
 */
export const Logo = ({
  onClick,
  animate = true,
}: {
  onClick?: () => void;
  animate?: boolean;
}) => {
  const pathname = usePathname();

  return (
    <Link
      href='/'
      onClick={onClick}
      transitionTypes={animate ? transitionTo(pathname, '/') : undefined}
      className='flex items-center gap-3 font-mono'
    >
      <span aria-hidden className='text-h3 leading-ui font-bold'>
        <span className='text-accent-text'>{'</'}</span>JM
        <span className='text-accent-text'>{'>'}</span>
      </span>
      <span className='text-mono font-medium text-muted-foreground max-[359px]:sr-only'>
        jesus.matute<span className='sr-only'>, inicio</span>
      </span>
    </Link>
  );
};
