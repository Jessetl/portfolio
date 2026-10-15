'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Download, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { Logo } from './logo';
import { isActive, screens } from './screens';

const iconButton = cn(
  buttonVariants({ variant: 'outline', size: 'sm' }),
  'w-11 px-0',
);

/**
 * Menú móvil (< 768 px): overlay a pantalla completa, board `Mobile · Menú`
 * en Penpot. Es un diálogo modal: atrapa el foco, cierra con Esc, devuelve el
 * foco al botón y bloquea el scroll de la página.
 */
export const MobileMenu = ({ cvHref }: { cvHref: string }) => {
  const pathname = usePathname();
  // Abierto solo en la ruta donde se abrió: al navegar se cierra solo.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (next: boolean) => setOpenOn(next ? pathname : null);

  // Si la pantalla crece a 768 px o más (p. ej. al rotar), vuelve la nav visible.
  useEffect(() => {
    const desktop = matchMedia('(min-width: 48rem)');
    const close = () => {
      if (desktop.matches) setOpenOn(null);
    };
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label='Abrir menú'
        className={cn(iconButton, 'md:hidden')}
      >
        <Menu aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className='fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background px-4 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:px-8 md:hidden'>
          <Dialog.Title className='sr-only'>Menú</Dialog.Title>
          <div className='flex items-center justify-between gap-4 py-4'>
            {/* Sin transición entre pantallas desde el menú: el overlay
                abierto quedaría debajo del contenido que se desliza. */}
            <Logo onClick={() => setOpen(false)} animate={false} />
            <Dialog.Close aria-label='Cerrar menú' className={iconButton}>
              <X aria-hidden />
            </Dialog.Close>
          </div>
          <div className='h-px bg-border/60' />
          <nav aria-label='Principal' className='flex-1 py-2'>
            <ul>
              {screens.map(({ href, number, label }) => {
                const active = isActive(href, pathname);
                return (
                  <li key={href} className='border-b border-border/60'>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className='flex flex-col gap-2 py-4'
                    >
                      <span className='flex items-baseline gap-3'>
                        <span className='font-mono text-mono text-accent-text'>
                          {number}.
                        </span>{' '}
                        <span
                          className={cn(
                            'font-heading text-h2 font-medium',
                            active
                              ? 'text-foreground'
                              : 'text-muted-foreground',
                          )}
                        >
                          {label}
                        </span>
                      </span>
                      {active && (
                        <span
                          aria-hidden
                          className='h-0.5 w-6 rounded-xs bg-accent-text'
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className='pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>
            <a
              href={cvHref}
              download
              {...ctaAttrs('cv', 'header')}
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
            >
              <Download aria-hidden />
              Descargar CV
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
