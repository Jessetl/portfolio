import 'server-only';

import type { ProfileRepository } from '@/core/application/profile/ports';
import raw from '@/content/profile.json';

export const jsonProfileRepository: ProfileRepository = {
  get: async () => raw,
};
