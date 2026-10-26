import Link from 'next/link';

import { cn } from '@/lib/utils';

/** `</JM>` de Penpot: los signos en acento. Decorativo; el texto accesible va aparte. */
export const LogoMark = ({ className }: { className?: string }) => (
  <span aria-hidden className={cn('font-mono font-bold whitespace-nowrap', className)}>
    <span className='text-accent'>{'</'}</span>JM<span className='text-accent'>{'>'}</span>
  </span>
);

/** Logo del header: lleva al inicio. Bajo 360 px el nombre queda solo para lectores. */
export const Logo = () => (
  <Link href='/#inicio' className='flex items-center gap-2.5 lg:gap-3'>
    <LogoMark className='text-logo' />
    <span className='font-mono text-mono text-fg-muted max-[359px]:sr-only'>
      jesus.matute<span className='sr-only'>, inicio</span>
    </span>
  </Link>
);
