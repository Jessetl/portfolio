import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// CTAs del board 01 · Inicio: un primario por vista ("Ver proyectos").
// En móvil se apilan a lo ancho con el primario arriba. Ambos bajan a la
// segunda fila de la Z: push hacia arriba.
export const HeroActions = () => (
  <div data-reveal className='flex flex-col-reverse gap-4 sm:flex-row sm:items-center'>
    <Link
      href='/contacto'
      transitionTypes={['push-up']}
      className={cn(buttonVariants({ variant: 'outline' }))}
    >
      <Mail aria-hidden />
      Hablemos
    </Link>
    <Link
      href='/proyectos'
      transitionTypes={['push-up']}
      className={cn(buttonVariants())}
    >
      Ver proyectos
      <ArrowRight aria-hidden />
    </Link>
  </div>
);
