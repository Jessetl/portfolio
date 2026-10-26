import {
  ArrowRight,
  Database,
  PanelsTopLeft,
  Server,
  Shield,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

import { sectionAttrs } from '@/components/analytics/section';
import { container } from '@/components/site/container';
import { SectionHeading } from '@/components/site/section-heading';
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
 * 02 · Stack: cuatro categorías (dos columnas desde 768 px, cuatro desde
 * 1024) y la fila de IA. En mobile el ícono va junto al título y sin divisor.
 */
export const StackSection = ({ stack }: { stack: Stack }) => (
  <section {...sectionAttrs('stack')} className='border-t border-line'>
    <div className={cn(container, 'py-18 lg:py-30')}>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-10'>
        <SectionHeading eyebrow='02 / Stack'>Herramientas que domino</SectionHeading>
        <p className='max-w-120 text-bio text-fg-muted'>
          Elijo la herramienta según el problema, no al revés. Estas son las que uso a diario en
          producción.
        </p>
      </div>

      <ul className='mt-8 grid gap-4 md:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6'>
        {stack.categories.map((category) => (
          <li key={category.title} data-reveal className={cn(cardSurface, 'p-6 lg:p-7')}>
            <div className='flex items-center gap-3.5 lg:block'>
              <IconBox
                icon={icons[category.icon]}
                className='size-10 lg:size-11 [&_svg]:size-4.5 lg:[&_svg]:size-5'
              />
              <div className='flex flex-col gap-0.5 lg:mt-6 lg:gap-1.5'>
                <h3 className='text-title font-semibold'>{category.title}</h3>
                <p className='text-small text-fg-subtle'>{category.subtitle}</p>
              </div>
            </div>
            <ul className='mt-5.5 flex flex-wrap gap-2 lg:mt-6 lg:border-t lg:border-line lg:pt-6'>
              {category.tools.map((tool) => (
                <li key={tool}>
                  <Chip>{tool}</Chip>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <div data-reveal className='mt-7 flex flex-wrap items-center gap-2.5 lg:mt-10 lg:gap-3.5'>
        <Sparkles aria-hidden className='size-4.5 text-cyan lg:size-5' />
        <h3 className='font-mono text-mono text-fg-muted'>IA en mi flujo de trabajo</h3>
        <ArrowRight aria-hidden className='hidden size-4.5 text-fg-subtle lg:block' />
        <ul className='flex flex-wrap gap-2.5 lg:gap-3.5'>
          {stack.ai.map((tool) => (
            <li key={tool}>
              <Chip variant='dashed'>{tool}</Chip>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);
