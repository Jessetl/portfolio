import 'server-only';

import type { StackRepository } from '@/core/application/stack/ports';
import raw from '@/content/stack.json';

export const jsonStackRepository: StackRepository = {
  get: async () => raw,
};
