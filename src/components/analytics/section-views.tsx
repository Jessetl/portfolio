'use client';

import { useEffect } from 'react';

import type { Section } from './section';
import { track } from './track';

/**
 * `section_view` (seo-ux): una vez por vista, cuando una sección cruza la
 * línea media de la pantalla. Va en el inicio, no en el layout.
 */
export const SectionViews = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          track({ name: 'section_view', params: { section: el.dataset.section as Section } });
          observer.unobserve(el);
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    document.querySelectorAll('[data-section]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
};
