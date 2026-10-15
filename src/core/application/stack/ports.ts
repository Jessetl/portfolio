import type { Stack } from '@/core/domain/stack/stack';

export interface StackRepository {
  get: () => Promise<Stack>;
}
