import { ArrowUp, Mail } from 'lucide-react';
import Link from 'next/link';

import { ctaAttrs } from '@/components/analytics/cta';
import { Github, Linkedin } from '@/components/ui/brand-icons';
import { buttonVariants } from '@/components/ui/button';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

import { container } from './container';
import { IconLink } from './icon-link';
import { LogoMark } from './logo';

/**
 * Footer v2: firma y enlaces en una fila desde 1024 px; en mobile, centrados
 * y apilados con "Volver arriba" solo como ícono. El año sale del build.
 */
export const SiteFooter = ({ profile }: { profile: Profile }) => {
  const { github, linkedin } = profile.links;

  return (
    <footer className='border-t border-line'>
      <div
        className={cn(
          container,
          'flex flex-col-reverse items-center gap-4.5 pt-8 pb-10 lg:flex-row lg:justify-between lg:py-9',
        )}
      >
        <div className='flex items-center gap-3.5'>
          <LogoMark className='hidden text-logo-sm lg:inline' />
          <p className='text-center text-small text-fg-subtle'>
            © {new Date().getFullYear()} {profile.name} · Hecho con Next.js
          </p>
        </div>
        <div className='flex items-center gap-2.5'>
          <IconLink
            href={github.href}
            label='GitHub'
            icon={Github}
            external
            {...ctaAttrs('github', 'footer')}
          />
          <IconLink
            href={linkedin.href}
            label='LinkedIn'
            icon={Linkedin}
            external
            {...ctaAttrs('linkedin', 'footer')}
          />
          <IconLink
            href={`mailto:${profile.email}`}
            label={`Email: ${profile.email}`}
            icon={Mail}
            {...ctaAttrs('email', 'footer')}
          />
          <Link
            href='/#inicio'
            className={cn(
              buttonVariants({ variant: 'secondary', size: 'sm' }),
              'hidden lg:inline-flex',
            )}
          >
            Volver arriba
            <ArrowUp aria-hidden />
          </Link>
          <Link
            href='/#inicio'
            aria-label='Volver arriba'
            className={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'lg:hidden')}
          >
            <ArrowUp aria-hidden />
          </Link>
        </div>
      </div>
    </footer>
  );
};
