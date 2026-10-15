import { Download } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { CV_HREF } from './cv';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { NavLinks } from './nav-links';

/**
 * Header de Penpot (88 px a 1440). Entre 768 y 1279 px la nav pasa a una
 * segunda fila; debajo de 768 px la reemplaza el menú móvil.
 */
export const SiteHeader = () => (
  <header className='mx-auto w-full max-w-360 px-4 sm:px-8 xl:px-20'>
    {/* 87 px + divisor de 1 px = los 88 px del header en Penpot. */}
    <div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-3 py-4 xl:h-[87px] xl:flex-nowrap xl:py-0'>
      <Logo />
      <div className='contents xl:flex xl:items-center xl:gap-10'>
        <NavLinks />
        <div className='flex items-center gap-3'>
          <a
            href={CV_HREF}
            download
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Download aria-hidden />
            CV<span className='sr-only'> (descargar PDF)</span>
          </a>
          <MobileMenu cvHref={CV_HREF} />
        </div>
      </div>
    </div>
    <div className='h-px bg-border/60' />
  </header>
);
