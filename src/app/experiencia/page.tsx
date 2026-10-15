import type { Metadata } from 'next';

import { ExperienceScreen } from '@/components/experience/experience-screen';
import { listJobs } from '@/infrastructure/container';

export const metadata: Metadata = {
  title: 'Experiencia',
  description:
    'Trayectoria como Full-Stack y Frontend Developer en LimonByte, CMLExports y Globaltask, de 2019 a 2026.',
};

const ExperiencePage = async () => {
  const jobs = await listJobs();

  return <ExperienceScreen jobs={jobs} />;
};

export default ExperiencePage;
