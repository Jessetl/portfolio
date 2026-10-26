'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { activeSectionIndex } from './sections';

/**
 * Efectos del header al hacer scroll (Motion & Flow spec), con un solo
 * listener: fondo al 72 % con blur pasados 8 px, barra de progreso de lectura
 * (scaleX, sin transición) y scroll spy de la nav.
 */
export const HeaderScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    const header = document.querySelector<HTMLElement>('[data-header]');
    const bar = header?.querySelector<HTMLElement>('[data-progress]');
    const indicator = header?.querySelector<HTMLElement>('[data-nav-indicator]');
    const links = [...(header?.querySelectorAll<HTMLElement>('[data-nav-link]') ?? [])];
    if (!header || !bar) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      header.toggleAttribute('data-scrolled', scrollY > 8);
      bar.style.setProperty('--progress', String(max > 0 ? Math.min(scrollY / max, 1) : 0));

      const active = activeSectionIndex();
      links.forEach((link, i) =>
        i === active ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current'),
      );
      const link = links[active];
      indicator?.toggleAttribute('data-active', Boolean(link));
      if (indicator && link) {
        indicator.style.setProperty('--x', `${link.offsetLeft}px`);
        indicator.style.setProperty('--w', `${link.offsetWidth}px`);
      }
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(update);
    };

    update();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
    };
  }, [pathname]);

  return null;
};
