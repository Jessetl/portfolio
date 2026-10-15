import type { Metadata } from 'next';
import { Fraunces, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';

import { AnalyticsScripts } from '@/components/analytics/analytics-scripts';
import { CtaTracker } from '@/components/analytics/cta-tracker';
import { introScript } from '@/components/intro/intro-script';
import { RevealOnScroll } from '@/components/motion/reveal-on-scroll';
import { revealScript } from '@/components/motion/reveal-script';
import { ScreenFooter } from '@/components/site/screen-footer';
import { SiteHeader } from '@/components/site/site-header';
import { getAnalyticsIds, getProfile } from '@/infrastructure/container';

import './globals.css';

// Fuentes de Penpot. Las tres son variables: no hace falta fijar pesos.
const fraunces = Fraunces({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});
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
  const { siteUrl } = await getProfile();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: 'Jesús Matute · Full-Stack Developer',
      template: '%s · Jesús Matute',
    },
    description:
      'De la interfaz a la API: React y Next.js en el cliente; Node.js, NestJS y Laravel en el servidor. 7 años creando plataformas para banca, cripto, crédito y logística.',
  };
};

const RootLayout = ({ children }: LayoutProps<'/'>) => {
  const { ga, clarity } = getAnalyticsIds();

  return (
  // suppressHydrationWarning: los scripts de la intro y del reveal marcan <html> antes de hidratar.
  <html
    lang='es'
    className={`${fraunces.variable} ${plexSans.variable} ${jetbrainsMono.variable}`}
    suppressHydrationWarning
  >
    <head>
      <script dangerouslySetInnerHTML={{ __html: introScript }} />
      <script dangerouslySetInnerHTML={{ __html: revealScript }} />
    </head>
    <body className='flex min-h-dvh flex-col'>
      <SiteHeader />
      <main className='mx-auto w-full max-w-360 flex-1 px-4 sm:px-8 xl:px-20'>
        {children}
      </main>
      <ScreenFooter />
      <RevealOnScroll />
      <CtaTracker />
      <AnalyticsScripts gaId={ga} clarityId={clarity} />
    </body>
  </html>
  );
};

export default RootLayout;
