import {
  ArrowLeftRight,
  Blocks,
  ChartLine,
  LayoutTemplate,
  Package,
  type LucideIcon,
} from 'lucide-react';
import {
  siAngular,
  siHeroui,
  siJest,
  siLaravel,
  siMysql,
  siNextdotjs,
  siReact,
  siReacthookform,
  siRedux,
  siShadcnui,
  siTypescript,
  type SimpleIcon,
} from 'simple-icons';

import { cn } from '@/lib/utils';

// Tecnologías de src/content/projects.json con logo de marca (Simple Icons).
const brands: Record<string, SimpleIcon> = {
  'Next.js': siNextdotjs,
  TypeScript: siTypescript,
  HeroUI: siHeroui,
  'React Hook Form': siReacthookform,
  'shadcn/ui': siShadcnui,
  Jest: siJest,
  React: siReact,
  'Redux Toolkit': siRedux,
  Laravel: siLaravel,
  Angular: siAngular,
  MySQL: siMysql,
};

// Sin logo de marca: ícono de lucide en accent/text.
const generic: Record<string, LucideIcon> = {
  WebSockets: ArrowLeftRight,
  Recharts: ChartLine,
  Microfrontends: Blocks,
  Liferay: LayoutTemplate,
  BoxPacker: Package,
};

// Marcas casi negras (Next.js, shadcn/ui…) no se verían sobre bg/base: van en text/primary.
const isDark = (hex: string) => {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
};

/** Logo de una tecnología con su color de marca (spec: excepción a la paleta). */
export const ToolIcon = ({ name, className }: { name: string; className?: string }) => {
  const brand = brands[name];
  if (brand)
    return (
      <svg
        aria-hidden
        viewBox='0 0 24 24'
        fill='currentColor'
        className={cn(isDark(brand.hex) && 'text-fg', className)}
        style={isDark(brand.hex) ? undefined : { color: `#${brand.hex}` }}
      >
        <path d={brand.path} />
      </svg>
    );
  const Icon = generic[name];
  return Icon ? <Icon aria-hidden className={cn('text-accent', className)} /> : null;
};
