'use client';

import { Copy } from 'lucide-react';
import { useState } from 'react';

import { ctaAttrs } from '@/components/analytics/cta';
import { buttonVariants } from '@/components/ui/button';

/**
 * Copia el email al portapapeles. Penpot no tiene el estado "copiado": por
 * ahora solo se anuncia a lectores de pantalla.
 */
export const CopyEmailButton = ({ email }: { email: string }) => {
  const [copied, setCopied] = useState(false);

  return (
    <>
      <button
        type='button'
        aria-label='Copiar email'
        {...ctaAttrs('email', 'contact')}
        onClick={async () => {
          await navigator.clipboard.writeText(email);
          setCopied(true);
        }}
        className={buttonVariants({ variant: 'secondary', size: 'icon' })}
      >
        <Copy aria-hidden />
      </button>
      <span role='status' className='sr-only'>
        {copied ? 'Email copiado' : ''}
      </span>
    </>
  );
};
