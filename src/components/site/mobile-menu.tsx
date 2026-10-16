'use client';

import { Dialog } from '@base-ui/react/dialog';
import { Download, Mail, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { buttonVariants } from '@/components/ui/button';
import { Glow } from '@/components/ui/glow';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

import { CV_HREF } from './cv';
import { IconLink } from './icon-link';
import { LogoMark } from './logo';
import { activeSectionIndex, navSections } from './sections';

/**
 * Menú móvil (< 1024 px), board `v2 · Mobile · Menú`: overlay a pantalla
 * completa que entra con fade de 200 ms y escalona los ítems 40 ms. Atrapa
 * el foco y cierra con Esc, pero no bloquea el scroll: así el ancla de cada
 * enlace desplaza la página debajo mientras el menú se cierra.
 */
export const MobileMenu = ({ links }: { links: Profile['links'] }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const close = () => setOpen(false);

  // Si la pantalla crece a 1024 px o más (p. ej. al rotar), vuelve la nav del header.
  useEffect(() => {
    const desktop = matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, []);

  return (
    <Dialog.Root
      open={open}
      modal='trap-focus'
      onOpenChange={(next) => {
        if (next) setActive(activeSectionIndex());
        setOpen(next);
      }}
    >
      <Dialog.Trigger
        aria-label='Abrir menú'
        className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'lg:hidden')}
      >
        <Menu aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className='fixed inset-0 z-50 flex flex-col overflow-x-hidden overflow-y-auto overscroll-contain bg-base transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:duration-150 lg:hidden'>
          <Dialog.Title className='sr-only'>Menú</Dialog.Title>
          <Glow color='blue' alpha={25} className='top-120 left-15 size-130' />
          <div className='relative flex h-16 shrink-0 items-center justify-between px-5'>
            <Link href='/#inicio' onClick={close} aria-label='Inicio'>
              <LogoMark className='text-logo leading-normal' />
            </Link>
            <Dialog.Close
              aria-label='Cerrar menú'
              className={buttonVariants({ variant: 'secondary', size: 'icon' })}
            >
              <X aria-hidden />
            </Dialog.Close>
          </div>
          <nav aria-label='Principal' className='relative px-5 pt-8'>
            <ul className='flex flex-col gap-1.5'>
              {navSections.map(({ id, number, label }, i) => (
                <li
                  key={id}
                  style={{ animationDelay: `${i * 40}ms` }}
                  className='animate-[reveal_500ms_ease-out_backwards] border-b border-line motion-reduce:animate-none'
                >
                  <Link
                    href={`/#${id}`}
                    onClick={close}
                    aria-current={i === active ? 'true' : undefined}
                    className='group flex items-center gap-4 py-4'
                  >
                    <span className='font-mono text-mono text-accent'>{number}</span>
                    <span className='text-menu font-semibold text-fg-muted group-aria-[current]:text-fg'>
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className='relative mt-auto flex flex-col gap-3 px-5 pt-10 pb-[max(2rem,env(safe-area-inset-bottom))]'>
            <Link
              href='/#contacto'
              onClick={close}
              {...ctaAttrs('contact', 'header')}
              className={cn(buttonVariants(), 'w-full')}
            >
              <Mail aria-hidden />
              Hablemos
            </Link>
            <a
              href={CV_HREF}
              download
              {...ctaAttrs('cv', 'header')}
              className={cn(buttonVariants({ variant: 'secondary' }), 'w-full')}
            >
              <Download aria-hidden />
              Descargar CV<span className='sr-only'> (PDF)</span>
            </a>
            <div className='mt-2 flex justify-center gap-2.5'>
              <IconLink
                href={links.github.href}
                label='GitHub'
                icon={Github}
                external
                {...ctaAttrs('github', 'header')}
              />
              <IconLink
                href={links.linkedin.href}
                label='LinkedIn'
                icon={Linkedin}
                external
                {...ctaAttrs('linkedin', 'header')}
              />
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
