'use client';

import { useRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

const STRENGTH = 0.3;

/**
 * Botón magnético (spec): con mouse, el contenido se desplaza un 30 % hacia
 * el puntero y vuelve en 300 ms al salir. Sin efecto en táctil ni con
 * movimiento reducido.
 */
export const Magnetic = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onPointerMove={(event) => {
        const el = ref.current;
        if (
          !el ||
          event.pointerType !== 'mouse' ||
          matchMedia('(prefers-reduced-motion: reduce)').matches
        )
          return;
        const box = el.getBoundingClientRect();
        const x = (event.clientX - box.left - box.width / 2) * STRENGTH;
        const y = (event.clientY - box.top - box.height / 2) * STRENGTH;
        el.style.translate = `${x}px ${y}px`;
      }}
      onPointerLeave={() => ref.current?.style.removeProperty('translate')}
      className={cn('inline-flex transition-[translate] duration-300 ease-out', className)}
    >
      {children}
    </div>
  );
};
