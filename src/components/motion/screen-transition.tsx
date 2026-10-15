import { ViewTransition, type ReactNode } from 'react';

// Clase de animación para cada tipo de navegación (ver transitionTo y el CSS
// de globals.css). Sin tipo (atrás del navegador, refresh), no se anima.
export const screenTransitions = Object.fromEntries([
  ...['push-left', 'push-right', 'step-left', 'step-right', 'push-up', 'push-down', 'dissolve'].map(
    (type) => [type, type],
  ),
  ['default', 'none'],
]);

/**
 * Transición entre pantallas del prototipo: envuelve el contenido de cada
 * página para que entre y salga según el `transitionTypes` del enlace.
 */
export const ScreenTransition = ({ children }: { children: ReactNode }) => (
  <ViewTransition enter={screenTransitions} exit={screenTransitions} default='none'>
    {children}
  </ViewTransition>
);
