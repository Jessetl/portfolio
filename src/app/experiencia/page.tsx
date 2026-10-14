import type { Metadata } from 'next';

import { ScreenHeading } from '@/components/site/screen-heading';

export const metadata: Metadata = {
  title: 'Experiencia',
  description:
    'Trayectoria como Full-Stack y Frontend Developer en LimonByte, CMLExports y Globaltask, de 2019 a 2026.',
};

const ExperiencePage = () => (
  <ScreenHeading number='05' label='experiencia' className='xl:pt-10'>
    Trayectoria
  </ScreenHeading>
);

export default ExperiencePage;
