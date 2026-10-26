import { Code, Shield, Zap, type LucideIcon } from 'lucide-react';

import { sectionAttrs } from '@/components/analytics/section';
import { container } from '@/components/site/container';
import { SectionHeading } from '@/components/site/section-heading';
import { cardSurface } from '@/components/ui/card';
import { IconBox } from '@/components/ui/icon-box';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

// Claves de `values[].icon` en src/content/profile.json.
const icons: Record<string, LucideIcon> = { code: Code, shield: Shield, zap: Zap };

/** 01 · Sobre mí: título | bio desde 1024 px y los tres valores en tarjetas. */
export const About = ({ profile }: { profile: Profile }) => (
  <section {...sectionAttrs('about')} className='border-t border-line'>
    <div className={cn(container, 'py-18 lg:py-30')}>
      <div className='grid gap-6 lg:grid-cols-[13fr_16fr] lg:gap-30'>
        <SectionHeading eyebrow='01 / Sobre mí'>Del backend al pixel, sin perder el hilo.</SectionHeading>
        <div className='space-y-4.5 text-bio text-fg-muted lg:space-y-5.5'>
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <ul className='mt-10 grid gap-4 lg:mt-18 lg:grid-cols-3 lg:gap-6'>
        {profile.values.map((value) => (
          <li
            key={value.title}
            data-reveal
            className={cn(cardSurface, 'flex flex-col items-start gap-3 p-6 lg:gap-3.5 lg:p-7')}
          >
            <IconBox
              icon={icons[value.icon]}
              className='size-10 lg:size-11 [&_svg]:size-4.5 lg:[&_svg]:size-5'
            />
            <h3 className='mt-1 text-title-sm font-semibold lg:mt-1.5'>{value.title}</h3>
            <p className='text-card text-fg-muted'>{value.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
