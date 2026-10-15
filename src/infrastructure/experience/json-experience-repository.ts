import 'server-only';

import type { ExperienceRepository } from '@/core/application/experience/ports';
import raw from '@/content/experience.json';

export const jsonExperienceRepository: ExperienceRepository = {
  list: async () => raw,
};
