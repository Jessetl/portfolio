import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ErrorScreen } from '@/components/site/error-screen';
import { buttonVariants } from '@/components/ui/button';

// Next agrega `noindex` a esta página.
export const metadata: Metadata = { title: 'Página no encontrada' };

const NotFound = () => (
  <ErrorScreen
    visual={
      // "404" con el degradado animado del nombre (cian al 60 %).
      <p
        aria-hidden
        className='mb-2 w-fit animate-gradient text-numeral font-semibold text-gradient-animated [--gradient-mid:30%] motion-reduce:animate-none'
      >
        404
      </p>
    }
    label='Error 404'
    title='Esta página no existe.'
    actions={
      <>
        <Link href='/' className={buttonVariants()}>
          <ArrowLeft aria-hidden />
          Volver al inicio
        </Link>
        <Link href='/#proyectos' className={buttonVariants({ variant: 'secondary' })}>
          Ver proyectos
          <ArrowRight aria-hidden />
        </Link>
      </>
    }
  >
    Puede que el enlace esté roto o que la página haya cambiado de lugar. Vuelve al inicio o mira
    mis proyectos.
  </ErrorScreen>
);

export default NotFound;
