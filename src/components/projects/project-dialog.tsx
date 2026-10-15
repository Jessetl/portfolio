'use client';

import { Dialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';

/**
 * Overlay · Detalle de proyecto, como lo conecta el prototipo de Penpot: clic
 * en la tarjeta → panel de 600 px arriba a la derecha con fondo, entra
 * deslizándose desde la derecha (400 ms ease-out) y sale igual (300 ms
 * ease-in); se cierra con la X, al hacer clic fuera o con Esc. El disparador
 * es el título de la tarjeta, estirado sobre toda la tarjeta con ::after.
 */
export const ProjectDialog = ({
  slug,
  overline,
  title,
  children,
}: {
  slug: string;
  overline: string;
  title: string;
  children: ReactNode;
}) => (
  <Dialog.Root>
    <Dialog.Trigger
      {...ctaAttrs('case_study', 'projects', slug)}
      className='cursor-pointer text-left after:absolute after:inset-0 after:rounded-[16px] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring'>
      {title}
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop className='fixed inset-0 z-50 bg-backdrop transition-opacity duration-400 data-ending-style:opacity-0 data-ending-style:duration-300 data-starting-style:opacity-0 motion-reduce:duration-150' />
      <Dialog.Popup className='fixed inset-y-0 right-0 z-50 w-full max-w-150 overflow-y-auto bg-card px-6 pt-10 pb-7 shadow-panel ring-1 ring-border ring-inset transition-[translate,opacity] duration-400 ease-out data-ending-style:translate-x-full data-ending-style:duration-300 data-ending-style:ease-in data-starting-style:translate-x-full sm:px-10 motion-reduce:duration-150 motion-reduce:data-ending-style:translate-x-0 motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:translate-x-0 motion-reduce:data-starting-style:opacity-0'>
        <Dialog.Close
          aria-label='Cerrar detalle'
          className='absolute top-6 right-6 grid size-11 cursor-pointer place-items-center rounded-full bg-muted motion-safe:transition-transform motion-safe:duration-120 motion-safe:active:scale-97'
        >
          <X aria-hidden />
        </Dialog.Close>
        <p className='max-w-120 pr-12 font-mono text-overline font-medium uppercase sm:pr-0'>
          {overline}
        </p>
        <Dialog.Title className='mt-1.25 max-w-120 font-heading text-detail-title font-medium'>
          {title}
        </Dialog.Title>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
