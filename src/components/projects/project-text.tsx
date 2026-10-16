import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import type { Project } from '@/core/domain/projects/project';
import { cn } from '@/lib/utils';

import { ToolIcon } from './tool-icon';

/**
 * Texto del proyecto (spec): título, rol, período y sector, tres logros,
 * tecnologías con su logo y el enlace a Contacto. En el escaparate fijo los
 * tamaños escalan con el ancho (`showcase:`).
 */
export const ProjectText = ({ project, className }: { project: Project; className?: string }) => (
  <div data-text className={cn('flex flex-col items-start', className)}>
    <h3 className='mb-3 text-project-title font-semibold showcase:mb-[clamp(1rem,1.6vw,1.75rem)] showcase:text-project-title-lg'>
      {project.title}
    </h3>
    <p className='mb-3 text-body text-fg/85 showcase:mb-[clamp(0.5rem,0.8vw,0.875rem)] showcase:text-project-role'>
      {project.role}
    </p>
    <p className='mb-3 flex flex-wrap gap-x-5 gap-y-1 text-project-meta showcase:mb-[clamp(0.75rem,1.4vw,1.5rem)]'>
      <span className='text-fg-subtle'>{project.period}</span>
      <span className='font-medium text-fg/80'>
        {project.sector} · {project.domain}
      </span>
    </p>
    <ul className='mb-3 flex flex-col gap-2 text-project-item showcase:mb-[clamp(0.75rem,1.2vw,1.25rem)] showcase:gap-[clamp(0.5rem,0.7vw,0.75rem)] showcase:text-project-item-lg'>
      {project.highlights.map((highlight) => (
        <li
          key={highlight}
          className='relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:size-1 before:rounded-full before:bg-cyan'
        >
          {highlight}
        </li>
      ))}
    </ul>
    <ul className='flex flex-wrap gap-x-5 gap-y-2 font-mono text-project-tool text-fg-subtle'>
      {project.tools.map((tool) => (
        <li key={tool} className='inline-flex items-center gap-1.5'>
          <ToolIcon name={tool} className='size-[1.15em] shrink-0' />
          {tool}
        </li>
      ))}
    </ul>
    {/* Enlace como el de la referencia: subrayado que entra al pasar el mouse y flecha que gira. */}
    <Link
      href='/#contacto'
      {...ctaAttrs('contact', 'projects', project.slug)}
      className='group mt-2 inline-flex items-center gap-2 text-project-link font-medium showcase:mt-[1vw] showcase:text-project-link-lg'
    >
      <span className='relative after:absolute after:-bottom-0.5 after:left-0 after:h-[1.5px] after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.62,0.05,0.01,0.99)] group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100'>
        Hablemos de este proyecto
      </span>
      <ArrowRight
        aria-hidden
        className='size-[1em] shrink-0 transition-transform duration-300 group-hover:-rotate-45 group-focus-visible:-rotate-45'
      />
    </Link>
  </div>
);
