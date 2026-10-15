import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

// Arte decorativo de las tarjetas de 04 · Proyectos, redibujado en SVG con las
// medidas de Penpot. Los bordes interiores van desplazados medio trazo.

type ArtProps = { className?: string };

const Thumbnail = ({
  width = 340,
  height = 218,
  children,
  className,
}: {
  width?: number;
  height?: number;
  children: ReactNode;
  className?: string;
}) => (
  <div
    aria-hidden
    className={cn(
      'overflow-hidden rounded-[12px] bg-linear-to-br/srgb from-muted to-background',
      className,
    )}
  >
    <svg viewBox={`0 0 ${width} ${height}`} className='block h-auto w-full'>
      <rect
        x='16'
        y='16'
        width={width - 32}
        height={height - 32}
        rx='8'
        className='fill-card/55'
      />
      {children}
    </svg>
  </div>
);

// La miniatura de la tarjeta (340 × 218) y la del modal de detalle (520 × 210)
// son la misma composición con otro ancho.
const quote = {
  card: {
    width: 340,
    height: 218,
    input: 127,
    chart: { x: 179, width: 129 },
    line: 'M189 120 205 99 220 105 236 87 251 93 267 75 282 83 298 66',
    toast: 71,
  },
  detail: {
    width: 520,
    height: 210,
    input: 210,
    chart: { x: 262, width: 226 },
    line: 'M272 120 301 99 331 105 360 87 390 93 419 75 449 83 478 66',
    toast: 124,
  },
};

/** Portal de cotización B2B: formulario, gráfico y aviso de PDF listo. */
export const QuoteThumbnail = ({
  detail = false,
  className,
}: ArtProps & { detail?: boolean }) => {
  const { width, height, input, chart, line, toast } = detail
    ? quote.detail
    : quote.card;

  return (
    <Thumbnail width={width} height={height} className={className}>
      {[34, 78, 122].map((y) => (
        <g key={y}>
          <rect x='32' y={y} width='50' height='5' rx='2' className='fill-muted-foreground/45' />
          <rect
            x='32.5'
            y={y + 10.5}
            width={input - 1}
            height='21'
            rx='3.5'
            className='fill-background stroke-border'
          />
        </g>
      ))}
      <rect x='32' y='166' width='72' height='22' rx='4' className='fill-primary' />
      <rect
        x={chart.x + 0.5}
        y='34.5'
        width={chart.width - 1}
        height='103'
        rx='5.5'
        className='fill-card stroke-border'
      />
      <path
        d={line}
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='fill-none stroke-accent-text'
      />
      <rect x={chart.x} y='150' width={chart.width} height='28' rx='6' className='fill-primary' />
      <circle cx={chart.x + 14} cy='164' r='4' className='fill-card' />
      <rect x={chart.x + 26} y='162' width={toast} height='4' rx='2' className='fill-terminal-text/60' />
    </Thumbnail>
  );
};

/** Gestión de envíos: caja empacada y seguimiento por etapas. */
export const ShippingThumbnail = ({ className }: ArtProps) => (
  <Thumbnail className={className}>
    <rect
      x='32.75'
      y='36.75'
      width='138.5'
      height='148.5'
      rx='3.25'
      strokeWidth='1.5'
      className='fill-none stroke-accent-text/45'
    />
    <rect x='40' y='44' width='70' height='60' rx='3' className='fill-primary/55' />
    <rect x='114' y='44' width='50' height='90' rx='3' className='fill-primary/35' />
    <rect x='40' y='108' width='70' height='70' rx='3' className='fill-primary/25' />
    <rect x='114' y='138' width='50' height='40' rx='3' className='fill-primary/60' />
    <rect x='215' y='52' width='2' height='120' className='fill-border' />
    {[46, 86, 126, 166].map((y) => (
      <g key={y}>
        <circle cx='216' cy={y + 6} r='6' className='fill-accent-text' />
        <rect x='234' y={y + 2} width='64' height='5' rx='2' className='fill-foreground/35' />
        <rect x='234' y={y + 12} width='40' height='4' rx='2' className='fill-muted-foreground/35' />
      </g>
    ))}
  </Thumbnail>
);

/** Plataforma cripto bancaria: nodos de un flujo. */
export const NodesMark = ({ className }: ArtProps) => (
  <svg aria-hidden viewBox='0 0 48 76' width='48' height='76' className={className}>
    <rect x='7' y='7' width='2' height='60' className='fill-accent-text/40' />
    {[
      [8, 8],
      [40, 38],
      [8, 68],
    ].map(([cx, cy]) => (
      <circle
        key={cy}
        cx={cx}
        cy={cy}
        r='7'
        strokeWidth='2'
        className='fill-card stroke-accent-text'
      />
    ))}
  </svg>
);

/** Historial crediticio digital: teléfono con validación facial. */
export const PhoneMark = ({ className }: ArtProps) => (
  <svg aria-hidden viewBox='0 0 48 84' width='48' height='84' className={className}>
    <rect
      x='1'
      y='1'
      width='46'
      height='82'
      rx='9'
      strokeWidth='2'
      className='fill-none stroke-accent-text'
    />
    <rect x='16' y='6' width='16' height='3' rx='1.5' className='fill-accent-text' />
    <circle cx='24' cy='29' r='8.25' strokeWidth='1.5' className='fill-none stroke-accent-text' />
    <rect x='10' y='48' width='28' height='2' className='fill-accent-text/50' />
  </svg>
);
