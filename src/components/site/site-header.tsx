import { Download } from 'lucide-react';

import { ctaAttrs } from '@/components/analytics/cta';
import { buttonVariants } from '@/components/ui/button';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

import { container } from './container';
import { CV_HREF } from './cv';
import { HeaderScroll } from './header-scroll';
import { Logo } from './logo';
import { MobileMenu } from './mobile-menu';
import { NavLinks } from './nav-links';

/**
 * Header v2 de Penpot (72 px; 64 en mobile), fijo arriba. Al bajar toma el
 * fondo con blur y la barra degradada marca el progreso de lectura. Bajo
 * 1024 px la nav pasa al menú móvil.
 */
export const SiteHeader = ({ links }: { links: Profile['links'] }) => (
  <header
    data-header
    className='sticky top-0 z-40 h-16 border-b border-line transition-[background-color,backdrop-filter] duration-200 data-scrolled:bg-base/72 data-scrolled:backdrop-blur-md lg:h-18'
  >
    <div className={cn(container, 'flex h-full items-center justify-between gap-4')}>
      <Logo />
      <NavLinks />
      <div className='flex items-center gap-2'>
        <a
          href={CV_HREF}
          download
          {...ctaAttrs('cv', 'header')}
          className={buttonVariants({ variant: 'secondary', size: 'sm' })}
        >
          <Download aria-hidden />
          CV<span className='sr-only'> (descargar PDF)</span>
        </a>
        <MobileMenu links={links} />
      </div>
    </div>
    <div
      aria-hidden
      data-progress
      className='absolute inset-x-0 -bottom-px h-0.5 origin-left bg-linear-to-r/srgb from-blue to-cyan shadow-progress [scale:var(--progress,0)_1]'
    />
    <HeaderScroll />
  </header>
);
