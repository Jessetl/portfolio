import { ArrowUp } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ScreenTransition } from '@/components/motion/screen-transition';
import { ErrorScreen } from '@/components/site/error-screen';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Next agrega `noindex` a esta página.
export const metadata: Metadata = { title: 'Página no encontrada' };

const NotFound = () => (
  <ScreenTransition>
    <ErrorScreen
      command='cd ./esta-pagina'
      output='404 · ruta no encontrada'
      title='Esta página no existe.'
      actions={
        <>
          <Link
            href='/proyectos'
            transitionTypes={['dissolve']}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Ver proyectos
          </Link>
          <Link href='/' transitionTypes={['dissolve']} className={cn(buttonVariants())}>
            Volver al inicio
            <ArrowUp aria-hidden />
          </Link>
        </>
      }
    >
      Puede que el enlace esté roto o que la página haya cambiado de lugar.
      Vuelve al inicio o mira mis proyectos.
    </ErrorScreen>
  </ScreenTransition>
);

export default NotFound;
