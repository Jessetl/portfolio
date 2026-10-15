import { MapPin } from 'lucide-react';

import { Chip } from '@/components/ui/chip';

/**
 * Retrato del board 02 · Sobre mí: marco desplazado 24 px detrás y badge de
 * ubicación que sobresale 40 px a la izquierda (el `ml-10` le deja ese espacio
 * cuando va apilado). En Penpot es un placeholder: "reemplazar con tu foto".
 */
export const Portrait = ({ location }: { location: string }) => (
  <div className='relative ml-10 max-w-115 pr-6 pb-6 xl:ml-0'>
    <div
      aria-hidden
      className='absolute top-6 right-0 bottom-0 left-6 rounded-[20px] border border-border/60'
    />
    <div
      aria-hidden
      className='@container relative flex aspect-[436/380] items-center justify-center rounded-[20px] bg-linear-to-br/srgb from-portrait-highlight to-muted pb-5 ring-1 ring-border ring-inset'
    >
      <Chip
        surface='card'
        size='sm'
        className='absolute top-5 left-5 text-muted-foreground'
      >
        foto-perfil.webp
      </Chip>
      <span className='font-heading text-monogram font-medium text-foreground/15'>
        JM
      </span>
    </div>
    <p className='absolute bottom-3.5 -left-10 flex max-w-[calc(100%+2.5rem)] items-center gap-2.5 rounded-[12px] bg-card px-4 py-3 font-mono text-caption shadow-hard ring-1 ring-border ring-inset'>
      <MapPin aria-hidden className='shrink-0' />
      {location}
    </p>
  </div>
);
