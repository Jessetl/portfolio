import type { Metadata } from 'next';

import { SectionViews } from '@/components/analytics/section-views';
import { ContactSection } from '@/components/contact/contact-section';
import { ExperienceSection } from '@/components/experience/experience-section';
import { Intro } from '@/components/intro/intro';
import { About } from '@/components/profile/about';
import { Hero } from '@/components/profile/hero';
import { ProjectsSection } from '@/components/projects/projects-section';
import { SiteFooter } from '@/components/site/site-footer';
import { StackSection } from '@/components/stack/stack-section';
import {
  getProfile,
  getStack,
  getTurnstileSiteKey,
  listJobs,
  listProjects,
} from '@/infrastructure/container';

import { sendContactAction } from './actions';

export const metadata: Metadata = { alternates: { canonical: '/' } };

// Una sola página (v2): intro (overlay de la primera visita) y las secciones con ancla.
const HomePage = async () => {
  const [profile, stack, projects, jobs] = await Promise.all([
    getProfile(),
    getStack(),
    listProjects(),
    listJobs(),
  ]);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    alternateName: profile.alternateName,
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
      <main>
        <Hero profile={profile} />
        <About profile={profile} />
        <StackSection stack={stack} />
        <ProjectsSection projects={projects} />
        <ExperienceSection jobs={jobs} />
        <ContactSection
          profile={profile}
          action={sendContactAction}
          turnstileSiteKey={getTurnstileSiteKey()}
        />
      </main>
      <SiteFooter profile={profile} />
      <SectionViews />
    </>
  );
};

export default HomePage;
