import {
  ArrowRight,
  Database,
  PanelsTopLeft,
  Server,
  Shield,
  type LucideIcon,
} from 'lucide-react';

import { ScreenHeading } from '@/components/site/screen-heading';
import { cardSurface } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { IconBox } from '@/components/ui/icon-box';
import type { Stack } from '@/core/domain/stack/stack';
import { cn } from '@/lib/utils';

// Claves de `categories[].icon` en src/content/stack.json.
const icons: Record<string, LucideIcon> = {
  layout: PanelsTopLeft,
  server: Server,
  database: Database,
  shield: Shield,
};

/**
 * 03 · Stack. Desde 1280 px replica el board (título | intro y cuatro
 * tarjetas de 380 px); dos columnas desde 640 px y una en mobile.
 */
export const StackScreen = ({ stack }: { stack: Stack }) => (
  <div className='pt-8 pb-12 xl:pt-12 xl:pb-9'>
    <div className='flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between'>
      <ScreenHeading number='03' label='stack' className='pt-0 xl:pt-0'>
        Herramientas que domino
      </ScreenHeading>
      <p className='max-w-125 text-intro text-muted-foreground'>
        Elijo la herramienta según el problema, no al revés. Estas son las que
        uso a diario en producción.
      </p>
    </div>

    <ul className='mt-10 grid gap-6 sm:grid-cols-2 xl:mt-13.5 xl:grid-cols-4'>
      {stack.categories.map((category) => (
        <li key={category.title} className={cn(cardSurface, 'p-6 xl:min-h-95')}>
          <IconBox icon={icons[category.icon]} />
          <h2 className='mt-5 font-heading text-card-title-lg font-medium'>
            {category.title}
          </h2>
          <p className='text-body-xs text-muted-foreground'>
            {category.subtitle}
          </p>
          <ul className='mt-6 flex flex-wrap gap-2 border-t border-border/60 pt-5.25'>
            {category.tools.map((tool) => (
              <li key={tool}>
                <Chip surface='muted'>{tool}</Chip>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>

    <div className='mt-12 flex flex-wrap items-center gap-3'>
      <h2 className='font-mono text-mono text-muted-foreground'>
        IA en mi flujo de trabajo
      </h2>
      <ArrowRight aria-hidden className='text-muted-foreground' />
      <ul className='flex flex-wrap gap-3'>
        {stack.ai.map((tool) => (
          <li key={tool}>
            <Chip surface='dashed'>{tool}</Chip>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
