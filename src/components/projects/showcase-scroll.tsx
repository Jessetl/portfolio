'use client';

import { useEffect } from 'react';

// Escaparate fijo (spec): desde 1024 px y sin movimiento reducido.
const MEDIA = '(width >= 64rem) and (prefers-reduced-motion: no-preference)';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Activa el escaparate fijo de Proyectos (`data-pinned` en la sección) y liga
 * el barrido al scroll: la captura saliente se recorta hacia arriba
 * (clip-path), la entrante pasa de scale 1,5 → 1,2 → 1 y el texto cambia al
 * cruzar la mitad. Sin JS, en mobile o con movimiento reducido, los
 * proyectos quedan apilados.
 */
export const ShowcaseScroll = () => {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('[data-showcase]');
    const track = section?.querySelector<HTMLElement>('[data-track]');
    if (!section || !track) return;

    const projects = [...section.querySelectorAll<HTMLElement>('[data-project]')];
    const captures = projects.map((p) => p.querySelector<HTMLElement>('[data-capture]'));
    const images = captures.map((c) => c?.querySelector<HTMLElement>('img'));
    const media = matchMedia(MEDIA);
    const last = projects.length - 1;

    const clear = () => {
      captures.forEach((c) => c?.style.removeProperty('clip-path'));
      captures.forEach((c) => c?.style.removeProperty('visibility'));
      images.forEach((img) => img?.style.removeProperty('scale'));
    };

    let frame = 0;
    const render = () => {
      frame = 0;
      if (!section.hasAttribute('data-pinned')) return;
      // 0 al fijarse el escenario; +1 por cada pantalla de scroll.
      const p = clamp(-track.getBoundingClientRect().top / innerHeight, 0, last);
      const active = Math.round(p);
      projects.forEach((project, i) => {
        project.dataset.state = i < active ? 'before' : i === active ? 'active' : 'after';
      });
      captures.forEach((capture, i) => {
        if (!capture) return;
        const out = clamp(p - i, 0, 1);
        capture.style.clipPath = out > 0 ? `inset(0 0 ${out * 100}% 0)` : '';
        // Solo la actual y la entrante: las de abajo no se ven.
        capture.style.visibility = Math.abs(p - i) < 1 ? '' : 'hidden';
      });
      images.forEach((img, i) => {
        if (!img || i === 0) return;
        const t = clamp(p - i + 1, 0, 1);
        img.style.scale = String(t < 0.5 ? 1.5 - 0.6 * t : 1.2 - 0.4 * (t - 0.5));
      });
    };

    const layout = () => {
      section.toggleAttribute('data-pinned', media.matches);
      if (!media.matches) clear();
      render();
    };
    const schedule = () => {
      frame ||= requestAnimationFrame(render);
    };

    // Con teclado, el foco en un proyecto oculto lleva el scroll hasta él.
    const onFocus = (event: FocusEvent) => {
      if (!section.hasAttribute('data-pinned')) return;
      const i = projects.findIndex((p) => p.contains(event.target as Node));
      if (i === -1) return;
      scrollTo({ top: track.getBoundingClientRect().top + scrollY + i * innerHeight });
    };

    layout();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);
    media.addEventListener('change', layout);
    section.addEventListener('focusin', onFocus);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('scroll', schedule);
      removeEventListener('resize', schedule);
      media.removeEventListener('change', layout);
      section.removeEventListener('focusin', onFocus);
    };
  }, []);

  return null;
};
