import { ArrowUpRight, Mail, MapPin, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { sectionAttrs } from '@/components/analytics/section';
import { container } from '@/components/site/container';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { Chip } from '@/components/ui/chip';
import { Glow } from '@/components/ui/glow';
import { IconBox } from '@/components/ui/icon-box';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

import { ContactFlow, type ContactFormState } from './contact-flow';
import { CopyEmailButton } from './copy-email-button';

// Canal v2: bg/base con borde border/subtle; 70 px de alto en mobile y 76 en desktop.
const channel =
  'flex items-center gap-3 rounded-[14px] bg-base p-3 ring-1 ring-line ring-inset transition-[translate,box-shadow] duration-200 hover:ring-blue motion-safe:hover:-translate-y-1 lg:gap-3.5 lg:rounded-2xl lg:px-4 lg:py-3.5';

const ChannelText = ({ label, children }: { label: string; children: ReactNode }) => (
  <span className='min-w-0 flex-1'>
    <span className='block font-mono text-eyebrow font-medium text-fg-subtle uppercase'>
      {label}
    </span>
    <span className='mt-0.5 block text-card wrap-anywhere text-fg lg:text-body'>{children}</span>
  </span>
);

const ChannelIcon = ({ icon }: { icon: LucideIcon }) => (
  <IconBox icon={icon} className='size-9 lg:size-10 [&_svg]:size-4.5' />
);

/**
 * 05 · Contacto: tarjeta con borde degradado, título centrado y, debajo,
 * canales y formulario. En mobile solo email, LinkedIn y GitHub.
 */
export const ContactSection = ({
  profile,
  action,
  turnstileSiteKey,
}: {
  profile: Profile;
  action: (state: ContactFormState, formData: FormData) => Promise<ContactFormState>;
  turnstileSiteKey: string;
}) => {
  const { linkedin, github } = profile.links;
  const external = [
    { label: 'LinkedIn', icon: Linkedin, link: linkedin, cta: 'linkedin' as const },
    { label: 'GitHub', icon: Github, link: github, cta: 'github' as const },
  ];

  return (
    <section {...sectionAttrs('contact')} className='border-t border-line'>
      <div className={cn(container, 'px-4 py-14 lg:py-30')}>
        <div className='relative overflow-hidden rounded-3xl border-gradient px-5 pt-10 pb-6 lg:rounded-4xl lg:p-18'>
          <Glow
            color='blue'
            alpha={22}
            className='-top-60 -left-10 size-105 lg:-top-95 lg:left-[47%] lg:size-175 lg:-translate-x-1/2'
          />
          <Glow color='cyan' alpha={12} className='top-95 -right-10 hidden size-125 lg:block' />

          <div className='relative text-center'>
            <p className='font-mono text-eyebrow font-medium text-accent uppercase'>
              05 / Contacto
            </p>
            <h2 className='mt-3.5 text-contact font-semibold lg:mt-4'>
              ¿Construimos algo{' '}
              <span className='bg-linear-to-r/srgb from-blue to-cyan bg-clip-text text-transparent'>
                juntos?
              </span>
            </h2>
            <p className='mx-auto mt-3 max-w-140 text-body text-fg-muted lg:mt-4 lg:text-lead'>
              Cuéntame tu idea, proyecto o vacante. Respondo en menos de 24 horas, normalmente
              mucho antes.
            </p>
          </div>

          <ContactFlow
            action={action}
            turnstileSiteKey={turnstileSiteKey}
            info={
              <div className='flex flex-col gap-2.5 lg:gap-3.5'>
                <div className={channel}>
                  <ChannelIcon icon={Mail} />
                  <ChannelText label='Email'>
                    <a href={`mailto:${profile.email}`} {...ctaAttrs('email', 'contact')}>
                      {profile.email}
                    </a>
                  </ChannelText>
                  <CopyEmailButton email={profile.email} />
                </div>
                {external.map(({ label, icon, link, cta }) => (
                  <a
                    key={label}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    {...ctaAttrs(cta, 'contact')}
                    className={channel}
                  >
                    <ChannelIcon icon={icon} />
                    <ChannelText label={label}>
                      {link.label}
                      <span className='sr-only'> (abre en una pestaña nueva)</span>
                    </ChannelText>
                    <ArrowUpRight
                      aria-hidden
                      className='size-4 shrink-0 text-fg-subtle lg:size-4.5'
                    />
                  </a>
                ))}
                <div className={cn(channel, 'hidden lg:flex')}>
                  <ChannelIcon icon={MapPin} />
                  <ChannelText label='Ubicación'>{profile.location}</ChannelText>
                </div>
                <Chip variant='status' className='mt-1.5 hidden self-start text-fg-muted lg:inline-flex'>
                  Respondo en &lt; 24 h
                </Chip>
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
};
