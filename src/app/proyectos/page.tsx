import type { Metadata } from 'next';

import { ProjectsScreen } from '@/components/projects/projects-screen';
import { listProjects } from '@/infrastructure/container';

export const metadata: Metadata = {
  title: 'Proyectos',
  description:
    'Casos de estudio: portal de cotización B2B, plataforma cripto bancaria, historial crediticio digital y gestión de envíos.',
};

const ProjectsPage = async () => {
  const projects = await listProjects();

  return <ProjectsScreen projects={projects} />;
};

export default ProjectsPage;
