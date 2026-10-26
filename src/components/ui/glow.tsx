import { cn } from '@/lib/utils';

/**
 * "Brillo" de los boards v2: elipse con degradado radial del acento a
 * transparente. Decorativo; la posición y el tamaño van en `className`.
 */
export const Glow = ({
  color,
  alpha,
  className,
}: {
  color: 'blue' | 'cyan';
  alpha: number; // opacidad del centro, en % (Penpot: 0.22 → 22)
  className?: string;
}) => (
  <span
    aria-hidden
    className={cn('pointer-events-none absolute', className)}
    style={{
      background: `radial-gradient(closest-side, color-mix(in srgb, var(--${color}) ${alpha}%, transparent), transparent)`,
    }}
  />
);
