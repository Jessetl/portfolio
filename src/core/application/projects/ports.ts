import type { Project } from '@/core/domain/projects/project';

export interface ProjectRepository {
  list: () => Promise<Project[]>;
}
