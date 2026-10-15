import { Mail, MapPin } from 'lucide-react';

import { ScreenHeading } from '@/components/site/screen-heading';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { Chip } from '@/components/ui/chip';
import { IconBox } from '@/components/ui/icon-box';
import type { Profile } from '@/core/domain/profile/profile';

import { ContactFlow, type ContactFormState } from './contact-flow';

/**
 * 06 · Contacto. Desde 1280 px replica el board (intro y canales | formulario
 * de 600 px); debajo, el formulario va después de los canales.
 */
export const ContactScreen = ({
  profile,
  action,
}: {
  profile: Profile;
  action: (
    state: ContactFormState,
    formData: FormData,
  ) => Promise<ContactFormState>;
}) => {
  const { linkedin, github } = profile.links;
  const channels = [
    { label: 'Email', icon: Mail, value: profile.email, href: `mailto:${profile.email}` },
    { label: 'LinkedIn', icon: Linkedin, value: linkedin.label, href: linkedin.href, external: true },
    { label: 'GitHub', icon: Github, value: github.label, href: github.href, external: true },
    { label: 'Ubicación', icon: MapPin, value: profile.location },
  ];

  return (
    <div className='pt-8 pb-12 xl:pt-12'>
      <ContactFlow
        action={action}
        info={
          <div>
            <ScreenHeading
              number='06'
              label='contacto'
              className='pt-0 xl:pt-0'
              titleClassName='max-w-[470px]'
            >
              ¿Construimos algo juntos?
            </ScreenHeading>
            <p className='mt-6.75 max-w-130 text-intro text-muted-foreground'>
              Cuéntame tu idea, proyecto o vacante. Respondo en menos de 24
              horas, normalmente mucho antes.
            </p>
            <ul className='mt-12.5 space-y-4'>
              {channels.map(({ label, icon, value, href, external }) => (
                <li key={label} data-reveal className='flex items-start gap-4 py-1'>
                  <IconBox icon={icon} />
                  <div className='min-w-0'>
                    <p className='font-mono text-overline tracking-label text-muted-foreground uppercase'>
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        {...(external && {
                          target: '_blank',
                          rel: 'noopener noreferrer',
                        })}
                        className='mt-0.75 block text-body-md break-words'
                      >
                        {value}
                        {external && (
                          <span className='sr-only'> (abre en una pestaña nueva)</span>
                        )}
                      </a>
                    ) : (
                      <p className='mt-0.75 text-body-md'>{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Chip dot className='mt-8.5 text-muted-foreground'>
              Respondo en &lt; 24 h
            </Chip>
          </div>
        }
      />
    </div>
  );
};
