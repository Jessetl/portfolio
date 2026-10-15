import type { Metadata } from 'next';

import { ExperienceScreen } from '@/components/experience/experience-screen';
import { ScreenTransition } from '@/components/motion/screen-transition';
import { listJobs } from '@/infrastructure/container';

export const metadata: Metadata = {
  title: 'Experiencia',
  description:
    'Trayectoria como Full-Stack y Frontend Developer en LimonByte, CMLExports y Globaltask, de 2019 a 2026.',
};

const ExperiencePage = async () => {
  const jobs = await listJobs();

  return (
    <ScreenTransition>
      <ExperienceScreen jobs={jobs} />
    </ScreenTransition>
  );
};

export default ExperiencePage;
