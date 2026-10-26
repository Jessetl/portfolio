import { Download } from 'lucide-react';

import { ctaAttrs } from '@/components/analytics/cta';
import { sectionAttrs } from '@/components/analytics/section';
import { container } from '@/components/site/container';
import { CV_HREF } from '@/components/site/cv';
import { SectionHeading } from '@/components/site/section-heading';
import { buttonVariants } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import type { Job } from '@/core/domain/experience/job';
import { cn } from '@/lib/utils';

const CvButton = ({ className }: { className?: string }) => (
  <a
    href={CV_HREF}
    download
    {...ctaAttrs('cv', 'experience')}
    className={cn(buttonVariants({ variant: 'secondary' }), className)}
  >
    <Download aria-hidden />
    Descargar CV<span className='sr-only'> (PDF)</span>
  </a>
);

/**
 * 04 · Experiencia: línea de tiempo del puesto actual hacia atrás. Desde
 * 1024 px, período | eje | contenido; en mobile el eje va a la izquierda y el
 * período sobre el puesto. "Descargar CV" va arriba en desktop y al final en
 * mobile.
 */
export const ExperienceSection = ({ jobs }: { jobs: Job[] }) => (
  <section {...sectionAttrs('experience')} className='border-t border-line'>
    <div className={cn(container, 'py-18 lg:py-30')}>
      <div className='flex items-end justify-between gap-6'>
        <SectionHeading eyebrow='04 / Experiencia'>Trayectoria</SectionHeading>
        <CvButton className='hidden lg:inline-flex' />
      </div>

      <ol className='mt-9 lg:mt-16'>
        {/* El contenido va en orden cronológico; la línea de tiempo, del más reciente al más antiguo. */}
        {[...jobs].reverse().map((job, i) => {
          const latest = i === 0;
          return (
            <li
              key={job.period}
              data-reveal
              className='group/job grid grid-cols-[28px_minmax(0,1fr)] [grid-template-areas:"axis_period""axis_body"] lg:grid-cols-[200px_48px_minmax(0,720px)] lg:[grid-template-areas:"period_axis_body"]'
            >
              <p
                className={cn(
                  'pl-2 font-mono text-mono font-medium [grid-area:period] lg:pt-1 lg:pl-0 lg:text-period',
                  latest ? 'text-accent' : 'text-fg-subtle',
                )}
              >
                {job.period}
              </p>
              <div aria-hidden className='flex flex-col items-center [grid-area:axis]'>
                {/* Nodo: rombo; el actual en cian con brillo y pulso de 2 s (spec). */}
                <span
                  className={cn(
                    'mt-2 size-2.5 shrink-0 rotate-45 ring-[1.5px] ring-inset lg:mt-2.5 lg:size-3',
                    latest
                      ? 'animate-pulse bg-cyan ring-cyan shadow-node motion-reduce:animate-none'
                      : 'bg-base ring-accent',
                  )}
                />
                <span className='mt-3 w-px flex-1 bg-line-strong group-last/job:hidden lg:mt-2.5' />
              </div>
              <div className='pb-10 pl-2 [grid-area:body] group-last/job:pb-0 lg:pb-14'>
                <div className='mt-2 flex flex-col items-start gap-2.5 lg:mt-0 lg:flex-row lg:items-center lg:gap-3'>
                  <h3 className='text-title-lg font-semibold'>{job.role}</h3>
                  {latest && (
                    <Chip variant='status' className='text-fg'>
                      Más reciente
                    </Chip>
                  )}
                </div>
                <p className='mt-2 text-card text-fg-muted lg:mt-1.5 lg:text-body'>
                  {job.company} · {job.context}
                </p>
                <p className='mt-2 text-card text-fg-subtle lg:mt-3'>{job.summary}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <CvButton className='mt-8 lg:hidden' />
    </div>
  </section>
);
