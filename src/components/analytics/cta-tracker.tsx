'use client';

import { useEffect } from 'react';

import type { Cta, CtaLocation } from './cta';
import { track } from './track';

/** Un solo listener de clics, por delegación, para todos los `data-cta` del sitio. */
export const CtaTracker = () => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest<HTMLElement>('[data-cta]');
      if (!element) return;
      const { cta, ctaLocation } = element.dataset;
      track({
        name: 'cta_click',
        params: { cta: cta as Cta, location: ctaLocation as CtaLocation },
      });
    };

    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
};
