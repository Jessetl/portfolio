import type { Metadata } from 'next';

import { AboutScreen } from '@/components/profile/about-screen';
import { getProfile } from '@/infrastructure/container';

export const metadata: Metadata = {
  title: 'Sobre mí',
  description:
    'Ingeniero en Informática y desarrollador Full-Stack con foco en frontend. Desde 2019 construyo plataformas para banca, cripto, crédito y logística.',
};

const AboutPage = async () => {
  const profile = await getProfile();

  return <AboutScreen profile={profile} />;
};

export default AboutPage;
