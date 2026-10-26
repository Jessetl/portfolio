import type { ReactNode } from 'react';

import { Glow } from '@/components/ui/glow';

/**
 * Boards `v2 · 404` y `v2 · Error`: bajo el header, el contenido centrado en
 * la pantalla con un brillo azul detrás. Las acciones se apilan en mobile.
 */
export const ErrorScreen = ({
  visual,
  label,
  title,
  children,
  actions,
}: {
  visual: ReactNode;
  label: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) => (
  <main className='relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-5 pt-10 pb-16 text-center lg:min-h-[calc(100svh-4.5rem)] lg:pt-0 lg:pb-18'>
    <Glow
      color='blue'
      alpha={22}
      className='top-1/2 left-1/2 size-105 -translate-1/2 lg:size-190'
    />
    <div className='relative flex flex-col items-center'>
      {visual}
      <p className='font-mono text-eyebrow font-medium text-accent uppercase'>{label}</p>
      <h1 className='mt-3.5 text-h2 font-semibold'>{title}</h1>
      <p className='mt-3.5 max-w-140 text-lead text-fg-muted'>{children}</p>
      <div className='mt-9 flex flex-col gap-3 sm:flex-row'>{actions}</div>
    </div>
  </main>
);
