import { cn } from '@/lib/utils';

/** "Stat / …" de Penpot: cifra en Fraunces y etiqueta de dos líneas al lado. */
export const Stat = ({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) => (
  <div className={cn('flex items-center gap-3', className)}>
    <span className='font-heading text-stat font-medium'>{value}</span>
    <span className='text-label whitespace-pre-line text-muted-foreground'>
      {label}
    </span>
  </div>
);
