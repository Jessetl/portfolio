import { Chip } from '@/components/ui/chip';
import { Stat } from '@/components/ui/stat';
import type { Profile } from '@/core/domain/profile/profile';

import { CodeCard } from './code-card';
import { HeroActions } from './hero-actions';

/**
 * 01 · Inicio. Desde 1280 px replica el board (texto | tarjeta de 500 px y
 * stats | CTAs abajo); debajo, todo se apila en una columna.
 */
export const HomeScreen = ({ profile }: { profile: Profile }) => (
  <div className='pt-8 pb-12 xl:pt-[62px] xl:pb-0'>
    <div className='grid gap-10 xl:grid-cols-[minmax(0,1fr)_500px]'>
      <header>
        <Chip dot className='text-muted-foreground'>
          {profile.availability}
        </Chip>
        <p className='mt-6 font-mono text-eyebrow font-medium text-accent-text xl:mt-9'>
          {`// ${profile.role}`}
        </p>
        <h1 className='mt-3 max-w-[740px] font-heading text-h1 font-medium xl:mt-[13px]'>
          {profile.headline.text}{' '}
          <em className='text-accent-text sm:whitespace-nowrap'>
            {profile.headline.accent}
          </em>
        </h1>
        <p className='mt-5 max-w-160 text-lead text-muted-foreground'>
          {profile.summary}
        </p>
      </header>
      <CodeCard />
    </div>

    <div className='mt-12 flex flex-col gap-8 md:flex-row md:flex-wrap md:items-center md:justify-between xl:mt-30'>
      <ul className='flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-x-12 sm:gap-y-6'>
        {profile.stats.map((stat) => (
          <li key={stat.value}>
            <Stat value={stat.value} label={stat.label} />
          </li>
        ))}
      </ul>
      <HeroActions />
    </div>
  </div>
);
