import { Chip } from '@/components/ui/chip';
import { Glow } from '@/components/ui/glow';
import { cn } from '@/lib/utils';

import { IntroController } from './intro-controller';
import styles from './intro.module.css';

const Gradient = ({ children }: { children: string }) => (
  <span className='bg-linear-to-r/srgb from-blue to-cyan bg-clip-text text-transparent'>
    {children}
  </span>
);

/**
 * `v2 · Intro` de Penpot: un terminal "arranca" el portfolio y se disuelve
 * hacia el inicio. Es un overlay sobre el HTML ya renderizado: no retrasa el
 * contenido y queda oculto para lectores de pantalla.
 */
export const Intro = () => (
  <div
    id='intro'
    aria-hidden
    className={cn(
      styles.intro,
      'fixed inset-0 z-60 cursor-pointer flex-col items-center overflow-x-hidden overflow-y-auto bg-base px-5 pt-14 pb-8 lg:pt-30 lg:pb-16',
    )}
  >
    <div className='absolute inset-0 bg-grid [--grid-alpha:4%]' />
    <Glow
      color='blue'
      alpha={25}
      className='-top-38 left-1/2 size-115 -translate-x-1/2 lg:-top-75 lg:size-225'
    />

    <p className='relative font-mono text-logo-lg font-bold'>
      <Gradient>{'</'}</Gradient>JM<Gradient>{'>'}</Gradient>
    </p>

    <div className='relative mt-6 w-full max-w-180 overflow-hidden rounded-2xl bg-raised shadow-terminal ring-1 ring-line-strong ring-inset lg:mt-8'>
      <div className='relative flex h-11 items-center gap-2 bg-muted px-4'>
        <span className='size-3 rounded-full bg-fg' />
        <span className='size-3 rounded-full bg-fg-subtle' />
        <span className='size-3 rounded-full bg-line-strong' />
        <p className='absolute inset-x-0 text-center font-mono text-chip text-fg-subtle'>
          zsh — ~/portfolio
        </p>
      </div>
      <div className='flex flex-col gap-3 px-4 py-6 font-mono text-terminal whitespace-pre-wrap text-fg lg:gap-4 lg:px-7 lg:pt-6.5 lg:pb-7'>
        <p>
          <span className='text-cyan'>$</span> <span className={styles.typed}>npm run dev</span>
          <span className={cn(styles.cursor, styles.cursorTyping)} />
        </p>
        <p className={cn(styles.line, styles.at900, 'text-fg-subtle')}>
          {'> jesus-matute-portfolio@4.0.0 dev'}
        </p>
        <p className={cn(styles.line, styles.at1000, 'text-fg-subtle')}>
          {'> next dev --turbo'}
        </p>
        <p className={cn(styles.line, styles.at1300, 'text-fg-muted')}>
          <span className='text-accent'>{'  ▲ Next.js 16'}</span>
          {'   Local: https://jmatute-dev.com'}
        </p>
        <p className={cn(styles.line, styles.at1600, 'text-fg-muted')}>
          <span className='text-cyan'>{'  ✓ '}</span>Compilando secciones (5/5)
        </p>
        <p className={cn(styles.line, styles.at1900, 'text-fg-muted')}>
          <span className='text-cyan'>{'  ✓ '}</span>Ready in 1.2s
        </p>
        <span className={cn(styles.cursor, styles.cursorEnd)} />
      </div>
    </div>

    <div className='relative mt-7 w-full max-w-180 lg:mt-10'>
      <p className='flex justify-between font-mono text-mono'>
        <span className='text-fg-muted'>Cargando portfolio…</span>
        <span className={styles.pct} />
      </p>
      <div className='mt-3 h-1 rounded-sm bg-muted'>
        <div className={cn(styles.fill, 'h-full rounded-sm bg-linear-to-r/srgb from-blue to-cyan shadow-loader')} />
      </div>
    </div>

    <p className='relative mt-auto flex min-h-8 flex-wrap items-center justify-center gap-x-2.5 gap-y-1 pt-10 font-mono text-mono text-fg-subtle'>
      Haz clic o presiona
      <Chip>Enter</Chip>
      para saltar la intro
    </p>

    <IntroController />
  </div>
);
