import type { Metadata } from 'next';

import { Intro } from '@/components/intro/intro';
import { HomeScreen } from '@/components/profile/home-screen';
import { ScreenTransition } from '@/components/motion/screen-transition';
import { getProfile } from '@/infrastructure/container';

export const metadata: Metadata = { alternates: { canonical: '/' } };

// 00 · Intro (overlay de la primera visita) + 01 · Inicio.
const HomePage = async () => {
  const profile = await getProfile();
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.role,
    url: profile.siteUrl,
    sameAs: [profile.links.linkedin.href, profile.links.github.href],
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, '\\u003c'),
        }}
      />
      <Intro />
      <ScreenTransition>
        <HomeScreen profile={profile} />
      </ScreenTransition>
    </>
  );
};

export default HomePage;
