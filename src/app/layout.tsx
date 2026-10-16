import type { Metadata } from 'next';
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';

import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import { CtaTracker } from '@/components/analytics/cta-tracker';
import { introScript } from '@/components/intro/intro-script';
import { AnimatedBackground } from '@/components/motion/animated-background';
import { RevealOnScroll } from '@/components/motion/reveal-on-scroll';
import { revealScript } from '@/components/motion/reveal-script';
import { SiteHeader } from '@/components/site/site-header';
import { getAnalyticsIds, getProfile } from '@/infrastructure/container';

import './globals.css';

// Fuentes de Penpot (v2). Las dos son variables: no hace falta fijar pesos.
const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-plex-sans',
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
});

// SSG estricto: si algo vuelve dinámica una ruta, `next build` falla.
export const dynamic = 'error';

// Canonical no va aquí: la define cada página (heredada, todas apuntarían al inicio).
export const generateMetadata = async (): Promise<Metadata> => {
  const { siteUrl, name, role } = await getProfile();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${name} · ${role}`,
      template: `%s · ${name}`,
    },
    description:
      'De la interfaz a la API: React y Next.js en el cliente; Node.js, NestJS y Laravel en el servidor. 7 años creando plataformas para banca, cripto, crédito y logística.',
  };
};

// Header compartido; cada página pone su <main> (y el inicio, el footer).
const RootLayout = async ({ children }: LayoutProps<'/'>) => {
  const profile = await getProfile();
  const { ga, clarity } = getAnalyticsIds();

  return (
    // suppressHydrationWarning: los scripts de la intro y del reveal marcan <html> antes de hidratar.
    <html
      lang='es'
      className={`${plexSans.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <script dangerouslySetInnerHTML={{ __html: revealScript }} />
      </head>
      <body>
        <AnimatedBackground />
        <SiteHeader links={profile.links} />
        {children}
        <RevealOnScroll />
        <CtaTracker />
        <AnalyticsScripts gaId={ga} clarityId={clarity} />
      </body>
    </html>
  );
};

export default RootLayout;
