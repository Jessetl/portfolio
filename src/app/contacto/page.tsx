import type { Metadata } from 'next';

import { ScreenHeading } from '@/components/site/screen-heading';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Cuéntame tu idea, proyecto o vacante. Respondo en menos de 24 horas, normalmente mucho antes.',
};

const ContactPage = () => (
  <ScreenHeading
    number='06'
    label='contacto'
    titleClassName='max-w-[470px]'
  >
    ¿Construimos algo juntos?
  </ScreenHeading>
);

export default ContactPage;
