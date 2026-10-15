'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Reveal al hacer scroll (Motion & Flow spec): marca con `data-revealed` los
 * `[data-reveal]` que entran al viewport; los que entran juntos se escalonan
 * 60 ms (`--reveal-i`). La animación está en globals.css. Se vuelve a
 * ejecutar en cada pantalla porque la página cambia sin recargar.
 */
export const RevealOnScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.setAttribute('data-reveal-active', '');
    const observer = new IntersectionObserver(
      (entries) => {
        let index = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty('--reveal-i', String(index++));
          el.setAttribute('data-revealed', '');
          observer.unobserve(el);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    document
      .querySelectorAll('[data-reveal]:not([data-revealed])')
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};
