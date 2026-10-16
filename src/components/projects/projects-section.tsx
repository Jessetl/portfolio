import type { CSSProperties } from 'react';

import { sectionAttrs } from '@/components/analytics/section';
import { container } from '@/components/site/container';
import { SectionHeading } from '@/components/site/section-heading';
import type { Project } from '@/core/domain/projects/project';
import { cn } from '@/lib/utils';

import { ProjectCapture } from './project-capture';
import { ProjectText } from './project-text';
import styles from './showcase.module.css';
import { ShowcaseScroll } from './showcase-scroll';

/**
 * 03 · Proyectos, como el escaparate de la referencia. En el escaparate fijo
 * (ShowcaseScroll) cada proyecto ocupa una pantalla de scroll; si no aplica,
 * son tarjetas apiladas: captura 5:4 y texto, separadas por un divisor.
 */
export const ProjectsSection = ({ projects }: { projects: Project[] }) => (
  <section
    data-showcase
    {...sectionAttrs('projects')}
    className={cn(styles.showcase, 'border-t border-line')}
  >
    <div className={cn(container, 'pt-18 lg:pt-30')}>
      <SectionHeading eyebrow='03 / Proyectos'>Proyectos destacados</SectionHeading>
    </div>
    <div
      data-track
      className={styles.track}
      style={{ '--count': projects.length } as CSSProperties}
    >
      <div
        className={cn(
          styles.stage,
          'relative mx-auto flex max-w-2xl flex-col gap-14 px-5 pt-10 pb-18 md:pt-14 lg:pb-30',
        )}
      >
        {projects.map((project, i) => (
          <article
            key={project.slug}
            data-project
            data-state={i === 0 ? 'active' : 'after'}
            data-reveal
            className={cn(
              styles.project,
              'flex flex-col gap-6 not-first:border-t not-first:border-line not-first:pt-14',
            )}
          >
            <ProjectCapture
              project={project}
              className={styles.capture}
              style={{ '--z': projects.length - i } as CSSProperties}
            />
            <ProjectText project={project} className={styles.text} />
          </article>
        ))}
        <div aria-hidden className={cn(styles.hint, 'flex-col items-center gap-1.5 text-fg-subtle')}>
          <span className='font-mono text-xs'>scroll</span>
          <svg
            viewBox='0 0 16 20'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-5 w-4'
          >
            <polyline className={styles.chevron} points='3 2 8 7 13 2' />
            <polyline className={styles.chevron} points='3 8 8 13 13 8' />
            <polyline className={styles.chevron} points='3 14 8 19 13 14' />
          </svg>
        </div>
      </div>
    </div>
    <ShowcaseScroll />
  </section>
);
