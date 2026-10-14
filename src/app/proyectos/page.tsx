import type { Metadata } from 'next';

import { ScreenHeading } from '@/components/site/screen-heading';

export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Casos de estudio: portal de cotización B2B, plataforma cripto bancaria, historial crediticio digital y gestión de envíos.',
};

const ProjectsPage = () => (
  <ScreenHeading number='04' label='proyectos' className='xl:pt-10'>
    Proyectos destacados
  </ScreenHeading>
);

export default ProjectsPage;
