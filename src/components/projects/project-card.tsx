import { ArrowRight } from 'lucide-react';
import type { ComponentType } from 'react';

import { cardSurface } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { Project } from '@/core/domain/projects/project';
import { cn } from '@/lib/utils';

import { formatOverline } from './format-overline';
import { ProjectDetail } from './project-detail';
import { ProjectDialog } from './project-dialog';
import {
  NodesMark,
  PhoneMark,
  QuoteThumbnail,
  ShippingThumbnail,
} from './project-visuals';

type Visual = {
  Art: ComponentType<{ className?: string }>;
  wide?: boolean; // miniatura de 340 px: la tarjeta ocupa dos columnas
  reverse?: boolean; // miniatura a la derecha
  className?: string;
};

// Arte de cada proyecto en el board.
const visuals: Record<string, Visual> = {
  'portal-de-cotizacion-b2b': { Art: QuoteThumbnail, wide: true },
  'plataforma-cripto-bancaria': { Art: NodesMark, className: 'sm:top-7.5' },
  'historial-crediticio-digital': { Art: PhoneMark, className: 'sm:top-6' },
  'gestion-de-envios': { Art: ShippingThumbnail, wide: true, reverse: true },
};

// Oculta la tarjeta cuando el filtro elegido es otro sector (ver ProjectsScreen).
const hiddenWhen: Record<string, string> = {
  fintech: 'group-has-[#filter-logistics:checked]/projects:hidden',
  logistics: 'group-has-[#filter-fintech:checked]/projects:hidden',
};

// Como en Penpot: hasta 4 chips; si hay más, 3 y "+N".
const MAX_CHIPS = 4;

/**
 * Tarjeta de proyecto. Toda la tarjeta abre el modal de detalle (el título es
 * el botón y se estira con ::after) y "Ver caso" es decorativo. Hover de la
 * spec de motion: −4 px y borde de acento en 200 ms.
 */
export const ProjectCard = ({ project }: { project: Project }) => {
  const { Art, wide, reverse, className } = visuals[project.slug];
  const tools =
    project.tools.length > MAX_CHIPS
      ? project.tools.slice(0, MAX_CHIPS - 1)
      : project.tools;
  const more = project.tools.length - tools.length;

  return (
    <li
      data-reveal
      className={cn(
        cardSurface,
        'relative flex flex-col transition-[translate,box-shadow] duration-200 ease-out hover:ring-primary motion-safe:hover:-translate-y-1',
        wide ? 'gap-4 p-4 md:col-span-2 md:flex-row' : 'p-6',
        'pb-3.5', // después del padding de cada variante para que tailwind-merge lo conserve
        reverse && 'md:flex-row-reverse',
        hiddenWhen[project.category],
      )}
    >
      {wide ? (
        // 340 px; desde 1280, la misma proporción que en el board (340 de los
        // 728 px internos de la tarjeta) para que escale con la grilla.
        <Art className='md:w-85 md:shrink-0 md:self-start xl:w-[46.7%]' />
      ) : (
        <Art
          className={cn(
            'pointer-events-none mb-4 self-end sm:absolute sm:right-7 sm:mb-0',
            className,
          )}
        />
      )}
      <div className={cn('flex min-w-0 flex-1 flex-col', wide && 'px-2 pt-2')}>
        <div className={cn(!wide && 'sm:pr-17')}>
          <p className='font-mono text-overline font-medium uppercase'>
            {formatOverline([project.sector, project.company], project.period)}
          </p>
          <h2 className='mt-1.75 font-heading text-card-title-xl font-medium'>
            <ProjectDialog
              slug={project.slug}
              title={project.title}
              // Como en el board del detalle: sector · subsector · años (la
              // empresa, si la hay, va en el subtítulo).
              overline={formatOverline(
                [project.sector, project.detail?.domain ?? project.company],
                project.period,
              )}
            >
              <ProjectDetail project={project} />
            </ProjectDialog>
          </h2>
          <p className='mt-2 max-w-90 text-card-body text-muted-foreground'>
            {project.summary}
          </p>
        </div>
        <ul className='mt-8 flex flex-wrap gap-2'>
          {tools.map((tool) => (
            <li key={tool}>
              <Chip surface='muted' size='sm'>
                {tool}
              </Chip>
            </li>
          ))}
          {more > 0 && (
            <li>
              <Chip surface='muted' size='sm'>
                +{more}
                <span className='sr-only'> tecnologías más</span>
              </Chip>
            </li>
          )}
        </ul>
        <span
          aria-hidden
          className='mt-auto flex items-center gap-2 pt-4.75 font-mono text-button-sm'
        >
          Ver caso <ArrowRight />
        </span>
      </div>
    </li>
  );
};
