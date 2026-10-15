import 'server-only';

import type { ProjectRepository } from '@/core/application/projects/ports';
import raw from '@/content/projects.json';

export const jsonProjectRepository: ProjectRepository = {
  list: async () => raw,
};
