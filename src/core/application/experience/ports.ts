import type { Job } from '@/core/domain/experience/job';

export interface ExperienceRepository {
  list: () => Promise<Job[]>;
}
