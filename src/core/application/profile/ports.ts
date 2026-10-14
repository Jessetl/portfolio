import type { Profile } from '@/core/domain/profile/profile';

export interface ProfileRepository {
  get: () => Promise<Profile>;
}
