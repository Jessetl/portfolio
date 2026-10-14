import type { Metadata } from 'next';

import { ScreenHeading } from '@/components/site/screen-heading';

export const metadata: Metadata = {
  title: 'Sobre mí',
  description:
    'Soy Jesús, desarrollador Full-Stack e Ingeniero en Informática. Desde 2019 construyo plataformas de punta a punta para banca, cripto, buró de crédito y logística, casi siempre en equipos remotos.',
};

const AboutPage = () => (
  <ScreenHeading number='02' label='sobre_mí' titleClassName='max-w-[470px]'>
    Del backend al pixel, sin perder el hilo.
  </ScreenHeading>
);

export default AboutPage;
