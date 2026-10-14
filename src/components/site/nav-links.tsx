'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { isActive, screens } from './screens';

// Nav de Penpot desde 768 px (segunda fila hasta 1279). Debajo, la reemplaza
// el menú móvil. Es cliente solo para marcar la pantalla activa.
export const NavLinks = () => {
  const pathname = usePathname();

  return (
    <nav
      aria-label='Principal'
      className='order-last hidden w-full overflow-x-auto md:block xl:order-none xl:w-auto xl:overflow-visible'
    >
      <ul className='flex gap-4 xl:gap-7'>
        {screens.map(({ href, number, label }) => {
          const active = isActive(href, pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col gap-1.5 py-1 font-mono text-mono leading-ui whitespace-nowrap',
                  active && 'font-semibold',
                )}
              >
                <span>
                  <span className='text-accent-text'>{number}.</span>{' '}
                  <span
                    className={
                      active ? 'text-foreground' : 'text-muted-foreground'
                    }
                  >
                    {label}
                  </span>
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'h-0.5 w-6 rounded-xs',
                    active ? 'bg-accent-text' : 'bg-transparent',
                  )}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
