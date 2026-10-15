import type { ReactNode } from 'react';

import { WindowFrame } from '@/components/ui/window-frame';

/**
 * 08 · No encontrada y 09 · Error de Penpot: la terminal muestra el comando
 * que falló y debajo van título, mensaje y CTAs, alineados como en 07.
 */
export const ErrorScreen = ({
  command,
  output,
  title,
  children,
  actions,
}: {
  command: string;
  output: string;
  title: string;
  children: ReactNode;
  actions: ReactNode;
}) => (
  <section className='flex flex-col items-center pt-8 pb-12 text-center xl:pt-32'>
    <WindowFrame title='zsh — ~/portfolio' className='w-full max-w-140 text-left'>
      <div className='flex flex-col gap-3 px-4 pt-7 pb-6.5 font-mono text-caption text-terminal-text md:gap-[17px] md:px-7 md:pt-6.5 md:pb-6 md:text-terminal'>
        <p>
          <span className='text-terminal-bright'>$</span> {command}
        </p>
        <p>
          <span className='text-terminal-bright'>✗</span> {output}
        </p>
        <span
          aria-hidden
          className='mt-1.5 h-5 w-2 animate-blink bg-terminal-bright motion-reduce:animate-none md:w-2.5'
        />
      </div>
    </WindowFrame>
    <h1 className='mt-9 font-heading text-h2 font-medium xl:mt-11.5'>{title}</h1>
    <p className='mt-2.5 max-w-140 text-body-xl text-muted-foreground'>{children}</p>
    <div className='mt-9 flex flex-col-reverse gap-4 sm:flex-row'>{actions}</div>
  </section>
);
