import type { Metadata } from 'next';

import { AboutScreen } from '@/components/profile/about-screen';
import { ScreenTransition } from '@/components/motion/screen-transition';
import { getProfile } from '@/infrastructure/container';

export const metadata: Metadata = {
  alternates: { canonical: '/sobre-mi' },
  title: 'Sobre mí',
  description:
    'Ingeniero en Informática y desarrollador Full-Stack con foco en frontend. Desde 2019 construyo plataformas para banca, cripto, crédito y logística.',
};

const AboutPage = async () => {
  const profile = await getProfile();

  return (
    <ScreenTransition>
      <AboutScreen profile={profile} />
    </ScreenTransition>
  );
};

export default AboutPage;
