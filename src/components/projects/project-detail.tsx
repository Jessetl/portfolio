import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ComponentType } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { buttonVariants } from '@/components/ui/button';
import { cardSurface } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { Project } from '@/core/domain/projects/project';
import { cn } from '@/lib/utils';

import { QuoteThumbnail } from './project-visuals';

// Ilustración del modal: Penpot solo la tiene para el portal de cotización.
const detailArt: Record<string, ComponentType> = {
  'portal-de-cotizacion-b2b': () => <QuoteThumbnail detail className='mt-5' />,
};

const SectionHeading = ({
  children,
  className,
}: {
  children: string;
  className?: string;
}) => (
  <h3
    className={cn(
      'font-mono text-caption font-semibold tracking-label uppercase',
      className,
    )}
  >
    {children}
  </h3>
);

/**
 * Cuerpo del modal de detalle (debajo del título). Sin `detail` en el
 * contenido, muestra el resumen de la tarjeta en lugar del subtítulo y omite
 * ilustración, métricas, reto y solución.
 */
export const ProjectDetail = ({ project }: { project: Project }) => {
  const { detail } = project;
  const Art = detailArt[project.slug];

  return (
    <>
      <p className='mt-1.25 max-w-120 text-body-md text-muted-foreground'>
        {detail?.subtitle ?? project.summary}
      </p>
      {Art && <Art />}
      {detail && (
        <>
          <ul className='mt-6 grid gap-3 sm:grid-cols-3 sm:gap-5'>
            {detail.metrics.map((metric) => (
              <li
                key={metric.label}
                className={cn(cardSurface, 'rounded-[12px] px-4 pt-3.5 pb-3 sm:h-21')}
              >
                <p className='font-heading text-metric font-medium'>
                  {metric.value}
                </p>
                <p className='mt-0.5 text-caption text-muted-foreground'>
                  {metric.label}
                </p>
              </li>
            ))}
          </ul>
          <SectionHeading className='mt-6'>Reto</SectionHeading>
          <p className='mt-1.25 text-detail-body text-muted-foreground'>
            {detail.challenge}
          </p>
          <SectionHeading className='mt-5'>Solución</SectionHeading>
          <p className='mt-1.25 text-detail-body text-muted-foreground'>
            {detail.solution}
          </p>
        </>
      )}
      <ul className='mt-4.5 flex flex-wrap gap-2'>
        {project.tools.map((tool) => (
          <li key={tool}>
            <Chip surface='muted' size='sm'>
              {tool}
            </Chip>
          </li>
        ))}
      </ul>
      <div className='mt-7.5 border-t border-border/60 pt-6.25'>
        <Link
          href='/contacto'
          {...ctaAttrs('contact', 'project_detail', project.slug)}
          className={cn(buttonVariants())}
        >
          Hablemos de este proyecto
          <ArrowRight aria-hidden />
        </Link>
      </div>
    </>
  );
};
