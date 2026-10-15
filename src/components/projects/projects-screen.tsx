import { ScreenHeading } from '@/components/site/screen-heading';
import type { Project } from '@/core/domain/projects/project';

import { ProjectCard } from './project-card';

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'fintech', label: 'Fintech' },
  { id: 'logistics', label: 'Logística' },
];

/**
 * 04 · Proyectos. Grilla bento: desde 1280 px, pistas de 496/240/496 para que
 * las tarjetas anchas (760) y angostas (496) alternen como en el board; dos
 * columnas desde 768 px y una en mobile. El filtro son radios nativos y las
 * tarjetas se ocultan con :has(), sin JS.
 */
export const ProjectsScreen = ({ projects }: { projects: Project[] }) => (
  <div className='group/projects pt-8 pb-12 xl:pt-10 xl:pb-7'>
    <div className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
      <ScreenHeading number='04' label='proyectos' className='pt-0 xl:pt-0'>
        Proyectos destacados
      </ScreenHeading>
      <fieldset className='flex gap-1 self-start rounded-[12px] bg-card p-1 ring-1 ring-border ring-inset md:self-auto xl:mb-1'>
        <legend className='sr-only'>Filtrar proyectos por sector</legend>
        {filters.map(({ id, label }) => (
          <label
            key={id}
            className='cursor-pointer rounded-md px-4 py-2 text-button-sm text-muted-foreground has-checked:bg-primary has-checked:text-primary-foreground has-focus-visible:ring-2 has-focus-visible:ring-ring'
          >
            <input
              type='radio'
              name='sector'
              id={`filter-${id}`}
              defaultChecked={id === 'all'}
              className='sr-only'
            />
            {label}
          </label>
        ))}
      </fieldset>
    </div>

    <ul className='mt-8 grid gap-6 md:grid-cols-2 xl:mt-9.5 xl:grid-cols-[496fr_240fr_496fr]'>
      {projects.map((project) => (
        <ProjectCard key={project.slug} project={project} />
      ))}
    </ul>
  </div>
);
