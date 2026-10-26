import Image from 'next/image';
import type { CSSProperties } from 'react';

import type { Project } from '@/core/domain/projects/project';
import { cn } from '@/lib/utils';

// Las capturas de public/projects miden 1440 × 1600: la proporción de la columna del escaparate.
const WIDTH = 1440;
const HEIGHT = 1600;

/**
 * Captura del proyecto. Apilada: tarjeta 5:4 que cubre desde arriba. En el
 * escaparate fijo (showcase.module.css): columna a pantalla completa, sin
 * marco, que se funde a la izquierda.
 */
export const ProjectCapture = ({
  project,
  className,
  style,
}: {
  project: Project;
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    data-capture
    style={style}
    className={cn(
      'relative aspect-5/4 overflow-hidden rounded-2xl border border-line-strong bg-raised/40',
      className,
    )}
  >
    <Image
      src={project.screenshot.src}
      alt={project.screenshot.alt}
      width={WIDTH}
      height={HEIGHT}
      sizes='(min-width: 1024px) 56vw, (min-width: 672px) 624px, 100vw'
      className='absolute inset-0 size-full object-cover object-top'
    />
  </div>
);
