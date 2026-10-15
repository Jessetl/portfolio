import { Download } from 'lucide-react';

import { ctaAttrs } from '@/components/analytics/cta';
import { CV_HREF } from '@/components/site/cv';
import { ScreenHeading } from '@/components/site/screen-heading';
import { buttonVariants } from '@/components/ui/button';
import { cardSurface } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { Job } from '@/core/domain/experience/job';
import { cn } from '@/lib/utils';

/**
 * 05 · Experiencia. Desde 1440 px (`board:`) replica la línea de tiempo del
 * board: cuatro columnas de 305 px y tarjetas de 216 px que alternan arriba y
 * abajo del eje. Con menos ancho los textos ocupan más líneas y el eje ya no
 * cae entre las tarjetas, así que debajo va vertical, a la izquierda.
 */
export const ExperienceScreen = ({ jobs }: { jobs: Job[] }) => (
  <div className='pt-8 pb-12 xl:pt-10 board:pb-9'>
    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
      <ScreenHeading number='05' label='experiencia' className='pt-0 xl:pt-0'>
        Trayectoria
      </ScreenHeading>
      <a
        href={CV_HREF}
        download
        {...ctaAttrs('cv', 'experience')}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'self-start md:self-auto xl:-mb-1',
        )}
      >
        <Download aria-hidden />
        Descargar CV<span className='sr-only'> (PDF)</span>
      </a>
    </div>

    <div className='relative mt-10 board:mt-14.5'>
      {/* Eje con el progreso encima: vertical a la altura de los nodos; desde 1440, horizontal. */}
      <div
        aria-hidden
        className='absolute inset-y-0 left-[7px] w-0.5 bg-border board:inset-x-0 board:top-[247px] board:bottom-auto board:h-0.5 board:w-auto'
      >
        <div className='size-full origin-top animate-grow-y bg-linear-to-b/srgb from-primary/0 to-primary motion-reduce:animate-none board:origin-left board:animate-grow-x board:bg-linear-to-r/srgb' />
      </div>
      <ol className='space-y-6 board:grid board:grid-cols-4 board:gap-x-5 board:space-y-0'>
        {jobs.map((job, i) => {
          // La lista va en orden cronológico: el último es el puesto actual.
          const latest = i === jobs.length - 1;

          return (
            <li
              key={job.period}
              data-reveal
              className={cn(
                'flex items-center board:h-124 board:justify-end',
                i % 2 === 0 ? 'board:flex-col-reverse' : 'board:flex-col',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'relative size-4 shrink-0 rounded-full ring-2 ring-accent-text ring-inset',
                  latest ? 'bg-primary' : 'bg-background',
                )}
              >
                {latest && (
                  <span className='absolute -inset-2 animate-pulse-ring rounded-full bg-primary/30 motion-reduce:animate-none' />
                )}
              </span>
              <span
                aria-hidden
                className='h-px w-6 shrink-0 bg-border board:h-6 board:w-px'
              />
              <article
                className={cn(
                  cardSurface,
                  'relative min-w-0 flex-1 p-6 md:max-w-140 board:h-54 board:w-full board:max-w-none board:flex-none',
                  latest && 'ring-[1.5px] ring-primary',
                )}
              >
                {latest && (
                  <Chip
                    dot
                    surface='muted'
                    size='xs'
                    className='mb-3 sm:absolute sm:top-5 sm:right-5 sm:mb-0'
                  >
                    Más reciente
                  </Chip>
                )}
                <p className='font-mono text-caption font-semibold text-accent-text'>
                  {job.period}
                </p>
                <h2 className='mt-2.5 font-heading text-card-title-sm font-medium'>
                  {job.role}
                </h2>
                <p className='mt-5.5 text-body-xs text-foreground/80'>
                  {job.company} · {job.context}
                </p>
                <p className='mt-2.5 text-card-body-sm text-muted-foreground'>
                  {job.summary}
                </p>
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  </div>
);
