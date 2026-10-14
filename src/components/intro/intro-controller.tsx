'use client';

import { useEffect } from 'react';

// Interacciones del board 00 · Intro en Penpot.
const AUTO_MS = 2500; // after-delay
const AUTO_OUT_MS = 800; // dissolve automático
const SKIP_OUT_MS = 400; // dissolve al hacer clic

/** Cierra la intro: sola a los 2,5 s, o antes con clic, Enter o Escape. */
export const IntroController = () => {
  useEffect(() => {
    const root = document.documentElement;
    const intro = document.getElementById('intro');
    if (!intro || !root.hasAttribute('data-intro')) return;

    let leaving = false;
    let removal: ReturnType<typeof setTimeout> | undefined;
    const dismiss = (ms: number) => {
      if (leaving) return;
      leaving = true;
      root.style.setProperty('--intro-out', `${ms}ms`);
      root.setAttribute('data-intro', 'leaving');
      removal = setTimeout(() => {
        root.removeAttribute('data-intro');
        root.style.removeProperty('--intro-out');
      }, ms);
    };
    const skip = () => dismiss(SKIP_OUT_MS);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === 'Escape') skip();
    };

    // Cuenta desde el inicio de la navegación (cuando arrancó la animación),
    // no desde la hidratación.
    const auto = setTimeout(
      () => dismiss(AUTO_OUT_MS),
      Math.max(0, AUTO_MS - performance.now()),
    );
    intro.addEventListener('click', skip);
    document.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(auto);
      clearTimeout(removal);
      intro.removeEventListener('click', skip);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return null;
};
