import type { Metadata } from 'next';

import { ContactScreen } from '@/components/contact/contact-screen';
import { ScreenTransition } from '@/components/motion/screen-transition';
import { getProfile, getTurnstileSiteKey } from '@/infrastructure/container';

import { sendContactAction } from './actions';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Cuéntame tu idea, proyecto o vacante. Respondo en menos de 24 horas, normalmente mucho antes.',
};

const ContactPage = async () => {
  const profile = await getProfile();

  return (
    <ScreenTransition>
      <ContactScreen
        profile={profile}
        action={sendContactAction}
        turnstileSiteKey={getTurnstileSiteKey()}
      />
    </ScreenTransition>
  );
};

export default ContactPage;
