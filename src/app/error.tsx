'use client';

import { ArrowLeft, RotateCw, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

import { ErrorScreen } from '@/components/site/error-screen';
import { buttonVariants } from '@/components/ui/button';

const ErrorPage = ({ retry }: { error: Error & { digest?: string }; retry: () => void }) => (
  <ErrorScreen
    visual={
      <span
        aria-hidden
        className='mb-8 grid size-24 place-items-center rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--blue)_25%,transparent),color-mix(in_srgb,var(--blue)_6%,transparent))] shadow-alert ring-1 ring-accent/45 ring-inset lg:size-30'
      >
        <TriangleAlert className='size-10 text-accent lg:size-12' />
      </span>
    }
    label='Error inesperado'
    title='Algo salió mal.'
    actions={
      <>
        <button type='button' onClick={() => retry()} className={buttonVariants()}>
          <RotateCw aria-hidden />
          Reintentar
        </button>
        <Link href='/' className={buttonVariants({ variant: 'secondary' })}>
          <ArrowLeft aria-hidden />
          Volver al inicio
        </Link>
      </>
    }
  >
    Ocurrió un error inesperado al cargar esta pantalla. Intenta de nuevo o vuelve al inicio.
  </ErrorScreen>
);

export default ErrorPage;
