'use client';

import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile en modo invisible: no ocupa espacio ni se ve. Agrega al
 * formulario el input `cf-turnstile-response`, que verifica la Server Action.
 * Cada token vale un solo envío: al cambiar `resetKey` (cada respuesta del
 * formulario) se vuelve a dibujar para obtener otro.
 */
export const Turnstile = ({
  siteKey,
  resetKey,
}: {
  siteKey: string;
  resetKey: unknown;
}) => {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !container.current || !window.turnstile) return;
    const widget = window.turnstile.render(container.current, { sitekey: siteKey });
    return () => window.turnstile?.remove(widget);
  }, [ready, siteKey, resetKey]);

  return (
    <>
      <Script
        src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        onReady={() => setReady(true)}
      />
      {/* Fuera del flujo: invisible, no debe sumar el espacio entre campos. */}
      <div ref={container} className='absolute' />
    </>
  );
};
