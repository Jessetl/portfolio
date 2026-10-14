import { Chip } from '@/components/ui/chip';
import { WindowFrame } from '@/components/ui/window-frame';
import { cn } from '@/lib/utils';

import { IntroController } from './intro-controller';
import styles from './intro.module.css';

/**
 * 00 · Intro de Penpot: un terminal "arranca" el portfolio y se disuelve hacia
 * Inicio. Es un overlay sobre el HTML ya renderizado: no retrasa el contenido
 * y queda oculto para lectores de pantalla.
 */
export const Intro = () => (
  <div
    id='intro'
    aria-hidden
    className={cn(
      styles.intro,
      'fixed inset-0 z-60 cursor-pointer flex-col items-center overflow-y-auto bg-background px-4 pt-12 pb-8 md:pt-30 md:pb-16',
    )}
  >
    <p className='font-mono text-logo-lg font-bold'>
      <span className='text-accent-text'>{'</'}</span>JM
      <span className='text-accent-text'>{'>'}</span>
    </p>

    <WindowFrame
      title='zsh — ~/portfolio'
      className='mt-6 w-full max-w-180 md:mt-8.5 md:h-90'
    >
      <div className='flex flex-col gap-3 px-4 pt-6.5 pb-2.5 font-mono text-caption whitespace-pre-wrap text-terminal-text md:gap-[17px] md:px-7 md:text-terminal'>
        <p>
          <span className='text-terminal-bright'>$</span>{' '}
          <span className={styles.typed}>npm run dev</span>
          <span className={cn(styles.cursor, styles.cursorTyping)} />
        </p>
        <p className={cn(styles.line, styles.at900, 'text-terminal-muted')}>
          {'> jesus-matute-portfolio@3.0.0 dev'}
        </p>
        <p className={cn(styles.line, styles.at1000, 'text-terminal-muted')}>
          {'> next dev --turbo'}
        </p>
        <p className={cn(styles.line, styles.at1300, 'mt-4')}>
          {'  '}
          <span className='text-terminal-key'>▲ Next.js 15</span>
          {'   Local: http://localhost:3000'}
        </p>
        <p className={cn(styles.line, styles.at1600)}>
          {'  '}
          <span className='text-terminal-bright'>✓</span> Compilando secciones
          (6/6)
        </p>
        <p className={cn(styles.line, styles.at1900)}>
          {'  '}
          <span className='text-terminal-bright'>✓</span> Ready in 1.2s
        </p>
        <span className={cn(styles.cursor, styles.cursorEnd, 'mt-1.5')} />
      </div>
    </WindowFrame>

    <div className='mt-8 w-full max-w-180 md:mt-10'>
      <p className='flex justify-between font-mono text-mono'>
        <span className='text-muted-foreground'>Cargando portfolio…</span>
        <span className={cn(styles.pct, 'font-semibold')} />
      </p>
      <div className='mt-3 h-1 overflow-hidden rounded bg-muted'>
        <div className={cn(styles.fill, 'h-full rounded bg-primary')} />
      </div>
    </div>

    <div className='mt-auto pt-10'>
      <p className='flex min-h-10 flex-wrap items-center justify-center gap-2.5 font-mono text-caption text-muted-foreground'>
        Haz clic o presiona
        <Chip size='sm'>Enter</Chip>
        para saltar la intro
      </p>
    </div>

    <IntroController />
  </div>
);
