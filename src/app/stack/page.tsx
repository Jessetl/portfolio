import type { Metadata } from 'next';

import { ScreenHeading } from '@/components/site/screen-heading';

export const metadata: Metadata = {
  title: 'Stack',
  description:
    'Elijo la herramienta según el problema, no al revés. Estas son las que uso a diario en producción.',
};

const StackPage = () => (
  <ScreenHeading number='03' label='stack'>
    Herramientas que domino
  </ScreenHeading>
);

export default StackPage;
