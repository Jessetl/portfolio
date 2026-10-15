'use client';

import { ArrowUp, RotateCw } from 'lucide-react';
import Link from 'next/link';

import { ScreenTransition } from '@/components/motion/screen-transition';
import { ErrorScreen } from '@/components/site/error-screen';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ErrorPage = ({ retry }: { error: Error & { digest?: string }; retry: () => void }) => (
  <ScreenTransition>
    <ErrorScreen
      command='npm run start'
      output='Error inesperado'
      title='Algo salió mal.'
      actions={
        <>
          <Link
            href='/'
            transitionTypes={['dissolve']}
            className={cn(buttonVariants({ variant: 'outline' }))}
          >
            Volver al inicio
            <ArrowUp aria-hidden />
          </Link>
          <button type='button' onClick={() => retry()} className={cn(buttonVariants())}>
            Reintentar
            <RotateCw aria-hidden />
          </button>
        </>
      }
    >
      Ocurrió un error inesperado al cargar esta pantalla. Intenta de nuevo o
      vuelve al inicio.
    </ErrorScreen>
  </ScreenTransition>
);

export default ErrorPage;
