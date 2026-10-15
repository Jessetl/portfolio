import { Code, Shield, Zap, type LucideIcon } from 'lucide-react';

import { ScreenHeading } from '@/components/site/screen-heading';
import { cardSurface } from '@/components/ui/card';
import { IconBox } from '@/components/ui/icon-box';
import type { Profile } from '@/core/domain/profile/profile';
import { cn } from '@/lib/utils';

import { Portrait } from './portrait';

// Claves de `values[].icon` en src/content/profile.json.
const icons: Record<string, LucideIcon> = { code: Code, shield: Shield, zap: Zap };

/**
 * 02 · Sobre mí. Desde 1280 px replica el board (bio | retrato de 460 px y
 * tres valores abajo); debajo, todo se apila en una columna.
 */
export const AboutScreen = ({ profile }: { profile: Profile }) => (
  <div className='pt-8 pb-12 xl:pt-12 xl:pb-9'>
    <div className='grid gap-10 xl:grid-cols-[620px_460px] xl:justify-between'>
      <div>
        <ScreenHeading
          number='02'
          label='sobre_mí'
          className='pt-0 xl:pt-0'
          titleClassName='max-w-[470px] text-balance'
        >
          Del backend al pixel, sin perder el hilo.
        </ScreenHeading>
        <div className='mt-8.5 max-w-155 space-y-6 text-body-lg text-muted-foreground'>
          {profile.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      <Portrait location={profile.location} />
    </div>

    <ul className='mt-12 grid gap-6 lg:grid-cols-3 xl:mt-15'>
      {profile.values.map((value) => (
        <li key={value.title} className={cn(cardSurface, 'px-6 pt-6 pb-2.25')}>
          <IconBox icon={icons[value.icon]} />
          <h2 className='mt-4 font-heading text-card-title font-medium'>
            {value.title}
          </h2>
          <p className='text-body-sm text-muted-foreground'>{value.text}</p>
        </li>
      ))}
    </ul>
  </div>
);
