import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// CTAs del board 01 · Inicio: un primario por vista ("Ver proyectos").
// En móvil se apilan a lo ancho con el primario arriba.
export const HeroActions = () => (
  <div className='flex flex-col-reverse gap-4 sm:flex-row sm:items-center'>
    <Link
      href='/contacto'
      className={cn(buttonVariants({ variant: 'outline' }))}
    >
      <Mail aria-hidden />
      Hablemos
    </Link>
    <Link href='/proyectos' className={cn(buttonVariants())}>
      Ver proyectos
      <ArrowRight aria-hidden />
    </Link>
  </div>
);
